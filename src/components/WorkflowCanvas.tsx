'use client';

import { WorkflowStep } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WorkflowCanvasProps {
  steps: WorkflowStep[];
  selectedStepId: string | null;
  onSelect: (stepId: string) => void;
}

export function WorkflowCanvas({ steps, selectedStepId, onSelect }: WorkflowCanvasProps) {
  return (
    <ol className="relative space-y-4 border-l border-neutral-200 pl-6 dark:border-neutral-800">
      {steps.map((step, index) => {
        const isSelected = step.id === selectedStepId;
        return (
          <li key={step.id} className="group">
            <button
              type="button"
              onClick={() => onSelect(step.id)}
              className={cn(
                "flex w-full flex-col gap-2 rounded-xl border border-transparent bg-white/60 p-4 text-left transition hover:border-neutral-300 hover:bg-white dark:bg-neutral-900 dark:hover:border-neutral-700",
                isSelected && "border-blue-500 shadow-sm ring-1 ring-blue-500/30 hover:bg-white",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wide text-neutral-500">{`Step ${
                  index + 1
                } • ${step.kind}`}</div>
                <div className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                  {step.owner}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{step.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{step.description}</p>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {step.outputs.slice(0, 2).map((output) => (
                  <span
                    key={output}
                    className="rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    {output}
                  </span>
                ))}
                {step.tools.slice(0, 2).map((tool) => (
                  <span
                    key={tool}
                    className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
