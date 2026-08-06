import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import {
  Sun,
  CheckSquare,
  Target,
  CalendarDays,
  NotebookPen,
  Smile,
  PlaneTakeoff,
  FileText,
  Sparkles,
  Bell,
  Brain,
  Wand2,
  Compass,
  Users,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Repeat,
  Check,
  Moon,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/*  bg #05070B · raised #0B0F17 · line rgba(255,255,255,.08)           */
/*  ink #EEF0F6 · ink-dim #8A90A6                                      */
/*  signal #7C8CFF → #B98CFF (AI) · thread #34E0C4 (context)           */
/*  display Space Grotesk · body Inter · system JetBrains Mono         */
/* ------------------------------------------------------------------ */

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');";

const display = { fontFamily: "'Space Grotesk', sans-serif" };
const mono = { fontFamily: "'JetBrains Mono', monospace" };

const NOISE_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const STEP_DURATION = 5200; // ms per step while autoplaying

/* ------------------------------------------------------------------ */
/*  Gradient-bordered glass panel — the base surface for every card    */
/* ------------------------------------------------------------------ */

function Panel({
  children,
  className = "",
  innerClassName = "",
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={`relative rounded-[22px] bg-gradient-to-br from-white/[0.16] via-white/[0.04] to-white/[0.12] p-px ${
        glow ? "shadow-[0_0_70px_-24px_rgba(124,140,255,0.45)]" : "shadow-[0_20px_60px_-32px_rgba(0,0,0,0.7)]"
      } ${className}`}
    >
      <div className={`relative overflow-hidden rounded-[21px] bg-[#0B0F17]/95 backdrop-blur-2xl ${innerClassName}`}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Orbit modules (the AI engine's context sources)                    */
/* ------------------------------------------------------------------ */

type OrbitKey = "tasks" | "goals" | "calendar" | "journal" | "mood" | "travel" | "documents" | "notifications" | "memories";

const orbitModules: { key: OrbitKey; name: string; icon: LucideIcon }[] = [
  { key: "tasks", name: "Tasks", icon: CheckSquare },
  { key: "goals", name: "Goals", icon: Target },
  { key: "calendar", name: "Calendar", icon: CalendarDays },
  { key: "journal", name: "Journal", icon: NotebookPen },
  { key: "mood", name: "Mood", icon: Smile },
  { key: "travel", name: "Travel", icon: PlaneTakeoff },
  { key: "documents", name: "Documents", icon: FileText },
  { key: "notifications", name: "Notifications", icon: Bell },
  { key: "memories", name: "Memories", icon: Sparkles },
];

/* ------------------------------------------------------------------ */
/*  The ten stages of Nova's daily loop                                */
/* ------------------------------------------------------------------ */

interface Stage {
  id: string;
  time: string;
  title: string;
  note: string;
  icon: LucideIcon;
  orbit: OrbitKey | "core";
}

const stages: Stage[] = [
  { id: "brief", time: "7:00 AM", title: "Morning Brief", note: "The day opens with a two-minute summary, not an empty inbox.", icon: Sun, orbit: "core" },
  { id: "priorities", time: "8:30 AM", title: "AI Priorities", note: "Every open task and goal gets weighed together and ranked.", icon: Wand2, orbit: "core" },
  { id: "tasks", time: "10:00 AM", title: "Tasks", note: "You work the list. Every completion updates the rest of Nova instantly.", icon: CheckSquare, orbit: "tasks" },
  { id: "goals", time: "10:45 AM", title: "Goals", note: "Finished tasks roll straight into progress — nothing re-entered by hand.", icon: Target, orbit: "goals" },
  { id: "calendar", time: "12:00 PM", title: "Calendar", note: "The week reshapes itself to protect what your goals still need.", icon: CalendarDays, orbit: "calendar" },
  { id: "meetings", time: "1:00 PM", title: "Meetings", note: "A short context card arrives before you'd have to ask for one.", icon: Users, orbit: "notifications" },
  { id: "travel", time: "4:15 PM", title: "Travel", note: "A flight change moves every meeting built around it, automatically.", icon: PlaneTakeoff, orbit: "travel" },
  { id: "journal", time: "9:00 PM", title: "Journal", note: "You write two lines. Nova reads tone, not just text.", icon: NotebookPen, orbit: "journal" },
  { id: "reflection", time: "9:20 PM", title: "Reflection", note: "A quiet pattern surfaces — this is where mood enters the system.", icon: Compass, orbit: "mood" },
  { id: "tomorrow", time: "10:00 PM", title: "Tomorrow Planning", note: "Tomorrow's brief is already written before tonight ends.", icon: Moon, orbit: "core" },
];

/* ------------------------------------------------------------------ */
/*  Small shared bits                                                  */
/* ------------------------------------------------------------------ */

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.05] px-3 py-1.5 text-[11px] text-[#B7BCCF]"
      style={mono}
    >
      {children}
    </span>
  );
}

function Bar({ pct, tone = "signal" }: { pct: number; tone?: "signal" | "thread" }) {
  const bg =
    tone === "signal"
      ? "linear-gradient(90deg,#7C8CFF,#B98CFF)"
      : "linear-gradient(90deg,#34E0C4,#7C8CFF)";
  const glowColor = tone === "signal" ? "rgba(124,140,255,0.55)" : "rgba(52,224,196,0.5)";
  return (
    <div className="h-[7px] w-full overflow-hidden rounded-full bg-white/[0.06]">
      <motion.div
        className="h-full rounded-full"
        style={{ background: bg, boxShadow: `0 0 12px 0 ${glowColor}` }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

const screenVariants: Variants = {
  enter: { opacity: 0, y: 16, filter: "blur(4px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -12, filter: "blur(4px)", transition: { duration: 0.3 } },
};

/* ------------------------------------------------------------------ */
/*  Per-stage simulated screens                                        */
/* ------------------------------------------------------------------ */

function BriefScreen({ tomorrow = false }: { tomorrow?: boolean }) {
  const words = tomorrow
    ? "Tomorrow opens light: one review, no travel, and a full morning free for the Deep Work goal you protected today."
    : "Good morning. Three things matter today: finish the redesign review, hold the 1:00 sync, and protect an hour for Deep Work before your flight.";
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#6B7086]" style={mono}>
        {tomorrow ? "Generated at 10:00 PM" : "Generated at 7:00 AM"}
      </p>
      <p className="mt-5 text-xl leading-relaxed tracking-tight text-[#F3F4FA] sm:text-[22px]" style={display}>
        {words.split(" ").map((w, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.3, delay: i * 0.028 }}
            className="mr-[0.3em] inline-block"
          >
            {w}
          </motion.span>
        ))}
      </p>
      <div className="mt-7 flex flex-wrap gap-2">
        <Chip>Slept 7h 20m</Chip>
        <Chip>Calendar 82% free before noon</Chip>
        <Chip>1 flight today</Chip>
      </div>
    </div>
  );
}

function PrioritiesScreen() {
  const items = [
    { label: "Finish redesign review", score: 92, selected: true },
    { label: "Protect Deep Work block", score: 87, selected: true },
    { label: "Prep 1:00 sync notes", score: 74, selected: true },
    { label: "Clear inbox backlog", score: 41, selected: false },
    { label: "Reorganize documents", score: 22, selected: false },
  ];
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#6B7086]" style={mono}>
        Ranked from 14 open tasks and 3 active goals
      </p>
      <div className="mt-6 space-y-3">
        {items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className={`rounded-xl border p-3.5 transition-colors ${
              it.selected ? "border-[#7C8CFF]/35 bg-[#7C8CFF]/[0.07]" : "border-white/[0.06] bg-white/[0.015]"
            }`}
          >
            <div className="flex items-center justify-between text-[13px]">
              <span className={it.selected ? "font-medium text-[#EEF0F6]" : "text-[#6E7488]"}>{it.label}</span>
              {it.selected && (
                <span className="rounded-full bg-[#7C8CFF]/20 px-2 py-0.5 text-[10px] tracking-wide text-[#C4CAFF]" style={mono}>
                  selected
                </span>
              )}
            </div>
            <div className="mt-2.5">
              <Bar pct={it.score} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TasksScreen({ checked, onToggle }: { checked: boolean[]; onToggle: (i: number) => void }) {
  const labels = ["Ship redesign PR", "Reply to Acme thread", "Review Q3 metrics doc", "Prep 1:1 notes"];
  const doneCount = checked.filter(Boolean).length;
  const goalPct = Math.min(100, 40 + doneCount * 15);
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#6B7086]" style={mono}>
        Try it — check a task
      </p>
      <div className="mt-5 space-y-2.5">
        {labels.map((label, i) => (
          <button
            key={label}
            onClick={() => onToggle(i)}
            className={`group flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 ${
              checked[i]
                ? "border-[#7C8CFF]/25 bg-[#7C8CFF]/[0.05]"
                : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.18] hover:bg-white/[0.04]"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
                checked[i]
                  ? "border-transparent bg-gradient-to-br from-[#7C8CFF] to-[#B98CFF] shadow-[0_0_10px_rgba(124,140,255,0.6)]"
                  : "border-white/25 group-hover:border-white/45"
              }`}
            >
              {checked[i] && <Check className="h-3.5 w-3.5 text-[#05070B]" strokeWidth={3} />}
            </span>
            <span className={`text-[13px] transition-colors ${checked[i] ? "text-[#797F94] line-through" : "text-[#EEF0F6]"}`}>
              {label}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-6 rounded-xl border border-white/[0.07] bg-gradient-to-r from-white/[0.03] to-transparent p-4">
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-[#8A90A6]">→ Deep Work goal</span>
          <span className="text-[#B9BFFF]" style={mono}>{goalPct}%</span>
        </div>
        <div className="mt-2.5">
          <Bar pct={goalPct} tone="thread" />
        </div>
      </div>
    </div>
  );
}

function GoalsScreen({ tasksDone }: { tasksDone: number }) {
  const goals = [
    { name: "Deep Work", pct: Math.min(100, 40 + tasksDone * 15), linked: true },
    { name: "Learn Spanish", pct: 28, linked: false },
    { name: "Save $5,000", pct: 61, linked: false },
  ];
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#6B7086]" style={mono}>
        Updated automatically — no check-in required
      </p>
      <div className="mt-6 space-y-4">
        {goals.map((g) => (
          <div key={g.name} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#EEF0F6]">{g.name}</span>
              <span className="text-[12px] text-[#8A90A6]" style={mono}>{g.pct}%</span>
            </div>
            <div className="mt-3">
              <Bar pct={g.pct} />
            </div>
            {g.linked && <p className="mt-2.5 text-[11px] text-[#7C8CFF]">↳ moved by today's finished tasks</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarScreen() {
  const hours = ["9a", "10a", "11a", "12p", "1p", "2p", "3p"];
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#6B7086]" style={mono}>
        Reshaped because Deep Work is behind pace
      </p>
      <div className="mt-6 grid grid-cols-7 gap-2">
        {hours.map((h, i) => (
          <div key={h} className="flex flex-col items-center gap-2">
            <span className="text-[10px] text-[#5A5F73]" style={mono}>{h}</span>
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "bottom" }}
              className={`h-24 w-full rounded-lg ${
                i === 1
                  ? "border border-[#7C8CFF]/50 bg-gradient-to-b from-[#7C8CFF]/30 to-transparent shadow-[0_0_20px_-4px_rgba(124,140,255,0.5)]"
                  : i === 4
                  ? "bg-white/[0.09]"
                  : "bg-white/[0.03]"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-2 text-[12px] text-[#B9BFFF]">
        <span className="h-2 w-2 rounded-full bg-[#7C8CFF] shadow-[0_0_8px_rgba(124,140,255,0.8)]" />
        Focus block protected 10–11a
      </div>
    </div>
  );
}

function MeetingsScreen() {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#6B7086]" style={mono}>
        Arrives 5 minutes early, unprompted
      </p>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mt-6 rounded-xl border border-white/[0.09] bg-gradient-to-br from-white/[0.04] to-transparent p-[18px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#EEF0F6]">Roadmap sync</span>
          <span className="rounded-full bg-white/[0.07] px-2.5 py-1 text-[10px] text-[#A6ABC0]" style={mono}>
            starts in 5 min
          </span>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-[#8A90A6]">
          Context: last touched task "Ship redesign PR" · related doc "Q3 roadmap" ·
          two open comments from Priya.
        </p>
      </motion.div>
    </div>
  );
}

function TravelScreen() {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#6B7086]" style={mono}>
        Flight DL482 · gate change detected
      </p>
      <div className="mt-6 flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-[18px]">
        <div className="flex-1">
          <p className="text-[11px] text-[#5A5F73]">Was</p>
          <p className="mt-1.5 text-[13px] text-[#6E7488] line-through">Gate B12 · 6:40 PM</p>
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.05]">
          <ChevronRight className="h-3.5 w-3.5 text-[#B9BFFF]" />
        </div>
        <div className="flex-1">
          <p className="text-[11px] text-[#5A5F73]">Now</p>
          <p className="mt-1.5 text-[13px] font-medium text-[#EEF0F6]">Gate C7 · 7:00 PM</p>
        </div>
      </div>
      <p className="mt-4 text-[12px] text-[#7C8CFF]">↳ tonight's calendar events shifted +20 min automatically</p>
    </div>
  );
}

function JournalScreen() {
  const text = "Good day overall. Shipped the redesign, felt a little behind on emails by the evening.";
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#6B7086]" style={mono}>
        Two lines, written in your own words
      </p>
      <p className="mt-5 text-[16px] italic leading-relaxed text-[#C4C8D8]">
        {text.split(" ").map((w, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: i * 0.045 }}
            className="mr-[0.28em] inline-block"
          >
            {w}
          </motion.span>
        ))}
      </p>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.4 }}
        className="mt-6"
      >
        <Chip>Mood read: focused, slightly tired</Chip>
      </motion.div>
    </div>
  );
}

function ReflectionScreen() {
  const bars = [40, 55, 70, 90, 65, 45, 30];
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#6B7086]" style={mono}>
        Noticed across the last 7 days
      </p>
      <p className="mt-5 text-lg leading-relaxed tracking-tight text-[#F3F4FA]" style={display}>
        You're most focused before 11 AM this week.
      </p>
      <div className="mt-6 flex items-end gap-2.5">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}px` }}
            transition={{ delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={`w-6 rounded-t-md ${
              i === 3
                ? "bg-gradient-to-t from-[#7C8CFF] to-[#B98CFF] shadow-[0_0_16px_-2px_rgba(124,140,255,0.6)]"
                : "bg-white/[0.09]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mini AI orbit — shows which module is currently active             */
/* ------------------------------------------------------------------ */

function OrbitMini({ active }: { active: OrbitKey | "core" }) {
  const reduce = useReducedMotion();
  const radius = 40;
  const positions = useMemo(
    () =>
      orbitModules.map((_, i) => {
        const angle = (i / orbitModules.length) * Math.PI * 2 - Math.PI / 2;
        return { x: 50 + radius * Math.cos(angle), y: 50 + radius * Math.sin(angle) };
      }),
    []
  );
  const activeLabel = active === "core" ? "Nova's reasoning core" : orbitModules.find((m) => m.key === active)?.name ?? "";

  return (
    <Panel innerClassName="p-6">
      <p className="mb-5 text-[11px] uppercase tracking-[0.22em] text-[#6B7086]" style={mono}>
        Context flow
      </p>
      <div className="relative mx-auto aspect-square w-full max-w-[230px]">
        <motion.div
          aria-hidden
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute inset-3 rounded-full border border-dashed border-white/[0.08]"
        />
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id="miniThread" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7C8CFF" />
              <stop offset="100%" stopColor="#34E0C4" />
            </linearGradient>
          </defs>
          {positions.map((p, i) => {
            const isActive = orbitModules[i].key === active;
            return (
              <line
                key={i}
                x1={50}
                y1={50}
                x2={p.x}
                y2={p.y}
                stroke="url(#miniThread)"
                strokeWidth={isActive ? 1 : 0.25}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                opacity={isActive ? 1 : 0.12}
              />
            );
          })}
        </svg>
        <div
          className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.16]"
          style={{ background: "radial-gradient(circle, rgba(124,140,255,0.3), rgba(11,15,23,0.92))" }}
        >
          <motion.div
            animate={reduce ? undefined : { scale: active === "core" ? [1, 1.16, 1] : 1 }}
            transition={{ duration: 1.6, repeat: active === "core" ? Infinity : 0, ease: "easeInOut" }}
          >
            <Brain className="h-5 w-5 text-[#C4CAFF]" strokeWidth={1.6} />
          </motion.div>
        </div>
        {orbitModules.map((m, i) => {
          const isActive = m.key === active;
          return (
            <div
              key={m.key}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: `${positions[i].x}%`, top: `${positions[i].y}%` }}
            >
              <motion.div
                animate={isActive && !reduce ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 1.1, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
                className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300 ${
                  isActive
                    ? "border-[#7C8CFF]/70 bg-white/[0.1] shadow-[0_0_16px_-2px_rgba(124,140,255,0.7)]"
                    : "border-white/[0.08] bg-[#0B0F17]"
                }`}
              >
                <m.icon className={`h-3.5 w-3.5 ${isActive ? "text-[#C4CAFF]" : "text-[#5A5F73]"}`} strokeWidth={1.8} />
              </motion.div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex items-center justify-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] py-2 text-[12px] text-[#A6ABC0]">
        Feeding <span className="font-medium text-[#B9BFFF]">{activeLabel}</span>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  The walkthrough console                                            */
/* ------------------------------------------------------------------ */

export default function RequestDemoPage() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [tasksChecked, setTasksChecked] = useState<boolean[]>([false, false, false, false]);
  const lastTick = useRef<number | null>(null);

  const stage = stages[index];
  const isLast = index === stages.length - 1;

  useEffect(() => {
    if (!playing || reduce) return;
    let raf: number;
    const tick = (t: number) => {
      if (lastTick.current === null) lastTick.current = t;
      const dt = t - lastTick.current;
      lastTick.current = t;
      setProgress((p) => {
        const next = p + (dt / STEP_DURATION) * 100;
        if (next >= 100) {
          setIndex((i) => (i + 1) % stages.length);
          return 0;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lastTick.current = null;
    };
  }, [playing, reduce]);

  function goTo(i: number) {
    setIndex(i);
    setProgress(0);
    setPlaying(false);
  }
  function step(delta: number) {
    setIndex((i) => (i + delta + stages.length) % stages.length);
    setProgress(0);
    setPlaying(false);
  }
  function toggleTask(i: number) {
    setTasksChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }

  const tasksDone = tasksChecked.filter(Boolean).length;

  const screens: Record<string, React.ReactNode> = {
    brief: <BriefScreen />,
    priorities: <PrioritiesScreen />,
    tasks: <TasksScreen checked={tasksChecked} onToggle={toggleTask} />,
    goals: <GoalsScreen tasksDone={tasksDone} />,
    calendar: <CalendarScreen />,
    meetings: <MeetingsScreen />,
    travel: <TravelScreen />,
    journal: <JournalScreen />,
    reflection: <ReflectionScreen />,
    tomorrow: <BriefScreen tomorrow />,
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070B] text-[#EEF0F6] antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        ${FONT_IMPORT}
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ambient background layers */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: `url("${NOISE_URL}")` }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 20%, black, transparent)",
          }}
        />
        <div
          className="absolute left-1/2 top-[-260px] h-[600px] w-[980px] -translate-x-1/2 rounded-full opacity-40 blur-[130px]"
          style={{ background: "radial-gradient(circle, rgba(124,140,255,0.4), transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-200px] right-[-120px] h-[460px] w-[600px] rounded-full opacity-25 blur-[130px]"
          style={{ background: "radial-gradient(circle, rgba(52,224,196,0.35), transparent 70%)" }}
        />
      </div>

      {/* Minimal header — no CTAs */}
       <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
      <div
        className={`flex items-center rounded-2xl  px-4 py-2 backdrop-blur-xl`}
      >
        <img
          src={'/nova_login.png'}
          alt="Nova"
          draggable={false}
          className="h-30 w-auto object-contain select-none transition-transform duration-500 hover:scale-105"
        />
      </div>
    </header>

      {/* Intro line */}
      <div className="relative z-10 px-6 pb-12 pt-14 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[#8A90A6]" style={mono}>
            <Sparkles className="h-3 w-3 text-[#B9BFFF]" />
            Nova · AI Daily Operating System
          </div>
          <h1 className="text-[clamp(1.9rem,4.4vw,2.75rem)] font-semibold leading-[1.1] tracking-tight" style={display}>
            This is Nova's actual daily loop,{" "}
            <span className="bg-gradient-to-r from-[#9BA6FF] via-[#B98CFF] to-[#7C8CFF] bg-clip-text text-transparent">
              playing live.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#8A90A6]">
            Ten stages, one continuous context. Watch it run on its own, or step through
            it yourself — nothing here is a recording.
          </p>
        </div>
      </div>

      {/* Console */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-14 sm:px-10 lg:px-16">
        {/* mobile step chips */}
        <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {stages.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] transition-colors duration-200 ${
                i === index
                  ? "border-transparent bg-gradient-to-r from-[#7C8CFF] to-[#B98CFF] text-[#05070B] font-medium"
                  : "border-white/[0.1] text-[#A6ABC0]"
              }`}
            >
              <s.icon className="h-3.5 w-3.5" strokeWidth={1.9} />
              {s.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[270px_1fr_260px]">
          {/* Step list — desktop only */}
          <Panel className="order-2 hidden lg:order-1 lg:block" innerClassName="p-3">
            <div className="flex flex-col gap-1">
              {stages.map((s, i) => {
                const isActive = i === index;
                return (
                  <button
                    key={s.id}
                    onClick={() => goTo(i)}
                    className={`group relative overflow-hidden rounded-xl px-3.5 py-3 text-left transition-colors duration-300 ${
                      isActive ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-[60%] w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-[#7C8CFF] to-[#B98CFF]" />
                    )}
                    <div className="flex items-center gap-3 pl-1.5">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-br from-[#7C8CFF]/30 to-[#B98CFF]/30 shadow-[0_0_14px_-3px_rgba(124,140,255,0.6)]"
                            : "bg-white/[0.04] group-hover:bg-white/[0.07]"
                        }`}
                      >
                        <s.icon className={`h-3.5 w-3.5 ${isActive ? "text-[#C4CAFF]" : "text-[#6B7086]"}`} strokeWidth={1.8} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`truncate text-[13px] font-medium ${isActive ? "text-[#EEF0F6]" : "text-[#8B90A3]"}`}>
                            {s.title}
                          </span>
                          <span className="shrink-0 text-[10px] text-[#525871]" style={mono}>
                            {s.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[#7C8CFF] to-[#B98CFF]"
                          style={{ width: `${playing ? progress : 0}%`, boxShadow: "0 0 8px rgba(124,140,255,0.6)" }}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Panel>

          {/* Screen */}
          <div className="order-1 flex flex-col lg:order-2">
            <Panel glow innerClassName="flex-1">
              <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.015] px-5 py-3.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B6B]/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#F2B84B]/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#34E0C4]/70" />
                </div>
                <span className="text-[11px] text-[#6B7086]" style={mono}>
                  nova.app › today › {stage.title.toLowerCase()}
                </span>
                <span className="text-[11px] text-[#B9BFFF]" style={mono}>
                  {stage.time}
                </span>
              </div>
              <div className="min-h-[340px] p-6 sm:p-9">
                <AnimatePresence mode="wait">
                  <motion.div key={stage.id} variants={screenVariants} initial="enter" animate="center" exit="exit">
                    {screens[stage.id]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </Panel>

            {/* controls */}
            <Panel className="mt-4" innerClassName="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[12px] leading-relaxed text-[#8A90A6]">{stage.note}</p>
              <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => step(-1)}
                  aria-label="Previous stage"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.1] text-[#A6ABC0] transition-colors duration-200 hover:border-white/25 hover:text-[#EEF0F6]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? "Pause" : "Play"}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#7C8CFF] to-[#B98CFF] text-[#05070B] shadow-[0_0_20px_-4px_rgba(124,140,255,0.8)] transition-transform duration-200 hover:scale-105"
                >
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => (isLast ? goTo(0) : step(1))}
                  aria-label={isLast ? "Restart" : "Next stage"}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.1] text-[#A6ABC0] transition-colors duration-200 hover:border-white/25 hover:text-[#EEF0F6]"
                >
                  {isLast ? <Repeat className="h-3.5 w-3.5" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              </div>
            </Panel>
          </div>

          {/* Orbit */}
          <div className="order-3">
            <OrbitMini active={stage.orbit} />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.02] px-4 py-2 text-[12px] text-[#6B7086]">
            <Repeat className="h-3 w-3 text-[#7C8CFF]" />
            Tomorrow Planning closes the loop — Morning Brief begins again on its own.
          </div>
        </div>
      </div>
    </div>
  );
}