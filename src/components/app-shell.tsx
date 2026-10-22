import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard, Mail, FileText, CalendarClock, BookOpenText, MessagesSquare, ShieldCheck,
  Menu, X, Sun, Moon, Compass, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const NAV = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Notes Summarizer", url: "/notes", icon: FileText },
  { title: "Task Planner", url: "/planner", icon: CalendarClock },
  { title: "Research Assistant", url: "/research", icon: BookOpenText },
  { title: "AI Chat", url: "/chat", icon: MessagesSquare },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  const linkCls = (active: boolean) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
      active
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
    );

  return (
    <div className="flex min-h-screen w-full">
      {open && (
        <button aria-label="Close menu" className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Compass className="h-5 w-5" />
            </span>
            <span className="font-display text-base font-semibold text-card-foreground">
              TaskPilot <span className="text-primary">AI</span>
            </span>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workspace</p>
          {NAV.map((item) => (
            <Link key={item.url} to={item.url} className={linkCls(path === item.url)}>
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
          <div className="mt-auto pb-4">
            <Link to="/about" className={linkCls(path === "/about")}>
              <ShieldCheck className="h-4 w-4" />
              About & Responsible AI
            </Link>
          </div>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-8">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {[...NAV, { title: "About & Responsible AI", url: "/about" }].find((n) => n.url === path)?.title ?? "TaskPilot AI"}
          </span>
          <Button variant="outline" size="sm" className="ml-auto gap-2" onClick={() => setLight((v) => !v)} aria-label="Toggle theme">
            {light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {light ? "Dark" : "Light"}
          </Button>
        </header>
        <div className="border-b border-border bg-warning px-4 py-2 text-xs text-warning-foreground md:px-8">
          <p className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              AI-generated content may be inaccurate — always review before using. Do not enter confidential, personal or sensitive company data.
              Nothing is saved; your work clears on refresh.
            </span>
          </p>
        </div>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
