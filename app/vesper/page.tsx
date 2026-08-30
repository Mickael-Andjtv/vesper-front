"use client";

import { EmoEyes } from "@/features/vesperFace";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";

const statusLabel = {
  idle: "Cliquez pour parler",
  listening: "Je vous écoute… Cliquez à nouveau quand vous avez terminé.",
  processing: "Je réfléchis…",
  speaking: "Vesper répond…",
  error: "Une erreur est survenue.",
};

export default function Home() {
  const { status, emotion, responseText, error, isMusicPlaying, startListening, stopListening, stopMusic } = useVoiceAssistant();
  const isListening = status === "listening";
  const isBusy = status === "processing" || status === "speaking";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-neutral-950 p-6 text-neutral-100">
      <div className={isListening ? "animate-pulse" : ""}>
        <EmoEyes size={130} emotion={emotion} />
      </div>
      <div className="min-h-16 max-w-xl text-center">
        <h1 className="text-sm font-semibold tracking-[0.35em] text-[#00BBFF]">VESPER</h1>
        <p className="mt-3 text-lg" role="status">{error ?? statusLabel[status]}</p>
        {responseText && !error ? <p className="mt-2 text-sm text-neutral-400">{responseText}</p> : null}
      </div>
      <button
        type="button"
        onClick={isListening ? stopListening : startListening}
        disabled={isBusy}
        aria-label={isListening ? "Arrêter l'enregistrement" : "Parler à Vesper"}
        className="grid size-24 place-items-center rounded-full bg-[#00BBFF] text-4xl text-neutral-950 shadow-[0_0_35px_rgba(0,187,255,0.55)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {isListening ? "■" : "🎙"}
      </button>
      {isMusicPlaying ? (
        <button type="button" onClick={stopMusic} className="rounded-full bg-neutral-800 px-5 py-2 text-sm hover:bg-neutral-700">
          ⏹ Arrêter la musique
        </button>
      ) : null}
    </main>
  );
}
