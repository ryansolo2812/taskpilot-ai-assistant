import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/tool-kit";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => seo("About & Responsible AI", "How TaskPilot AI works and how to use AI responsibly at work."),
  component: AboutPage,
});

const ITEMS = [
  ["Review everything", "AI can make mistakes or misread context. Check facts, names, numbers and dates before you send or act on any output."],
  ["Protect confidential data", "Don't paste passwords, client secrets, personal data, financials or anything covered by an NDA. Anonymize where you can."],
  ["No invented facts", "TaskPilot is instructed to use only what you provide and to mark missing details as \"Not specified\" rather than guess."],
  ["Nothing is stored", "There are no accounts and no database. Your inputs and results live only in this browser tab and clear on refresh."],
  ["You stay accountable", "TaskPilot assists your work — final decisions and communications remain your responsibility."],
];

function AboutPage() {
  return (
    <div className="max-w-3xl">
      <PageHeader icon={<ShieldCheck className="h-6 w-6" />} title="About & Responsible AI" description="TaskPilot AI helps professionals write, summarize, plan and research faster." />
      <div className="space-y-3">
        {ITEMS.map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-semibold">{t}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
