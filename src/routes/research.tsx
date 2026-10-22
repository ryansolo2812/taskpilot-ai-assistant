import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpenText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, PageHeader, ToolLayout, useGenerator } from "@/components/tool-kit";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/research")({
  head: () => seo("Research Assistant", "Summarize articles into key insights and recommendations in simple language."),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const gen = useGenerator("research");
  return (
    <>
      <PageHeader icon={<BookOpenText className="h-6 w-6" />} title="Research Assistant" description="Get a plain-language summary, insights and recommendations from an article." />
      <ToolLayout
        gen={gen}
        disabled={!topic.trim() && !text.trim()}
        onSubmit={() =>
          gen.run(`Topic: ${topic || "(not given)"}\nURL: ${url || "(none)"}\nArticle text:\n"""\n${text || "(no text provided)"}\n"""`)
        }
        form={
          <>
            <Field label="Topic"><Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Hybrid work and team productivity" /></Field>
            <Field label="Article text" hint="Pasting the text gives the most accurate result.">
              <Textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste the article or report here…" />
            </Field>
            <Field label="Source URL (optional)" hint="The AI can't open links — paste the text above for a real summary.">
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
            </Field>
          </>
        }
      />
    </>
  );
}
