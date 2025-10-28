'use client';

import { useCallback, useState } from "react";

import { WorkflowPlan } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AgentSidebarProps {
  plan: WorkflowPlan | null;
}

export function AgentSidebar({ plan }: AgentSidebarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!plan) return;
    const payload = JSON.stringify(plan, null, 2);
    await navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [plan]);

  if (!plan) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white/40 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          Describe your workflow on the left and the agent will craft a blueprint here.
        </div>
      </div>
    );
  }

  return (
    <aside className="flex h-full flex-col gap-6 rounded-2xl border border-neutral-200 bg-white/70 p-6 dark:border-neutral-800 dark:bg-neutral-900/60">
      <header>
        <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{plan.persona}</div>
        <h1 className="mt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">{plan.title}</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{plan.summary}</p>
      </header>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Trigger
        </h2>
        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">{plan.triggerStatement}</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Completion Criteria
        </h2>
        <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
          {plan.completionCriteria.map((criterion) => (
            <li key={criterion} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
              <span>{criterion}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <HeaderBadge label="Automation Mode" value={plan.automationLevel} />
        {plan.integrations.length > 0 && (
          <div className="mt-3">
            <h3 className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Integrations</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {plan.integrations.map((integration) => (
                <span
                  key={integration}
                  className="rounded-lg border border-neutral-200 bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  {integration}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Metrics
        </h2>
        <ul className="space-y-3 pt-2">
          {plan.metrics.map((metric) => (
            <li
              key={metric.name}
              className="rounded-xl border border-neutral-200 bg-white/80 p-3 text-sm dark:border-neutral-800 dark:bg-neutral-900/70"
            >
              <div className="font-semibold text-neutral-800 dark:text-neutral-200">{metric.name}</div>
              <div className="text-xs text-blue-600 dark:text-blue-300">{metric.target}</div>
              <p className="mt-1 text-neutral-600 dark:text-neutral-400">{metric.rationale}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Guardrails
        </h2>
        <ul className="space-y-3 pt-2">
          {plan.guardrails.map((guardrail) => (
            <li
              key={guardrail.label}
              className="rounded-xl border border-neutral-200 bg-white/80 p-3 text-sm dark:border-neutral-800 dark:bg-neutral-900/70"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-neutral-800 dark:text-neutral-100">{guardrail.label}</div>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold uppercase",
                    guardrail.severity === "high" && "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300",
                    guardrail.severity === "medium" &&
                      "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-200",
                    guardrail.severity === "low" &&
                      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
                  )}
                >
                  {guardrail.severity}
                </span>
              </div>
              <p className="mt-1 text-neutral-600 dark:text-neutral-400">{guardrail.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <button
        type="button"
        onClick={handleCopy}
        className="mt-auto rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700 dark:bg-blue-500 dark:hover:bg-blue-400"
      >
        {copied ? "Plan copied to clipboard" : "Copy plan JSON"}
      </button>
    </aside>
  );
}

function HeaderBadge({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{label}</h3>
      <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold uppercase text-white dark:bg-blue-500">
        {value}
      </div>
    </div>
  );
}
