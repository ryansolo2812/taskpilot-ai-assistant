import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Field, PageHeader, ToolLayout, useGenerator } from "@/components/tool-kit";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/notes")({
  head: () => seo("Notes Summarizer", "Summarize meeting notes into key points, decisions and action items."),
  component: NotesPage,
});

function NotesPage() {
  const [notes, setNotes] = useState("");
  const gen = useGenerator("notes");
  return (
    <>
      <PageHeader icon={<FileText className="h-6 w-6" />} title="Notes Summarizer" description="Paste meeting or work notes to get a summary, decisions and action items with owners." />
      <ToolLayout
        gen={gen}
        disabled={notes.trim().length < 10}
        onSubmit={() => gen.run(`Notes to summarize:\n"""\n${notes}\n"""`)}
        form={
          <Field label="Your notes" hint="Remove names or details you consider confidential.">
            <Textarea rows={14} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste your meeting notes here…" />
          </Field>
        }
      />
    </>
  );
}
