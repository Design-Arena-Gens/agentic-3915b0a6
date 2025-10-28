import { WorkflowAgentOptions, WorkflowPlan, WorkflowStep } from "./types";

const defaultOptions: WorkflowAgentOptions = {
  automationLevel: "co-pilot",
  complexity: "balanced",
  preferredOwners: ["Automation Orchestrator", "Domain Specialist", "QA Reviewer"],
  existingSystems: [],
};

const stepKindMatchers = [
  { regex: /\b(trigger|when|incoming|intake|request)\b/i, kind: "trigger" as const },
  { regex: /\b(assess|diagnose|classify|analy[sz]e|score|triage)\b/i, kind: "analysis" as const },
  { regex: /\b(send|update|build|configure|provision|generate|create|launch)\b/i, kind: "action" as const },
  { regex: /\b(sync|automate|schedule|script|api|webhook)\b/i, kind: "automation" as const },
  { regex: /\b(if|else|decide|route|branch|approval|fallback)\b/i, kind: "decision" as const },
  { regex: /\b(handoff|notify|assign|escalate|handover)\b/i, kind: "handoff" as const },
  { regex: /\b(track|measure|report|validate|qa|monitor)\b/i, kind: "measurement" as const },
];

const roleMatchers = [
  { regex: /\b(sales|deal|crm|pipeline|lead)\b/i, owner: "Revenue Ops Automation" },
  { regex: /\b(marketing|campaign|content|seo|brand)\b/i, owner: "Marketing Automation Pod" },
  { regex: /\b(support|ticket|case|customer|csat)\b/i, owner: "Support Automation Agent" },
  { regex: /\b(product|release|feature|roadmap|pm)\b/i, owner: "Product Ops Companion" },
  { regex: /\b(data|analytics|metric|dashboard)\b/i, owner: "Insights Copilot" },
  { regex: /\b(engineer|deployment|ci|code|dev)\b/i, owner: "DevOps Automation Runner" },
  { regex: /\b(hr|people|talent|candidate|onboarding)\b/i, owner: "People Ops Assistant" },
  { regex: /\b(finance|invoice|billing|spend|budget)\b/i, owner: "Finance Automation Bot" },
];

const integrationKeywords = [
  "slack",
  "teams",
  "notion",
  "airtable",
  "jira",
  "asana",
  "linear",
  "zapier",
  "hubspot",
  "salesforce",
  "zendesk",
  "stripe",
  "github",
  "gitlab",
  "email",
  "google sheets",
];

const metricsLibrary = [
  {
    name: "Cycle Time",
    target: "< 4 hours per workflow run",
    rationale: "Keeps automated flows feeling responsive and actionable.",
  },
  {
    name: "Automation Coverage",
    target: "≥ 80% of steps automated",
    rationale: "Ensures the assistant shoulders the repetitive orchestration.",
  },
  {
    name: "Human Touchpoints",
    target: "≤ 2 manual approvals per run",
    rationale: "Protects operator focus by only involving people when judgment is required.",
  },
  {
    name: "Data Confidence",
    target: "100% field validation prior to sync",
    rationale: "Prevents downstream system drift and data quality regressions.",
  },
  {
    name: "Alert Resolution Time",
    target: "< 30 minutes",
    rationale: "Keeps exceptions in check with swift human follow-up.",
  },
];

export interface AgentInput {
  brief: string;
  workflowName?: string;
  options?: Partial<WorkflowAgentOptions>;
}

