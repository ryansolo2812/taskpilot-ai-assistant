import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, PageHeader, Pills, ToolLayout, useGenerator } from "@/components/tool-kit";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/planner")({
  head: () => seo("Task Planner", "Prioritize tasks and get a time-blocked daily or weekly schedule."),
  component: PlannerPage,
});

const PERIODS = ["Daily", "Weekly"] as const;

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("8");
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Daily");
  const gen = useGenerator("planner");
  return (
    <>
      <PageHeader icon={<CalendarClock className="h-6 w-6" />} title="Task Planner" description="List what's on your plate and get a prioritized, time-blocked plan." />
      <ToolLayout
        gen={gen}
        disabled={!tasks.trim() || !Number(hours)}
        onSubmit={() => gen.run(`Plan type: ${period}\nHours available ${period === "Daily" ? "today" : "this week"}: ${hours}\nTasks (with any deadlines or notes I gave):\n${tasks}`)}
        form={
          <>
            <Field label="Tasks" hint="One per line. Add deadlines or effort if you know them.">
              <Textarea rows={8} value={tasks} onChange={(e) => setTasks(e.target.value)} placeholder={"Finish Q3 report – due Friday\nReply to vendor emails\nPrepare slides for team sync (2h)"} />
            </Field>
            <Field label="Plan type"><Pills options={PERIODS} value={period} onChange={setPeriod} /></Field>
            <Field label={`Hours available (${period === "Daily" ? "per day" : "per week"})`}>
              <Input type="number" min={1} max={80} value={hours} onChange={(e) => setHours(e.target.value)} />
            </Field>
          </>
        }
      />
    </>
  );
}
