"use client";

import { useState } from "react";
import { EmoEyes } from "@/features/vesperFace/components";
import { Emotion } from "@/features/vesperFace/types/emotion.types";
import InputText from "@/features/inputText/components";

const EMOTIONS: { key: Emotion; label: string }[] = [
  { key: "normal", label: "Normal" },
  { key: "happy", label: "Happy" },
  { key: "laugh", label: "Rire" },
  { key: "sad", label: "Sad" },
  { key: "sarcastic", label: "Sarcastic" },
];

export default function Home() {
  const [emotion, setEmotion] = useState<Emotion>("normal");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-12 bg-neutral-950 p-6">
      <EmoEyes size={130} emotion={emotion} />

      <div className="flex flex-wrap items-center justify-center gap-3">
        {EMOTIONS.map((e) => {
          const active = e.key === emotion;
          return (
            <button
              key={e.key}
              onClick={() => setEmotion(e.key)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                active
                  ? "bg-[#00BBFF] text-neutral-950 shadow-[0_0_20px_rgba(0,187,255,0.6)]"
                  : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
              }`}
            >
              {e.label}
            </button>
          );
        })}
      </div>
      <InputText />
    </div>
  );
}