export function generateWorkflowPlan(input: AgentInput): WorkflowPlan {
  const options: WorkflowAgentOptions = {
    ...defaultOptions,
    ...input.options,
    preferredOwners:
      input.options?.preferredOwners && input.options.preferredOwners.length > 0
        ? input.options.preferredOwners
        : defaultOptions.preferredOwners,
    existingSystems: input.options?.existingSystems ?? defaultOptions.existingSystems,
  };

  const brief = sanitiseBrief(input.brief);
  const sentences = extractSentences(brief);

  const integrations = Array.from(new Set(extractIntegrations(brief).concat(options.existingSystems)));
  const title = input.workflowName ?? inferTitle(brief);
  const persona = inferPersona(brief, options.automationLevel);

  const steps = sentences.length
    ? sentences.map((sentence, index) =>
        createStep({
          sentence,
          index,
          options,
        }),
      )
    : seedDefaultSteps(options);

  ensureDependencies(steps);

  const summary = buildSummary(title, persona, brief, steps, options.automationLevel);
  const triggerStatement = inferTrigger(brief);
  const completionCriteria = buildCompletionCriteria(steps);

  const guardrails = buildGuardrails(brief, options.automationLevel, integrations);
  const metrics = pickMetrics(options.complexity);

  return {
    id: `workflow-${Date.now()}`,
    title,
    summary,
    persona,
    triggerStatement,
    completionCriteria,
    steps,
    metrics,
    guardrails,
    automationLevel: options.automationLevel,
    integrations,
  };
}

function sanitiseBrief(brief: string): string {
  return brief.replace(/\s+/g, " ").trim();
}

function extractSentences(brief: string): string[] {
  return brief
    .split(/[\r\n\.!?]+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 6);
}

function inferPersona(brief: string, level: WorkflowAgentOptions["automationLevel"]): string {
  if (/\b(governance|compliance|audit)\b/i.test(brief)) {
    return "Governance Workflow Architect";
  }
  if (/\b(customer|support|ticket)\b/i.test(brief)) {
    return "Customer Experience Flow Builder";
  }
  if (/\b(product|release|feature)\b/i.test(brief)) {
    return "Product Launch Orchestrator";
  }
  if (/\b(revenue|sales|deal|crm)\b/i.test(brief)) {
    return "Revenue Workflow Strategist";
  }
  if (level === "autonomous") {
    return "Autonomous Runbook Engineer";
  }
  if (level === "orchestration") {
    return "Human-in-the-loop Workflow Partner";
  }
  return "Automation Copilot";
}

function inferTitle(brief: string): string {
  const titleCandidate = brief.split(/[.!?\n]/)[0] ?? "";
  if (titleCandidate.length > 6) {
    return titleCase(titleCandidate);
  }
  return "Intelligent Workflow Blueprint";
}

function buildSummary(
  title: string,
  persona: string,
  brief: string,
  steps: WorkflowStep[],
  level: WorkflowAgentOptions["automationLevel"],
): string {
  const verb = level === "autonomous" ? "executes" : level === "co-pilot" ? "collaborates on" : "orchestrates";
  return `${persona} ${verb.toLowerCase()} the "${title}" flow with ${steps.length} modular steps covering intake, enrichment, execution, and validation so the team can stay focused on high-impact work.`;
}

function inferTrigger(brief: string): string {
  if (/\b(inbound|incoming|new)\b/i.test(brief)) {
    return "When a new inbound request is detected in the primary channel.";
  }
  if (/\b(schedule|daily|weekly)\b/i.test(brief)) {
    return "On a scheduled cadence defined by the operations calendar.";
  }
  if (/\b(threshold|breach|alert)\b/i.test(brief)) {
    return "Whenever a monitored signal crosses a critical threshold.";
  }
  return "When the initiating signal aligned with the workflow goal is observed.";
}

function buildCompletionCriteria(steps: WorkflowStep[]): string[] {
  const finalStep = steps[steps.length - 1];
  return [
    `All mandatory steps (${steps.length}) complete without unresolved blockers.`,
    `Final deliverable "${finalStep.outputs[0] ?? finalStep.title}" confirmed as delivered.`,
    "Guardrails and validation checkpoints executed with no high-severity exceptions.",
  ];
}

function pickMetrics(complexity: WorkflowAgentOptions["complexity"]) {
  if (complexity === "lean") {
    return metricsLibrary.slice(0, 2);
  }
  if (complexity === "enterprise") {
    return metricsLibrary;
  }
  return metricsLibrary.slice(0, 3);
}

