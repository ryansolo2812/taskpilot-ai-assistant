import type { ToolId } from "./ai-prompts";

export type ChatMsg = { role: "user" | "assistant"; content: string };

export async function streamAI(
  tool: ToolId,
  messages: ChatMsg[],
  onText: (full: string) => void,
  signal?: AbortSignal,
): Promise<{ text: string; error?: string }> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool, messages }),
    signal,
  });
  if (!res.ok || !res.body) return { text: "", error: (await res.text()) || "Request failed." };
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    text += dec.decode(value, { stream: true });
    const i = text.indexOf("[[ERROR]]");
    onText(i >= 0 ? text.slice(0, i).trim() : text);
  }
  const i = text.indexOf("[[ERROR]]");
  if (i >= 0) return { text: text.slice(0, i).trim(), error: text.slice(i + 9) };
  if (!text.trim()) return { text, error: "The AI returned an empty response. Please try again." };
  return { text };
}
