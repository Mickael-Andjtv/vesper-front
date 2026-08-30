export const BACKEND_EMOTIONS = [
  "neutral",
  "happy",
  "sad",
  "thinking",
  "sarcastic",
  "surprised",
  "laugh",
  "angry",
] as const;

export type BackendEmotion = (typeof BACKEND_EMOTIONS)[number];

export const ASSISTANT_ACTIONS = [
  "none",
  "show_code",
  "start_timer",
  "play_music",
  "get_weather",
  "web_search",
] as const;

export type AssistantAction = (typeof ASSISTANT_ACTIONS)[number];

export interface AssistantResponse {
  reply: string;
  emotion: BackendEmotion;
  action: AssistantAction;
  action_data: string;
}

export type AssistantStatus = "idle" | "listening" | "processing" | "speaking" | "error";
