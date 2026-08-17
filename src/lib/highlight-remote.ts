import {
  highlightsMapToHighlightedText,
  markHighlightsSynced,
  readLocalHighlights,
  sanitizeHighlightedText,
  type HighlightedText,
} from "@/lib/lesson-highlights";

export async function fetchRemoteHighlightedText(): Promise<HighlightedText | null> {
  const response = await fetch("/api/highlights", { credentials: "same-origin" });
  if (response.status === 401) return null;
  if (!response.ok) return {};
  const data = (await response.json()) as { highlightedText?: unknown };
  return sanitizeHighlightedText(data.highlightedText);
}

export async function pushLocalHighlightsToRemote(keepalive = false): Promise<boolean> {
  const response = await fetch("/api/highlights", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    keepalive,
    body: JSON.stringify({
      highlightedText: highlightsMapToHighlightedText(readLocalHighlights()),
    }),
  });
  if (!response.ok) return false;
  markHighlightsSynced();
  return true;
}
