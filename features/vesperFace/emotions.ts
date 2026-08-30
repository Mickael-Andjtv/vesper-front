import type { BackendEmotion } from "@/types/assistant";

/** Visual states supported by EmoEyes. `normal` is the UI name for backend `neutral`. */
export type Emotion = "normal" | Exclude<BackendEmotion, "neutral">;

const emotionMap: Record<BackendEmotion, Emotion> = {
  neutral: "normal",
  happy: "happy",
  sad: "sad",
  thinking: "thinking",
  sarcastic: "sarcastic",
  surprised: "surprised",
  laugh: "laugh",
  angry: "angry",
};

export function resolveEmotion(value: unknown): Emotion {
  return typeof value === "string" && value in emotionMap
    ? emotionMap[value as BackendEmotion]
    : "normal";
}
