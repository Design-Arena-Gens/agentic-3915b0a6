'use client';

import { useMemo, useState } from "react";

import { AgentSidebar } from "@/components/AgentSidebar";
import { StepDetail } from "@/components/StepDetail";
import { WorkflowCanvas } from "@/components/WorkflowCanvas";
import { generateWorkflowPlan } from "@/lib/workflowAgent";
import { WorkflowPlan } from "@/lib/types";

const defaultBrief = `We need an automated workflow to triage incoming product feedback from multiple channels.
Group related feedback, tag urgency levels, push action items to the right squad, and keep leadership updated.
Integrate with Slack, Linear, and Notion.
Escalate blockers automatically when they appear more than twice in a week.`;

const automationModes: WorkflowPlan["automationLevel"][] = ["orchestration", "co-pilot", "autonomous"];
const complexityModes: Array<"lean" | "balanced" | "enterprise"> = ["lean", "balanced", "enterprise"];

export default function Home() {
  const [brief, setBrief] = useState(defaultBrief);
  const [workflowName, setWorkflowName] = useState("Feedback Intelligence Orchestrator");
  const [automationLevel, setAutomationLevel] = useState<WorkflowPlan["automationLevel"]>("co-pilot");
  const [complexity, setComplexity] = useState<"lean" | "balanced" | "enterprise">("balanced");
  const [ownersInput, setOwnersInput] = useState("Automation Orchestrator, Product Steward, Insight Analyst");
  const [systemsInput, setSystemsInput] = useState("Slack, Linear, Notion");
  const [plan, setPlan] = useState<WorkflowPlan | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const preferredOwners = useMemo(
    () =>
      ownersInput
        .split(/[,;\n]/)
        .map((value) => value.trim())
        .filter(Boolean),
    [ownersInput],
  );

  const existingSystems = useMemo(
    () =>
      systemsInput
        .split(/[,;\n]/)
        .map((value) => value.trim())
        .filter(Boolean),
    [systemsInput],
  );

  const selectedStep = useMemo(
    () => plan?.steps.find((step) => step.id === selectedStepId) ?? null,
    [plan, selectedStepId],
  );

  const handleGenerate = () => {
    setIsGenerating(true);
    window.setTimeout(() => {
      const generatedPlan = generateWorkflowPlan({
        brief,
        workflowName,
        options: {
          automationLevel,
          complexity,
          preferredOwners,
          existingSystems,
        },
      });
      setPlan(generatedPlan);
      setSelectedStepId(generatedPlan.steps[0]?.id ?? null);
      setIsGenerating(false);
    }, 300);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-100 via-white to-neutral-100 pb-16 pt-10 text-neutral-900 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="mx-auto max-w-6xl px-6">
        <header className="rounded-3xl border border-neutral-200 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-500/10 dark:text-blue-200">
                Workflow Agent
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                Build adaptive workflows with an agentic designer
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-neutral-600 dark:text-neutral-400">
                Describe the outcomes you need and the agent will orchestrate a modular automation blueprint complete
                with owners, guardrails, and metrics you can immediately operationalize.
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white/70 p-5 text-sm text-neutral-600 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100">Agentic Playbook</div>
              <ul className="mt-3 space-y-2">
                <li>1. Capture intent + context</li>
                <li>2. Synthesize actionable stages</li>
                <li>3. Assign owners + guardrails</li>
                <li>4. Export or deploy to operations</li>
              </ul>
            </div>
          </div>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.65fr_1fr]">
          <section className="flex flex-col gap-6">
            <div className="rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Design Brief</h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Provide goals, signals, systems, and guardrails. The agent harmonizes them into a deployable plan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-400 dark:bg-blue-500 dark:hover:bg-blue-400 dark:disabled:bg-neutral-700"
                  disabled={isGenerating}
                >
                  {isGenerating ? "Synthesizing..." : "Generate Workflow"}
                </button>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Workflow Name
                    <input
                      className="mt-2 w-full rounded-xl border border-neutral-200 bg-white/70 px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/20"
                      value={workflowName}
                      onChange={(event) => setWorkflowName(event.target.value)}
                      placeholder="Give your workflow a memorable name"
                    />
                  </label>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Preferred Owners
                    <textarea
                      className="mt-2 h-24 w-full rounded-xl border border-neutral-200 bg-white/70 px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/20"
                      value={ownersInput}
                      onChange={(event) => setOwnersInput(event.target.value)}
                      placeholder="Comma separated owners"
                    />
                  </label>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Existing Systems
                    <textarea
                      className="mt-2 h-24 w-full rounded-xl border border-neutral-200 bg-white/70 px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/20"
                      value={systemsInput}
                      onChange={(event) => setSystemsInput(event.target.value)}
                      placeholder="Slack, Notion, CRM, etc."
                    />
                  </label>
                </div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 md:col-span-1">
                  Outcome + Context
                  <textarea
                    className="mt-2 h-[248px] w-full rounded-2xl border border-neutral-200 bg-white/70 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/20"
                    value={brief}
                    onChange={(event) => setBrief(event.target.value)}
                    placeholder="Share goals, signals, constraints, and audiences..."
                  />
                </label>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <ToggleGroup
                  label="Automation Mode"
                  options={automationModes}
                  active={automationLevel}
                  onChange={setAutomationLevel}
                />
                <ToggleGroup
                  label="System Complexity"
                  options={complexityModes}
                  active={complexity}
                  onChange={setComplexity}
                />
              </div>
            </div>

            {plan && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/70">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                      Workflow Blueprint
                    </h2>
                    <span className="text-xs uppercase tracking-wide text-neutral-400">
                      {plan.steps.length} steps
                    </span>
                  </div>
                  <div className="mt-4 max-h-[520px] overflow-y-auto pr-3">
                    <WorkflowCanvas
                      steps={plan.steps}
                      selectedStepId={selectedStepId}
                      onSelect={(stepId) => setSelectedStepId(stepId)}
                    />
                  </div>
                </div>
                <StepDetail step={selectedStep} />
              </div>
            )}
          </section>

          <AgentSidebar plan={plan} />
        </div>
      </div>
    </main>
  );
}

interface ToggleGroupProps<T extends string> {
  label: string;
  options: T[];
  active: T;
  onChange: (value: T) => void;
}

function ToggleGroup<T extends string>({ label, options, active, onChange }: ToggleGroupProps<T>) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{label}</div>
      <div className="mt-2 flex gap-2">
        {options.map((option) => {
          const isActive = option === active;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium capitalize transition ${
                isActive
                  ? "border-neutral-900 bg-neutral-900 text-white shadow-sm dark:border-blue-500 dark:bg-blue-500"
                  : "border-neutral-200 bg-white/60 text-neutral-600 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-500"
              }`}
            >
              {option.replace("-", " ")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
