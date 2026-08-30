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

  const submitTranscript = useCallback(async (text: string) => {
    const cleanedText = text.trim();
    if (!cleanedText) {
      setError("Je n'ai pas entendu votre voix. Réessayez.");
      setStatus("error");
      return;
    }
    setError(null);
    setStatus("processing");
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const data = await generateAssistantResponse(cleanedText, controller.signal);
      setEmotion(resolveEmotion(data.emotion));
      setResponseText(data.reply);
      if (data.action === "play_music") await startMusic(data.action_data);
      if (data.reply) speak(data.reply);
      else setStatus("idle");
    } catch (caught) {
      if ((caught as DOMException).name !== "AbortError") {
        setError(caught instanceof Error ? caught.message : "Impossible de contacter le serveur.");
        setStatus("error");
      }
    } finally {
      requestRef.current = null;
    }
  }, [speak, startMusic]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const startListening = useCallback(() => {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      setError("La reconnaissance vocale n'est pas prise en charge par ce navigateur.");
      setStatus("error");
      return;
    }

    setError(null);
    setResponseText("");
    transcriptRef.current = "";

    const recognition = new Recognition();
    recognition.lang = "fr-FR";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let accumulated = "";
      for (let i = 0; i < event.results.length; i++) {
        accumulated += event.results[i][0]?.transcript ?? "";
      }
      transcriptRef.current = accumulated;
    };

    recognition.onerror = (event) => {
      if (event.error !== "no-speech") {
        setError("Erreur microphone : " + event.error);
        setStatus("error");
      }
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      // On soumet la transcription enregistrée dès que l'écoute s'arrête
      void submitTranscript(transcriptRef.current);
    };

    recognitionRef.current = recognition;
    setStatus("listening");

    try {
      recognition.start();
    } catch {
      setError("Impossible de démarrer le microphone.");
      setStatus("error");
    }
  }, [submitTranscript]);

  useEffect(() => () => {
    recognitionRef.current?.abort();
    requestRef.current?.abort();
    window.speechSynthesis?.cancel();
    stopMusic();
  }, [stopMusic]);

  return { status, emotion, responseText, error, isMusicPlaying, startListening, stopListening, stopMusic };
}