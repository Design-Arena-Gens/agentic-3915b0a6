'use client';

import { WorkflowStep } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StepDetailProps {
  step: WorkflowStep | null;
}

export function StepDetail({ step }: StepDetailProps) {
  if (!step) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white/30 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          Select a step to inspect its automation blueprint.
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-neutral-200 bg-white/80 p-6 dark:border-neutral-800 dark:bg-neutral-900/50">
      <div>
        <div className="text-xs uppercase text-neutral-500">{step.kind}</div>
        <h2 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{step.title}</h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{step.description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoBlock label="Owner" value={step.owner} />
        <InfoBlock label="Duration" value={step.duration} />
      </div>

      <ListBlock
        title="Inputs"
        items={step.inputs}
        badgeClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
      />
      <ListBlock
        title="Outputs"
        items={step.outputs}
        badgeClass="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300"
      />

      {step.tools.length > 0 && (
        <ListBlock
          title="Tooling"
          items={step.tools}
          badgeClass="bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
        />
      )}

      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
        <div className="font-semibold uppercase tracking-wide text-xs text-neutral-500 dark:text-neutral-400">
          Success Criteria
        </div>
        <p className="mt-1">{step.successCriteria}</p>
      </div>

      {step.automationHint && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
          <div className="font-semibold uppercase tracking-wide text-xs text-blue-500 dark:text-blue-300">
            Automation Hint
          </div>
          <p className="mt-1">{step.automationHint}</p>
        </div>
      )}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white/80 p-3 text-sm dark:border-neutral-800 dark:bg-neutral-900/80">
      <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{label}</div>
      <div className="mt-1 font-medium text-neutral-900 dark:text-neutral-100">{value}</div>
    </div>
  );
}

function ListBlock({
  title,
  items,
  badgeClass,
}: {
  title: string;
  items: string[];
  badgeClass: string;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {title}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className={cn("rounded-lg px-2 py-1 text-xs font-medium", badgeClass)}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
