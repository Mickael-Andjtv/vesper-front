import type { AssistantResponse } from "@/types/assistant";

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

export class AssistantApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "AssistantApiError";
  }
}

export async function generateAssistantResponse(
  prompt: string,
  signal: AbortSignal,
): Promise<AssistantResponse> {
  alert(apiUrl)
  const response = await fetch(`${apiUrl}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
    signal,
  });
  if (!response.ok) {
    throw new AssistantApiError("Le serveur de Vesper ne répond pas actuellement.", response.status);
  }

  const data: unknown = await response.json();
  if (!isAssistantResponse(data)) {
    throw new AssistantApiError("La réponse du serveur est invalide.");
  }
  return data;
}

export function musicStreamUrl(query: string): string {
  return `${apiUrl}/music/stream?query=${encodeURIComponent(query)}`;
}

function isAssistantResponse(value: unknown): value is AssistantResponse {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return ["reply", "emotion", "action", "action_data"].every(
    (key) => typeof data[key] === "string",
  );
}
