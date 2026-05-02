"use client";

import {
  Activity,
  BookOpen,
  Bot,
  CheckCircle2,
  CircleDot,
  Command,
  GitBranch,
  GraduationCap,
  MessageSquare,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type AgentName =
  | "Felix"
  | "Builder"
  | "Curriculum"
  | "Research"
  | "Critic"
  | "Narrator";

type DemoEvent = {
  id: string;
  at: string;
  agent: AgentName;
  title: string;
  detail: string;
  source: string;
};

type DemoState = {
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

const agents: Array<{
  name: AgentName;
  role: string;
  metric: string;
  icon: typeof Bot;
}> = [
  {
    name: "Felix",
    role: "CEO-mode orchestrator. Turns loose direction into a bounded mission.",
    metric: "routes intent",
    icon: Sparkles
  },
  {
    name: "Builder",
    role: "Ships UI, API routes, env wiring, and Vercel deployments.",
    metric: "makes artifacts",
    icon: Rocket
  },
  {
    name: "Curriculum",
    role: "Explains the system while it runs so the demo teaches, not just dazzles.",
    metric: "teaches patterns",
    icon: GraduationCap
  },
  {
    name: "Research",
    role: "Pulls outside context, examples, and claims into the build process.",
    metric: "grounds claims",
    icon: BookOpen
  },
  {
    name: "Critic",
    role: "Names brittle parts before the audience does.",
    metric: "catches risk",
    icon: ShieldCheck
  },
  {
    name: "Narrator",
    role: "Turns agent work into a stage-ready story with receipts.",
    metric: "frames the arc",
    icon: MessageSquare
  }
];

const demoCommands = [
  "/brief",
  "/mission make this educational",
  "/agent critic what can break?",
  "/agent curriculum explain orchestration",
  "/ship show the artifact path",
  "/story tighten the demo arc"
];

const lessons = [
  {
    title: "1. Intent",
    text: "A human gives direction in natural language from the surface they already use."
  },
  {
    title: "2. Routing",
    text: "Felix chooses the right specialist instead of making one generic agent pretend to be everything."
  },
  {
    title: "3. Artifact",
    text: "The system produces visible state: tasks, explanations, code, deployment, or a decision."
  },
  {
    title: "4. Verification",
    text: "The loop closes with evidence: logs, screenshots, tests, URLs, or a clear next command."
  }
];

const initialState: DemoState = {
  mission:
    "Build botlou in public as an agent team that can explain itself while it works.",
  mode: "briefing",
  updatedAt: new Date().toISOString(),
  activeAgent: "Felix",
  events: [],
  counters: {
    commands: 0,
    lessons: 3,
    shipped: 1
  }
};

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date(value));
}

export function MissionControl() {
  const [state, setState] = useState<DemoState>(initialState);
  const [command, setCommand] = useState("/mission make this more educational");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const res = await fetch("/api/state", { cache: "no-store" });
    const data = (await res.json()) as DemoState;
    setState(data);
  }

  async function sendCommand(nextCommand = command) {
    if (!nextCommand.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/command", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ command: nextCommand, source: "demo-console" })
      });
      const data = (await res.json()) as { state: DemoState };
      setState(data.state);
      setCommand(nextCommand);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    refresh();
    const id = window.setInterval(refresh, 2500);
    return () => window.clearInterval(id);
  }, []);

  const active = useMemo(
    () => agents.find((agent) => agent.name === state.activeAgent) ?? agents[0],
    [state.activeAgent]
  );

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="kicker">
            <CircleDot size={14} />
            botlou / build in public / live demo
          </div>
          <h1>Telegram-directed agent team, explained while it works.</h1>
          <p>
            This is the demo surface for Felix turning a build-in-public site into
            an interactive classroom: one command comes in, specialist agents
            route the work, and the page shows the receipts.
          </p>
          <div className="hero-actions">
            <a href="#control-room" className="button primary">
              <Command size={18} />
              Run demo command
            </a>
            <a href="/api/telegram" className="button">
              <Terminal size={18} />
              Inspect webhook
            </a>
          </div>
        </div>
        <div className="signal-panel">
          <div className="signal-header">
            <span>Current Mission</span>
            <Activity size={18} />
          </div>
          <p>{state.mission}</p>
          <div className="mode-row">
            <span>{state.mode}</span>
            <span>{formatTime(state.updatedAt)}</span>
          </div>
        </div>
      </section>

      <section className="metrics" aria-label="Demo metrics">
        <div>
          <span>{state.counters.commands}</span>
          commands received
        </div>
        <div>
          <span>{state.counters.lessons}</span>
          teaching moments
        </div>
        <div>
          <span>{state.counters.shipped}</span>
          shipped artifacts
        </div>
      </section>

      <section id="control-room" className="control-room">
        <div className="console">
          <div className="section-heading">
            <h2>Live Command Console</h2>
            <p>Use this now, then wire Telegram to the same endpoint.</p>
          </div>
          <div className="command-bar">
            <input
              aria-label="Command"
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void sendCommand();
              }}
            />
            <button onClick={() => void sendCommand()} disabled={busy}>
              <Zap size={18} />
              {busy ? "Routing" : "Send"}
            </button>
          </div>
          <div className="quick-commands">
            {demoCommands.map((item) => (
              <button key={item} onClick={() => void sendCommand(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="active-agent">
          <div className="agent-avatar">
            <active.icon size={30} />
          </div>
          <span>Active Agent</span>
          <h2>{active.name}</h2>
          <p>{active.role}</p>
          <small>{active.metric}</small>
        </div>
      </section>

      <section className="agent-grid">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isActive = agent.name === state.activeAgent;
          return (
            <article className={isActive ? "agent active" : "agent"} key={agent.name}>
              <div>
                <Icon size={22} />
                <span>{agent.metric}</span>
              </div>
              <h3>{agent.name}</h3>
              <p>{agent.role}</p>
            </article>
          );
        })}
      </section>

      <section className="split">
        <div>
          <div className="section-heading">
            <h2>Agent Event Stream</h2>
            <p>Readable receipts instead of hidden automation.</p>
          </div>
          <div className="event-list">
            {state.events.map((event) => (
              <article className="event" key={event.id}>
                <div className="event-top">
                  <strong>{event.agent}</strong>
                  <span>{formatTime(event.at)} · {event.source}</span>
                </div>
                <h3>{event.title}</h3>
                <p>{event.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="lesson-panel">
          <div className="section-heading">
            <h2>What The Audience Learns</h2>
            <p>The demo is a mental model, not just a product tour.</p>
          </div>
          {lessons.map((lesson) => (
            <div className="lesson" key={lesson.title}>
              <CheckCircle2 size={20} />
              <div>
                <h3>{lesson.title}</h3>
                <p>{lesson.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="integration">
        <div>
          <GitBranch size={24} />
          <h2>Telegram Bridge</h2>
          <p>
            Telegram or OpenClaw can POST updates to <code>/api/telegram</code>.
            With <code>TELEGRAM_BOT_TOKEN</code>, <code>TELEGRAM_ALLOWED_CHAT_ID</code>,
            and <code>DEMO_WEBHOOK_SECRET</code> set in Vercel, the same commands
            that run here can run from the Felix bot during the demo.
          </p>
        </div>
        <pre>{`POST /api/telegram?secret=...
{
  "message": {
    "chat": { "id": "YOUR_CHAT_ID" },
    "from": { "username": "hotlou" },
    "text": "/agent curriculum explain orchestration"
  }
}`}</pre>
      </section>
    </main>
  );
}
