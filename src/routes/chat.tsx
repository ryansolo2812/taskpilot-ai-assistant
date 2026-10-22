import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Compass, Copy, Loader2, MessagesSquare, RefreshCw, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Markdown, PageHeader } from "@/components/tool-kit";
import { streamAI, type ChatMsg } from "@/lib/ai-client";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/chat")({
  head: () => seo("AI Chat", "Chat with a workplace assistant about communication, planning and productivity."),
  component: ChatPage,
});

const STARTERS = [
  "How do I politely decline a meeting?",
  "Give me a framework for running a 30-minute weekly team sync.",
  "How can I give constructive feedback to a colleague?",
  "Help me break a big project into milestones.",
];

function ChatPage() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const send = async (history: ChatMsg[]) => {
    setMessages([...history, { role: "assistant", content: "" }]);
    setLoading(true);
    setError(null);
    try {
      const r = await streamAI("chat", history, (t) => setMessages([...history, { role: "assistant", content: t }]));
      if (r.error) setError(r.error);
      setMessages(r.text ? [...history, { role: "assistant", content: r.text }] : history);
    } catch {
      setError("Could not reach the AI. Please try again.");
      setMessages(history);
    } finally {
      setLoading(false);
    }
  };

  const submit = (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");
    send([...messages, { role: "user", content: text.trim() }]);
  };

  const regenerate = () => {
    const lastUser = messages.map((m) => m.role).lastIndexOf("user");
    if (lastUser >= 0) send(messages.slice(0, lastUser + 1));
  };

  return (
    <>
      <PageHeader icon={<MessagesSquare className="h-6 w-6" />} title="AI Chat" description="A multi-turn assistant for everyday workplace questions." />
      <div className="flex h-[calc(100vh-17rem)] min-h-[480px] flex-col rounded-2xl border border-border bg-card">
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="grid h-full place-items-center">
              <div className="max-w-lg text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <Compass className="h-6 w-6" />
                </span>
                <p className="mt-4 text-sm text-muted-foreground">Try one of these to get started:</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {STARTERS.map((s) => (
                    <button key={s} onClick={() => submit(s)} className="rounded-xl border border-border bg-background/40 px-4 py-3 text-left text-sm transition hover:border-primary/60 hover:bg-accent">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground whitespace-pre-wrap">
                {m.content}
              </div>
            ) : (
              <div key={i} className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <Compass className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  {m.content ? <Markdown>{m.content}</Markdown> : <Loader2 className="mt-2 h-4 w-4 animate-spin text-primary" />}
                  {m.content && !(loading && i === messages.length - 1) && (
                    <div className="mt-1 flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 gap-1 px-2 text-xs" onClick={() => { navigator.clipboard.writeText(m.content); toast.success("Copied"); }}>
                        <Copy className="h-3 w-3" /> Copy
                      </Button>
                      {i === messages.length - 1 && (
                        <Button size="sm" variant="ghost" className="h-7 gap-1 px-2 text-xs" onClick={regenerate}>
                          <RefreshCw className="h-3 w-3" /> Regenerate
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ),
          )}
          {error && <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
          <div ref={endRef} />
        </div>
        <form className="flex items-end gap-2 border-t border-border p-3" onSubmit={(e) => { e.preventDefault(); submit(input); }}>
          {messages.length > 0 && (
            <Button type="button" size="icon" variant="ghost" aria-label="Clear chat" disabled={loading} onClick={() => { setMessages([]); setError(null); }}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(input); } }}
            placeholder="Ask a workplace question… (Shift+Enter for a new line)"
            className="max-h-40 min-h-10 resize-none"
          />
          <Button type="submit" size="icon" className="shrink-0 bg-gradient-primary" disabled={!input.trim() || loading} aria-label="Send">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </>
  );
}
