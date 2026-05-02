export type AgentName =
  | "Felix"
  | "Builder"
  | "Curriculum"
  | "Research"
  | "Critic"
  | "Narrator";

export type DemoEvent = {
  id: string;
  at: string;
  agent: AgentName;
  title: string;
  detail: string;
  source: string;
};

export type DemoState = {
  mission: string;
  mode: "briefing" | "building" | "teaching" | "shipping";
  updatedAt: string;
  activeAgent: AgentName;
  events: DemoEvent[];
  counters: {
    commands: number;
    lessons: number;
    shipped: number;
  };
};

const seedEvents: DemoEvent[] = [
  {
    id: "seed-1",
    at: new Date().toISOString(),
    agent: "Felix",
    title: "Mission framed",
    detail:
      "Turn the public build log into a live classroom: show the work, explain the system, and let Telegram steer the room.",
    source: "bootstrap"
  },
  {
    id: "seed-2",
    at: new Date().toISOString(),
    agent: "Builder",
    title: "Control surface online",
    detail:
      "The demo now has a mission panel, agent roster, command stream, and webhook-shaped API for Telegram or OpenClaw.",
    source: "bootstrap"
  },
  {
    id: "seed-3",
    at: new Date().toISOString(),
    agent: "Curriculum",
    title: "Educational spine added",
    detail:
      "Every action maps to a lesson: orchestration, context, tools, verification, deployment, and human-in-the-loop control.",
    source: "bootstrap"
  }
];

const initialState: DemoState = {
  mission:
    "Build botlou in public as an agent team that can explain itself while it works.",
  mode: "briefing",
  updatedAt: new Date().toISOString(),
  activeAgent: "Felix",
  events: seedEvents,
  counters: {
    commands: 0,
    lessons: 3,
    shipped: 1
  }
};

const globalForDemo = globalThis as typeof globalThis & {
  __botlouDemoState?: DemoState;
};

function state() {
  if (!globalForDemo.__botlouDemoState) {
    globalForDemo.__botlouDemoState = initialState;
  }
  return globalForDemo.__botlouDemoState;
}

function eventFor(command: string, source: string): DemoEvent {
  const normalized = command.toLowerCase();

  if (normalized.includes("critic") || normalized.includes("risk")) {
    return {
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      agent: "Critic",
      title: "Risks surfaced",
      detail:
        "The brittle parts are persistence, credential handling, and demo timing. The fix is clear gates: safe commands first, deploy commands only with confirmation.",
      source
    };
  }

  if (
    normalized.includes("teach") ||
    normalized.includes("educat") ||
    normalized.includes("curriculum") ||
    normalized.includes("lesson")
  ) {
    return {
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      agent: "Curriculum",
      title: "Lesson mode expanded",
      detail:
        "The audience should see the pattern: one human intent becomes specialized agent work, visible state, and a verifiable artifact.",
      source
    };
  }

  if (normalized.includes("research") || normalized.includes("market")) {
    return {
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      agent: "Research",
      title: "Research lane queued",
      detail:
        "Research agent is responsible for outside context, examples, and claims. It keeps the demo grounded instead of turning into vibes with a dashboard.",
      source
    };
  }

  if (normalized.includes("ship") || normalized.includes("deploy")) {
    return {
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      agent: "Builder",
      title: "Shipping lane activated",
      detail:
        "Builder turns decisions into artifacts: UI changes, API routes, Vercel env checks, and a production URL the room can open.",
      source
    };
  }

  if (normalized.includes("story") || normalized.includes("narrat")) {
    return {
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      agent: "Narrator",
      title: "Demo story tightened",
      detail:
        "Narrator converts implementation into a clean stage arc: here is the goal, here is the command, here is what changed, here is why it matters.",
      source
    };
  }

  return {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    agent: "Felix",
    title: command.startsWith("/") ? "Command accepted" : "Direction accepted",
    detail:
      "Felix routes the intent, keeps the room oriented, and makes sure the system produces something visible instead of disappearing into agent fog.",
    source
  };
}

export function getDemoState() {
  return state();
}

export function applyCommand(command: string, source: string) {
  const current = state();
  const event = eventFor(command, source);
  const normalized = command.toLowerCase();

  current.events = [event, ...current.events].slice(0, 12);
  current.activeAgent = event.agent;
  current.updatedAt = event.at;
  current.counters.commands += 1;

  if (event.agent === "Curriculum") current.counters.lessons += 1;
  if (event.agent === "Builder") current.counters.shipped += 1;

  if (
    normalized.includes("teach") ||
    normalized.includes("educat") ||
    normalized.includes("curriculum") ||
    normalized.includes("lesson")
  ) {
    current.mode = "teaching";
    current.mission =
      "Teach the audience how agent teams turn human direction into visible, verifiable work.";
  } else if (normalized.includes("ship") || normalized.includes("deploy")) {
    current.mode = "shipping";
    current.mission =
      "Move from idea to artifact while keeping the deployment path legible.";
  } else if (normalized.includes("build") || normalized.includes("agent")) {
    current.mode = "building";
    current.mission =
      "Coordinate specialist agents around one public demo surface.";
  } else {
    current.mode = "briefing";
  }

  return current;
}
