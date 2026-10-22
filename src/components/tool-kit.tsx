import { useRef, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, RefreshCw, Loader2, Check, Wand2, Eye, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { streamAI } from "@/lib/ai-client";
import type { ToolId } from "@/lib/ai-prompts";

export function PageHeader({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="mb-8 flex items-start gap-4">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">{icon}</span>
      <div>
        <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-card-foreground">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function Pills<T extends string>({ options, value, onChange }: { options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Button key={o} type="button" size="sm" variant={value === o ? "default" : "outline"} onClick={() => onChange(o)}>
          {o}
        </Button>
      ))}
    </div>
  );
}

export function useGenerator(tool: ToolId) {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const last = useRef<string | null>(null);

  const run = async (prompt?: string) => {
    const p = prompt ?? last.current;
    if (!p) return;
    last.current = p;
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      const r = await streamAI(tool, [{ role: "user", content: p }], setOutput);
      setOutput(r.text);
      if (r.error) setError(r.error);
    } catch {
      setError("Could not reach the AI. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };
  return { output, setOutput, loading, error, run, regenerate: () => run(), hasRun: last.current !== null };
}

export function ToolLayout({ form, onSubmit, gen, disabled }: {
  form: ReactNode;
  onSubmit: () => void;
  gen: ReturnType<typeof useGenerator>;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <form
        className="h-fit space-y-5 rounded-2xl border border-border bg-card p-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {form}
        <Button type="submit" className="w-full gap-2 bg-gradient-primary shadow-glow" disabled={disabled || gen.loading}>
          {gen.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          {gen.loading ? "Generating…" : "Generate"}
        </Button>
      </form>
      <OutputPanel gen={gen} />
    </div>
  );
}

function OutputPanel({ gen }: { gen: ReturnType<typeof useGenerator> }) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { output, loading, error } = gen;

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex min-h-[420px] flex-col rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="text-sm font-medium text-card-foreground">Output</span>
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
        <div className="ml-auto flex gap-1.5">
          <Button size="sm" variant="ghost" className="gap-1.5" disabled={!output || loading} onClick={() => setEditing((v) => !v)}>
            {editing ? <Eye className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
            {editing ? "Preview" : "Edit"}
          </Button>
          <Button size="sm" variant="ghost" className="gap-1.5" disabled={!output || loading} onClick={copy}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            Copy
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5" disabled={!gen.hasRun || loading} onClick={gen.regenerate}>
            <RefreshCw className="h-3.5 w-3.5" />
            Regenerate
          </Button>
        </div>
      </div>
      <div className="flex-1 p-5">
        {error && <p className="mb-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        {!output && loading && (
          <div className="space-y-3">
            {[80, 95, 60, 88, 70].map((w, i) => (
              <div key={i} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${w}%` }} />
            ))}
          </div>
        )}
        {!output && !loading && !error && (
          <p className="grid h-full place-items-center text-center text-sm text-muted-foreground">
            Fill in the form and press Generate. Your result will appear here — you can edit it before copying.
          </p>
        )}
        {output &&
          (editing ? (
            <Textarea value={output} onChange={(e) => gen.setOutput(e.target.value)} className="min-h-[380px] font-mono text-sm" />
          ) : (
            <div className="prose-ai">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
            </div>
          ))}
      </div>
      {output && !loading && (
        <p className="border-t border-border px-5 py-2.5 text-xs text-muted-foreground">Review AI output for accuracy before sending or sharing.</p>
      )}
    </div>
  );
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-ai">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
