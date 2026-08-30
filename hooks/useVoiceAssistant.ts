"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { resolveEmotion, type Emotion } from "@/features/vesperFace/emotions";
import { generateAssistantResponse, musicStreamUrl } from "@/services/assistantApi";
import type { AssistantStatus } from "@/types/assistant";

type SpeechRecognitionEventLike = Event & {
  results: {
    length: number;
    [index: number]: { [index: number]: { transcript: string } };
  };
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const MUSIC_VOLUME = 0.3;
const DUCKED_MUSIC_VOLUME = 0.1;

export function useVoiceAssistant() {
  const [status, setStatus] = useState<AssistantStatus>("idle");
  const [emotion, setEmotion] = useState<Emotion>("normal");
  const [responseText, setResponseText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const shouldSubmitRef = useRef(false);
  const transcriptRef = useRef("");
  const musicRef = useRef<HTMLAudioElement | null>(null);

  const stopMusic = useCallback(() => {
    const music = musicRef.current;
    if (music) {
      music.pause();
      music.currentTime = 0;
    }
    setIsMusicPlaying(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window) || !text) {
      setStatus("idle");
      return;
    }
    window.speechSynthesis.cancel();
    const music = musicRef.current;
    if (music) music.volume = DUCKED_MUSIC_VOLUME;
    setStatus("speaking");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    const finish = () => {
      if (musicRef.current) musicRef.current.volume = MUSIC_VOLUME;
      setStatus("idle");
    };
    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
  }, []);

  const startMusic = useCallback(async (query: string) => {
    if (!query) return;
    stopMusic();
    const music = new Audio(musicStreamUrl(query));
    music.loop = false;
    music.volume = MUSIC_VOLUME;
    music.onended = () => setIsMusicPlaying(false);
    music.onerror = () => {
      setIsMusicPlaying(false);
      setError("Impossible de lancer la musique demandée.");
    };
    musicRef.current = music;
    try {
      await music.play();
      setIsMusicPlaying(true);
    } catch {
      setError("La lecture de la musique a été bloquée par le navigateur.");
    }
  }, [stopMusic]);

  const submitTranscript = useCallback(async (transcript: string) => {
    if (!transcript.trim()) {
      setError("Je n'ai pas entendu votre voix. Réessayez.");
      setStatus("error");
      return;
    }
    setStatus("processing");
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const data = await generateAssistantResponse(transcript.trim(), controller.signal);
      setEmotion(resolveEmotion(data.emotion));
      setResponseText(data.reply);
      if (data.action === "play_music") await startMusic(data.action_data);
      if (data.reply) speak(data.reply);
      else setStatus("idle");
    } catch (caught) {
      if ((caught as DOMException).name !== "AbortError") {
        setError(caught instanceof Error ? caught.message : "Impossible de contacter le serveur. Vérifiez votre connexion.");
        setStatus("error");
      }
    } finally {
      requestRef.current = null;
    }
  }, [speak, startMusic]);

  const stopListening = useCallback(() => {
    if (status === "listening") {
      shouldSubmitRef.current = true;
      recognitionRef.current?.stop();
    }
  }, [status]);

  const startListening = useCallback(() => {
    if (status !== "idle" && status !== "error") return;
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      setError("La reconnaissance vocale n'est pas prise en charge par ce navigateur.");
      setStatus("error");
      return;
    }
    setError(null);
    transcriptRef.current = "";
    shouldSubmitRef.current = false;
    const recognition = new Recognition();
    recognition.lang = "fr-FR";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      transcriptRef.current = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ");
    };
    recognition.onerror = (event) => {
      const messages: Record<string, string> = {
        "not-allowed": "L'accès au microphone est nécessaire pour parler avec Vesper.",
        "service-not-allowed": "L'accès au microphone est nécessaire pour parler avec Vesper.",
        "audio-capture": "Aucun microphone disponible.",
      };
      setError(messages[event.error] ?? "Une erreur est survenue pendant l'écoute.");
      setStatus("error");
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      if (shouldSubmitRef.current) {
        shouldSubmitRef.current = false;
        void submitTranscript(transcriptRef.current);
      } else {
        setStatus((current) => (current === "error" ? "error" : "idle"));
      }
    };
    recognitionRef.current = recognition;
    setStatus("listening");
    try {
      recognition.start();
    } catch {
      setError("Impossible de démarrer le microphone.");
      setStatus("error");
    }
  }, [status, submitTranscript]);

  useEffect(() => () => {
    recognitionRef.current?.abort();
    requestRef.current?.abort();
    window.speechSynthesis?.cancel();
    stopMusic();
  }, [stopMusic]);

  return { status, emotion, responseText, error, isMusicPlaying, startListening, stopListening, stopMusic };
}
