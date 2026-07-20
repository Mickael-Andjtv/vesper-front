"use client";

import { useEffect, useState } from "react";
import { EmoEyes } from "@/features/vesperFace/components";
import { Emotion } from "@/features/vesperFace/types/emotion.types";
import InputText from "@/features/inputText/components";
import { QueryResponse } from "@/src/api";

const EMOTIONS: { key: Emotion; label: string }[] = [
  { key: "normal", label: "Normal" },
  { key: "happy", label: "Happy" },
  { key: "laugh", label: "Rire" },
  { key: "sad", label: "Sad" },
  { key: "sarcastic", label: "Sarcastic" },
];

export default function Home() {
  const [emotion, setEmotion] = useState<Emotion>("normal");
  const [data, setData] = useState<QueryResponse>();

  useEffect(() => {
    if (!data) return;
    console.log(data);
    
    const newEmotion = data.emotion || "normal";
    if (emotion !== newEmotion) {
      switch (data.emotion) {
        case "neutral":
          setEmotion("normal");
          break;
        case "happy":
          setEmotion("happy");
          break;
        case "sad":
          setEmotion("sad");
          break;
        case "thinking":
          setEmotion("normal");
          break;
        case "sarcastic":
          setEmotion("laugh");
          break;
        case "surprised":
          setEmotion("sarcastic");
          break;

        default:
          setEmotion("normal");
          break;
      }
    }
  }, [data]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-12 bg-neutral-950 p-6">
      <EmoEyes size={130} emotion={emotion} />
      <InputText setData={setData} />
    </div>
  );
}
