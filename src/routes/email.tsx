import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, PageHeader, Pills, ToolLayout, useGenerator } from "@/components/tool-kit";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/email")({
  head: () => seo("Email Generator", "Generate professional workplace emails with subject lines in the right tone."),
  component: EmailPage,
});

const AUDIENCES = ["Client", "Manager", "Team"] as const;
const TONES = ["Formal", "Friendly", "Persuasive"] as const;

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [points, setPoints] = useState("");
  const [audience, setAudience] = useState<(typeof AUDIENCES)[number]>("Client");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Formal");
  const gen = useGenerator("email");

  return (
    <>
      <PageHeader icon={<Mail className="h-6 w-6" />} title="Email Generator" description="Describe what you need and get a ready-to-edit email with a subject line." />
      <ToolLayout
        gen={gen}
        disabled={!purpose.trim()}
        onSubmit={() =>
          gen.run(`Purpose of the email: ${purpose}\nKey points to include:\n${points || "(none given)"}\nAudience: ${audience}\nTone: ${tone}`)
        }
        form={
          <>
            <Field label="Purpose">
              <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Follow up on the project proposal" />
            </Field>
            <Field label="Key points" hint="One per line works best.">
              <Textarea rows={5} value={points} onChange={(e) => setPoints(e.target.value)} placeholder={"Timeline moved to next month\nNeed approval on budget"} />
            </Field>
            <Field label="Audience"><Pills options={AUDIENCES} value={audience} onChange={setAudience} /></Field>
            <Field label="Tone"><Pills options={TONES} value={tone} onChange={setTone} /></Field>
          </>
        }
      />
    </>
  );
}
