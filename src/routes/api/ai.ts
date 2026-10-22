import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";
import { SYSTEM_PROMPTS, type ToolId } from "@/lib/ai-prompts";

type Body = { tool: ToolId; messages: { role: "user" | "assistant"; content: string }[] };

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("AI is not configured.", { status: 500 });
        let body: Body;
        try {
          body = (await request.json()) as Body;
        } catch {
          return new Response("Invalid request.", { status: 400 });
        }
        const system = SYSTEM_PROMPTS[body.tool];
        if (!system || !Array.isArray(body.messages) || body.messages.length === 0) {
          return new Response("Invalid request.", { status: 400 });
        }
        const messages: ModelMessage[] = body.messages
          .slice(-30)
          .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content).slice(0, 40000) }));

        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
        });
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          system,
          messages,
          abortSignal: request.signal,
          maxRetries: 0,
          providerOptions: { openai: { store: false, forceReasoning: true, reasoningEffort: "low" } },
        });

        const enc = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const part of result.fullStream) {
                if (part.type === "text-delta") {
                  const p = part as unknown as { text?: string; delta?: string };
                  controller.enqueue(enc.encode(p.text ?? p.delta ?? ""));
                } else if (part.type === "error") {
                  controller.enqueue(enc.encode(`\n\n[[ERROR]]${friendly(part.error)}`));
                }
              }
            } catch (e) {
              controller.enqueue(enc.encode(`\n\n[[ERROR]]${friendly(e)}`));
            }
            controller.close();
          },
        });
        return new Response(stream, {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache, no-transform" },
        });
      },
    },
  },
});

function friendly(e: unknown): string {
  const status = (e as { statusCode?: number })?.statusCode;
  if (status === 429) return "Too many requests right now. Please wait a moment and try again.";
  if (status === 402) return "AI credits have run out. Please add credits to keep using TaskPilot AI.";
  if (status === 403) return "This request was declined by the AI provider.";
  return "Something went wrong generating a response. Please try again.";
}
