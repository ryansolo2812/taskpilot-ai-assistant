import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV } from "@/components/app-shell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => seo("Dashboard", "Your AI workplace co-pilot for emails, notes, planning and research."),
  component: Index,
});

const DESCRIPTIONS: Record<string, string> = {
  "/email": "Draft clear emails for clients, managers or your team in the right tone.",
  "/notes": "Turn messy meeting notes into a summary, decisions and action items.",
  "/planner": "Prioritize tasks by urgency and importance with a time-blocked schedule.",
  "/research": "Digest articles into insights and recommendations in plain language.",
  "/chat": "Ask anything about work — communication, planning, productivity.",
};

function Index() {
  const tools = NAV.filter((n) => n.url !== "/");
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card bg-hero p-8 md:p-12">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-muted-foreground">
          <Sparkle className="h-3 w-3 text-primary" /> Workplace productivity assistant
        </span>
        <h1 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight md:text-5xl">
          Less admin. <span className="bg-gradient-primary bg-clip-text text-transparent">More real work.</span>
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          TaskPilot AI drafts emails, summarizes meetings, plans your day and breaks down research — so you can focus on decisions.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild className="gap-2 bg-gradient-primary shadow-glow">
            <Link to="/email">Write an email <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="outline"><Link to="/notes">Summarize notes</Link></Button>
          <Button asChild variant="outline"><Link to="/planner">Plan my day</Link></Button>
          <Button asChild variant="ghost"><Link to="/chat">Open chat</Link></Button>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.url} to={t.url} className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-glow">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                <t.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold">{t.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{DESCRIPTIONS[t.url]}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
                Open <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