function buildGuardrails(
  brief: string,
  level: WorkflowAgentOptions["automationLevel"],
  integrations: string[],
) {
  const guardrails = [
    {
      label: "Data Validation",
      detail: "Validate structured fields before syncing to systems of record.",
      severity: "high" as const,
    },
    {
      label: "Exception Routing",
      detail: "Surface anomalies to the right owner via the escalation matrix within 15 minutes.",
      severity: "medium" as const,
    },
  ];

  if (level === "autonomous") {
    guardrails.push({
      label: "Autonomy Safeguard",
      detail: "Require human acknowledgment before executing irreversible actions.",
      severity: "high",
    });
  }

  if (/\b(compliance|gdpr|pii|audit)\b/i.test(brief)) {
    guardrails.push({
      label: "Compliance Review",
      detail: "Embed audit-ready logging for every decision branch impacting regulated data.",
      severity: "high",
    });
  }

  if (integrations.includes("slack") || integrations.includes("teams")) {
    guardrails.push({
      label: "Channel Hygiene",
      detail: "Throttle notifications to avoid channel fatigue; bundle updates when possible.",
      severity: "medium",
    });
  }

  return guardrails;
}

interface StepFactoryInput {
  sentence: string;
  index: number;
  options: WorkflowAgentOptions;
}

function createStep({ sentence, index, options }: StepFactoryInput): WorkflowStep {
  const id = `step-${index + 1}`;
  const kind = inferKind(sentence);
  const title = inferStepTitle(sentence, kind, index);
  const owner = inferOwner(sentence, options, index);
  const description = expandDescription(sentence, kind, owner);
  const inputs = index === 0 ? ["Structured intake data"] : [`Output from step-${index}`];
  const outputs = buildOutputs(sentence, index);
  const tools = inferTools(sentence, options);
  const duration = inferDuration(kind, options.complexity);
  const successCriteria = buildSuccessCriteria(sentence, kind);
  const automationHint = buildAutomationHint(kind, tools);

  return {
    id,
    title,
    description,
    kind,
    owner,
    inputs,
    outputs,
    tools,
    dependsOn: index === 0 ? [] : [`step-${index}`],
    duration,
    successCriteria,
    automationHint,
  };
}

function inferKind(sentence: string) {
  const matcher = stepKindMatchers.find((item) => item.regex.test(sentence));
  if (matcher) {
    return matcher.kind;
  }
  return "action" as const;
}

function inferStepTitle(sentence: string, kind: WorkflowStep["kind"], index: number) {
  if (kind === "trigger") {
    return "Activate Flow";
  }
  if (kind === "analysis") {
    return "Structured Assessment";
  }
  if (kind === "decision") {
    return "Smart Routing Decision";
  }
  if (kind === "handoff") {
    return "Targeted Handoff";
  }
  if (kind === "measurement") {
    return "Insights + QA";
  }
  const words = sentence.split(/\s+/).slice(0, 6).join(" ");
  return titleCase(words || `Step ${index + 1}`);
}

function inferOwner(sentence: string, options: WorkflowAgentOptions, index: number) {
  const match = roleMatchers.find((item) => item.regex.test(sentence));
  if (match) {
    return match.owner;
  }
  if (options.preferredOwners.length > 0) {
    return options.preferredOwners[index % options.preferredOwners.length];
  }
  return "Automation Partner";
}

function expandDescription(sentence: string, kind: WorkflowStep["kind"], owner: string) {
  const core = sentence.length > 0 ? sentence : "Execute the required action.";
  return `${owner} ${kind === "trigger" ? "listens for" : "handles"}: ${sentenceCase(core)}.`;
}

