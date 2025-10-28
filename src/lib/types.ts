export type StepKind =
  | "trigger"
  | "analysis"
  | "action"
  | "automation"
  | "decision"
  | "handoff"
  | "measurement";

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  kind: StepKind;
  owner: string;
  inputs: string[];
  outputs: string[];
  tools: string[];
  dependsOn: string[];
  duration: string;
  successCriteria: string;
  automationHint?: string;
}

export interface WorkflowMetric {
  name: string;
  target: string;
  rationale: string;
}

export interface WorkflowGuardrail {
  label: string;
  detail: string;
  severity: "low" | "medium" | "high";
}

export interface WorkflowPlan {
  id: string;
  title: string;
  summary: string;
  persona: string;
  triggerStatement: string;
  completionCriteria: string[];
  steps: WorkflowStep[];
  metrics: WorkflowMetric[];
  guardrails: WorkflowGuardrail[];
  automationLevel: "orchestration" | "co-pilot" | "autonomous";
  integrations: string[];
}

export interface WorkflowAgentOptions {
  automationLevel: "orchestration" | "co-pilot" | "autonomous";
  complexity: "lean" | "balanced" | "enterprise";
  preferredOwners: string[];
  existingSystems: string[];
}