function buildOutputs(sentence: string, index: number) {
  const base = sentence.replace(/\b\d+\b/, "").trim();
  if (!base) {
    return [`Artifact from step ${index + 1}`];
  }
  if (/\b(report|dashboard|analysis)\b/i.test(base)) {
    return ["Insight packet ready for stakeholders"];
  }
  if (/\b(email|notification|message|alert)\b/i.test(base)) {
    return ["Notification delivered to subscribers"];
  }
  if (/\b(update|sync|crm|record|database)\b/i.test(base)) {
    return ["Record synchronized across systems"];
  }
  return [titleCase(base)];
}

function inferTools(sentence: string, options: WorkflowAgentOptions) {
  const tools = [];
  const lower = sentence.toLowerCase();
  integrationKeywords.forEach((integration) => {
    if (lower.includes(integration)) {
      tools.push(titleCase(integration));
    }
  });
  tools.push(...options.existingSystems.map(titleCase));
  return Array.from(new Set(tools));
}

function inferDuration(kind: WorkflowStep["kind"], complexity: WorkflowAgentOptions["complexity"]) {
  const base = complexity === "enterprise" ? 30 : complexity === "lean" ? 5 : 15;
  switch (kind) {
    case "trigger":
      return "Instant";
    case "decision":
      return `${base / 3} min`;
    case "analysis":
      return `${base} min`;
    case "measurement":
      return `${base / 2} min`;
    default:
      return `${base / 1.5} min`;
  }
}

function buildSuccessCriteria(sentence: string, kind: WorkflowStep["kind"]) {
  if (kind === "trigger") {
    return "Signal captured with required metadata before downstream steps begin.";
  }
  if (kind === "decision") {
    return "Routing decision logged with justification and path metadata.";
  }
  if (kind === "measurement") {
    return "Key metrics updated and alerts resolved or escalated.";
  }
  if (/\b(sync|update|write)\b/i.test(sentence)) {
    return "Target system reflects new state within agreed SLA.";
  }
  if (/\bnotify|alert|email\b/i.test(sentence)) {
    return "Audience receives contextual notification with actionable summary.";
  }
  return "Step completes without errors and produces expected artifact.";
}

function buildAutomationHint(kind: WorkflowStep["kind"], tools: string[]) {
  if (kind === "trigger") {
    return "Use event subscriptions or polling adapters to capture the initiating signal.";
  }
  if (kind === "analysis") {
    return "Combine heuristic scoring with LLM classification for resilient triage.";
  }
  if (kind === "decision") {
    return "Model routing logic as declarative rules to test and evolve safely.";
  }
  if (tools.length > 0) {
    return `Leverage native APIs for ${tools.join(", ")} to keep the flow scriptless.`;
  }
  return undefined;
}

function ensureDependencies(steps: WorkflowStep[]) {
  for (let index = 1; index < steps.length; index += 1) {
    const previousId = steps[index - 1].id;
    const current = steps[index];
    if (!current.dependsOn.includes(previousId)) {
      current.dependsOn.push(previousId);
    }
    if (current.inputs.length === 0) {
      current.inputs.push(`Output from ${previousId}`);
    }
  }
}

function extractIntegrations(brief: string) {
  const integrations = new Set<string>();
  const lower = brief.toLowerCase();
  integrationKeywords.forEach((integration) => {
    if (lower.includes(integration)) {
      integrations.add(titleCase(integration));
    }
  });
  return Array.from(integrations);
}

function seedDefaultSteps(options: WorkflowAgentOptions): WorkflowStep[] {
  return [
    createStep({
      sentence: "Capture trigger signal and structured payload.",
      index: 0,
      options,
    }),
    createStep({
      sentence: "Classify request, enrich context, and check guardrails.",
      index: 1,
      options,
    }),
    createStep({
      sentence: "Execute primary automation, update systems, notify owners.",
      index: 2,
      options,
    }),
    createStep({
      sentence: "Validate outputs, collect metrics, close the loop.",
      index: 3,
      options,
    }),
  ];
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function sentenceCase(value: string) {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return "";
  }
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}
