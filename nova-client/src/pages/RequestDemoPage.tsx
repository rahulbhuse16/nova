import React, { useMemo, useState } from "react";
import {
  motion,
  useReducedMotion,
  AnimatePresence,
  type Variants,
} from "framer-motion";
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
  Bot,
  Bell,
  Brain,
  ArrowRight,
  ArrowDown,
  Play,
  Layers,
  Compass,
  Wand2,
  ListChecks,
  CalendarCheck,
  Gauge,
  Coffee,
  Moon,
  Users,
  MessageSquareText,
  ClipboardCheck,
  Rocket,
  LineChart,
  Focus,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/*  bg        #05070B   near-black, slight blue cast                   */
/*  bg-raised #0B0F17                                                  */
/*  line      rgba(255,255,255,.08)                                    */
/*  ink       #EEF0F6                                                  */
/*  ink-dim   #8A90A6                                                  */
/*  signal    #7C8CFF -> #B98CFF  (intelligence / AI gradient)         */
/*  thread    #34E0C4   (context / connection accent)                  */
/*  amber     #F2B84B   (attention / mood accent, used sparingly)      */
/*  display   Space Grotesk | body Inter | system JetBrains Mono       */
/* ------------------------------------------------------------------ */

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');";

const glass =
  "rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-xl";
const glassHover =
  "transition-all duration-500 hover:border-white/[0.16] hover:bg-white/[0.045]";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#8A90A6]"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      <span className="h-[5px] w-[5px] rounded-full bg-gradient-to-r from-[#7C8CFF] to-[#B98CFF]" />
      {children}
    </div>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Hero                                                      */
/* ------------------------------------------------------------------ */

const heroCards: { label: string; sub: string; icon: LucideIcon; x: string; y: string; delay: number }[] = [
  { label: "Morning Brief", sub: "3 priorities set", icon: Sun, x: "4%", y: "14%", delay: 0.1 },
  { label: "Goal Progress", sub: "Deep Work · 62%", icon: Target, x: "62%", y: "4%", delay: 0.25 },
  { label: "Calendar", sub: "2 focus blocks kept", icon: CalendarDays, x: "68%", y: "40%", delay: 0.4 },
  { label: "Journal", sub: "Reflection logged", icon: NotebookPen, x: "2%", y: "58%", delay: 0.55 },
  { label: "Travel", sub: "Flight moved to gate B12", icon: PlaneTakeoff, x: "44%", y: "70%", delay: 0.7 },
];

function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden px-6 pb-28 pt-40 sm:px-10 lg:px-16">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-220px] h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(124,140,255,0.35), rgba(185,140,255,0.12) 45%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <Eyebrow>Nova · AI Daily Operating System</Eyebrow>
          </Reveal>
          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-[clamp(2.5rem,5.4vw,4rem)] font-semibold leading-[1.04] tracking-tight text-[#EEF0F6]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Experience Nova
            <br />
            <span className="bg-gradient-to-r from-[#9BA6FF] via-[#B98CFF] to-[#7C8CFF] bg-clip-text text-transparent">
              in action.
            </span>
          </motion.h1>
          <Reveal delay={1} className="mt-6 max-w-md text-lg leading-relaxed text-[#A6ABC0]">
            Nova is the one operating system where tasks, goals, calendar, journal,
            mood and travel stay in sync — so a single day of context quietly
            improves every plan Nova makes after it.
          </Reveal>
          <Reveal delay={2} className="mt-10 flex flex-wrap items-center gap-4">
            <button className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium text-[#05070B] transition-transform duration-300 hover:scale-[1.02]">
              <span className="absolute inset-0 bg-gradient-to-r from-[#9BA6FF] to-[#B98CFF]" />
              <span className="relative">Request Demo</span>
              <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] px-7 py-3.5 text-sm font-medium text-[#EEF0F6] transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.04]">
              <Play className="h-3.5 w-3.5" />
              Watch Workflow
            </button>
          </Reveal>
        </div>

        {/* Animated dashboard illustration built from UI cards */}
        <div className="relative mx-auto h-[420px] w-full max-w-[520px] sm:h-[480px]">
          <div
            aria-hidden
            className="absolute inset-8 rounded-[28px] border border-white/[0.06]"
            style={{
              background:
                "linear-gradient(160deg, rgba(255,255,255,0.03), transparent 60%)",
            }}
          />
          {heroCards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 18, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: c.delay, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute w-[190px] ${glass} p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]`}
              style={{ left: c.x, top: c.y }}
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
                  <c.icon className="h-4 w-4 text-[#B9BFFF]" strokeWidth={1.75} />
                </div>
                <p className="text-[13px] font-medium text-[#EEF0F6]">{c.label}</p>
                <p className="mt-0.5 text-[11px] text-[#797F94]">{c.sub}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: What Makes Nova Different                                 */
/* ------------------------------------------------------------------ */

const differenceSteps = [
  {
    title: "Traditional Apps",
    body: "A calendar app, a to-do app, a journal app. Each one only knows what happens inside itself.",
    tone: "border-white/[0.08] text-[#8A90A6]",
  },
  {
    title: "Disconnected Productivity",
    body: "You carry the context between them by hand — re-typing the same plan into four different places.",
    tone: "border-white/[0.08] text-[#8A90A6]",
  },
  {
    title: "Nova AI Operating System",
    body: "One shared context layer. A finished task, a missed goal, a low mood — Nova reads all of it before it plans your next hour.",
    tone: "border-[#7C8CFF]/40 text-[#EEF0F6]",
  },
];

function WhatMakesDifferent() {
  return (
    <section className="px-6 py-28 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow>Why Nova exists</Eyebrow>
          <h2
            className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-[#EEF0F6] sm:text-4xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Software stopped being separate apps. It became one system.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {differenceSteps.map((s, i) => (
            <React.Fragment key={s.title}>
              <Reveal delay={i} className={`${glass} ${glassHover} border p-7 ${s.tone}`}>
                <span className="font-mono text-[11px] tracking-[0.2em] text-[#6B7086]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#8A90A6]">{s.body}</p>
                {i === 2 && (
                  <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7C8CFF]/15 to-[#B98CFF]/15 px-3 py-1 text-[11px] font-medium text-[#B9BFFF]">
                    <Sparkles className="h-3 w-3" /> Context-aware
                  </div>
                )}
              </Reveal>
              {i < 2 && (
                <div className="hidden items-center justify-center lg:flex">
                  <ArrowRight className="h-5 w-5 text-[#4A4F63]" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Interactive Workflow                                      */
/* ------------------------------------------------------------------ */

const workflowStages: { name: string; icon: LucideIcon; detail: string }[] = [
  { name: "Morning Brief", icon: Sun, detail: "Nova opens the day with a two-minute summary: what moved overnight, what's due, how you slept." },
  { name: "AI Priorities", icon: Wand2, detail: "Every open task and goal is weighed together and ranked into the three that matter most today." },
  { name: "Tasks", icon: CheckSquare, detail: "You work the list. Every completion is timestamped and immediately visible to the rest of Nova." },
  { name: "Goals", icon: Target, detail: "Finished tasks roll straight into goal progress — no separate check-in, no manual update." },
  { name: "Calendar", icon: CalendarDays, detail: "Goal progress reshapes the week ahead, protecting focus time where you're behind." },
  { name: "Meetings", icon: Users, detail: "Nova prepares a short context card before each meeting from recent tasks, docs and notes." },
  { name: "Travel", icon: PlaneTakeoff, detail: "Flight and hotel changes automatically move the calendar events and meetings around them." },
  { name: "Journal", icon: NotebookPen, detail: "A short evening entry captures how the day actually went, in your own words." },
  { name: "Reflection", icon: Compass, detail: "Nova reads the entry for tone and effort, not just text — this is where mood enters the system." },
  { name: "Tomorrow Planning", icon: CalendarCheck, detail: "Everything above becomes tomorrow's starting brief before you've opened the app again." },
];

function InteractiveWorkflow() {
  const [active, setActive] = useState(0);
  return (
    <section className="px-6 py-28 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow>The daily loop</Eyebrow>
          <h2
            className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-[#EEF0F6] sm:text-4xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            One continuous loop, not ten separate apps.
          </h2>
          <p className="mt-4 max-w-xl text-[#8A90A6]">Select any stage to see exactly what Nova does there.</p>
        </Reveal>

        <div className="mt-14 flex flex-wrap gap-x-1 gap-y-4">
          {workflowStages.map((s, i) => (
            <React.Fragment key={s.name}>
              <button
                onClick={() => setActive(i)}
                className={`group flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm transition-all duration-300 ${
                  active === i
                    ? "border-transparent bg-gradient-to-r from-[#7C8CFF] to-[#B98CFF] text-[#05070B] font-medium"
                    : "border-white/[0.1] text-[#A6ABC0] hover:border-white/25 hover:text-[#EEF0F6]"
                }`}
              >
                <s.icon className="h-3.5 w-3.5" strokeWidth={1.9} />
                {s.name}
              </button>
              {i < workflowStages.length - 1 && (
                <ArrowRight className="mx-0.5 hidden h-4 w-4 self-center text-[#3C4155] sm:block" />
              )}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`mt-8 ${glass} flex items-start gap-5 p-8`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C8CFF]/20 to-[#B98CFF]/20">
              {React.createElement(workflowStages[active].icon, {
                className: "h-5 w-5 text-[#B9BFFF]",
                strokeWidth: 1.8,
              })}
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#EEF0F6]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {workflowStages[active].name}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#A6ABC0]">
                {workflowStages[active].detail}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: AI Intelligence Engine  (signature element)                */
/* ------------------------------------------------------------------ */

const orbitModules: { name: string; icon: LucideIcon; feed: string }[] = [
  { name: "Tasks", icon: CheckSquare, feed: "What you finish tells Nova what actually matters to you." },
  { name: "Goals", icon: Target, feed: "Long-term intent Nova checks every recommendation against." },
  { name: "Calendar", icon: CalendarDays, feed: "Where your time already went, and where it's protected." },
  { name: "Journal", icon: NotebookPen, feed: "The words you use reveal energy, stress and momentum." },
  { name: "Mood", icon: Smile, feed: "A daily signal that softens or sharpens Nova's suggestions." },
  { name: "Travel", icon: PlaneTakeoff, feed: "Time zones and transit reshape everything else automatically." },
  { name: "Documents", icon: FileText, feed: "Files you're working from, so context isn't just conversation." },
  { name: "Notifications", icon: Bell, feed: "Only surfaced once other signals agree it's actually urgent." },
  { name: "Memories", icon: Sparkles, feed: "Patterns from every past day Nova keeps quietly in mind." },
];

function AIEngine() {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const radius = 39;

  const positions = useMemo(
    () =>
      orbitModules.map((_, i) => {
        const angle = (i / orbitModules.length) * Math.PI * 2 - Math.PI / 2;
        return {
          x: 50 + radius * Math.cos(angle),
          y: 50 + radius * Math.sin(angle),
        };
      }),
    []
  );

  const activeIdx = hovered;
  const caption =
    activeIdx === null
      ? "Hover a module to see what it teaches Nova."
      : orbitModules[activeIdx].feed;

  return (
    <section className="relative px-6 py-28 sm:px-10 lg:px-16">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[140px]"
        style={{ background: "radial-gradient(circle, rgba(124,140,255,0.3), transparent 65%)" }}
      />
      <div className="relative mx-auto max-w-6xl text-center">
        <Reveal className="mx-auto max-w-2xl">
          <Eyebrow>The AI Intelligence Engine</Eyebrow>
          <h2
            className="text-3xl font-semibold leading-tight tracking-tight text-[#EEF0F6] sm:text-4xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Nova doesn't wait for commands. It understands context.
          </h2>
          <p className="mt-4 text-[#8A90A6]">
            Every module constantly feeds a shared understanding at the center —
            so a single missed task can quietly reshape your calendar, your goals,
            and tonight's journal prompt.
          </p>
        </Reveal>

        <div className="relative mx-auto mt-16 aspect-square w-full max-w-[620px]">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <linearGradient id="threadGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7C8CFF" />
                <stop offset="100%" stopColor="#34E0C4" />
              </linearGradient>
            </defs>
            {positions.map((p, i) => (
              <motion.line
                key={i}
                x1={50}
                y1={50}
                x2={p.x}
                y2={p.y}
                stroke="url(#threadGrad)"
                strokeWidth={hovered === i ? 0.6 : 0.25}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: hovered === null ? 0.35 : hovered === i ? 0.9 : 0.15 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </svg>

          {/* center brain */}
          <div
            className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.14]"
            style={{ background: "radial-gradient(circle, rgba(124,140,255,0.22), rgba(11,15,23,0.9))" }}
          >
            <motion.div
              animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Brain className="h-9 w-9 text-[#C4CAFF]" strokeWidth={1.5} />
            </motion.div>
          </div>

          {orbitModules.map((m, i) => (
            <button
              key={m.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 focus:outline-none"
              style={{ left: `${positions[i].x}%`, top: `${positions[i].y}%` }}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 ${
                  hovered === i
                    ? "border-[#7C8CFF]/60 bg-white/[0.08] scale-110"
                    : "border-white/[0.1] bg-[#0B0F17]"
                }`}
              >
                <m.icon className="h-[18px] w-[18px] text-[#B9BFFF]" strokeWidth={1.75} />
              </div>
              <span className="text-[11px] font-medium text-[#A6ABC0]">{m.name}</span>
            </button>
          ))}
        </div>

        <div className={`mx-auto mt-10 max-w-md ${glass} px-6 py-4 text-sm text-[#C4C8D8] transition-all duration-300`}>
          {caption}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: A Day With Nova                                           */
/* ------------------------------------------------------------------ */

const dayTimeline: { time: string; title: string; body: string; icon: LucideIcon }[] = [
  { time: "7:00 AM", title: "Morning Brief", body: "A short summary of the day is ready before you check your phone.", icon: Sun },
  { time: "8:30 AM", title: "AI builds priorities", body: "Tasks and goals are weighed together into today's top three.", icon: Wand2 },
  { time: "10:00 AM", title: "Focus session", body: "Nova blocks the calendar and mutes non-urgent notifications.", icon: Focus },
  { time: "1:00 PM", title: "Meeting reminders", body: "A one-line context card arrives five minutes before each call.", icon: Users },
  { time: "3:00 PM", title: "Goal progress update", body: "The afternoon's finished tasks are reflected in your goals live.", icon: LineChart },
  { time: "6:00 PM", title: "Travel suggestions", body: "Tomorrow's commute or flight is checked against the weather and traffic.", icon: PlaneTakeoff },
  { time: "9:00 PM", title: "Journal reflection", body: "A two-line prompt, shaped by how the day actually went.", icon: NotebookPen },
  { time: "10:00 PM", title: "Tomorrow generated automatically", body: "A new brief is already waiting when 7:00 AM comes back around.", icon: Moon },
];

function DayTimeline() {
  return (
    <section className="px-6 py-28 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <Reveal className="text-center">
          <Eyebrow>A day with nova</Eyebrow>
          <h2
            className="text-3xl font-semibold tracking-tight text-[#EEF0F6] sm:text-4xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            One day. Eight quiet handoffs.
          </h2>
        </Reveal>

        <div className="relative mt-16">
          <div className="absolute left-[27px] top-0 h-full w-px bg-gradient-to-b from-[#7C8CFF]/50 via-white/10 to-transparent sm:left-1/2" />
          <div className="flex flex-col gap-10">
            {dayTimeline.map((step, i) => (
              <Reveal
                key={step.title}
                delay={i}
                className={`relative flex items-start gap-5 sm:w-1/2 ${
                  i % 2 === 0 ? "sm:self-start sm:pr-10" : "sm:self-end sm:flex-row-reverse sm:pl-10 sm:text-right"
                }`}
              >
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-[#0B0F17]">
                  <step.icon className="h-5 w-5 text-[#B9BFFF]" strokeWidth={1.75} />
                </div>
                <div className={`${glass} ${glassHover} flex-1 p-5`}>
                  <span
                    className="font-mono text-[11px] tracking-[0.15em] text-[#7C8CFF]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {step.time}
                  </span>
                  <h3 className="mt-1 text-[15px] font-semibold text-[#EEF0F6]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#8A90A6]">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Feature Ecosystem                                         */
/* ------------------------------------------------------------------ */

const modules: { name: string; desc: string; ai: string; icon: LucideIcon }[] = [
  { name: "Today", desc: "The single view of your day, assembled from everything else.", ai: "Rebuilds itself as new context arrives", icon: Sun },
  { name: "Tasks", desc: "Work that's ranked by what it actually affects.", ai: "Reorders priority as goals shift", icon: CheckSquare },
  { name: "Goals", desc: "Long-term intentions tracked without manual check-ins.", ai: "Updates from finished tasks automatically", icon: Target },
  { name: "Calendar", desc: "A schedule that protects what your goals need.", ai: "Defends focus time on its own", icon: CalendarDays },
  { name: "Journal", desc: "A place to write that Nova actually reads.", ai: "Extracts tone, energy and momentum", icon: NotebookPen },
  { name: "Mood", desc: "A daily signal that softens Nova's tone when needed.", ai: "Adjusts pacing of suggestions", icon: Smile },
  { name: "Travel", desc: "Flights and stays that reshape the days around them.", ai: "Reschedules meetings across time zones", icon: PlaneTakeoff },
  { name: "Documents", desc: "Files kept in reach of the work they belong to.", ai: "Surfaces the right file before you ask", icon: FileText },
  { name: "Memories", desc: "Patterns from every past day, kept quietly in mind.", ai: "Notices what's changed since last month", icon: Sparkles },
  { name: "Assistant", desc: "The conversational entry point into everything above.", ai: "Answers using your full day's context", icon: Bot },
  { name: "Notifications", desc: "Only what's earned your attention, nothing else.", ai: "Filters noise against real urgency", icon: Bell },
];

function FeatureEcosystem() {
  return (
    <section className="px-6 py-28 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow>The full ecosystem</Eyebrow>
          <h2
            className="max-w-xl text-3xl font-semibold leading-tight tracking-tight text-[#EEF0F6] sm:text-4xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Eleven modules. One shared memory.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => (
            <Reveal
              key={m.name}
              delay={i % 6}
              className={`group relative overflow-hidden ${glass} p-6 transition-all duration-400 hover:-translate-y-1 hover:border-[#7C8CFF]/30`}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#7C8CFF]/0 blur-2xl transition-all duration-500 group-hover:bg-[#7C8CFF]/20"
              />
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05]">
                <m.icon className="h-[18px] w-[18px] text-[#B9BFFF]" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-[#EEF0F6]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {m.name}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#8A90A6]">{m.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 border-t border-white/[0.06] pt-3 text-[11px] text-[#7C8CFF]">
                <Sparkles className="h-3 w-3" />
                {m.ai}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Demo Experience                                           */
/* ------------------------------------------------------------------ */

const demoJourney: { title: string; body: string; icon: LucideIcon }[] = [
  { title: "Discovery", body: "We learn how your day actually runs today.", icon: Compass },
  { title: "Personalization", body: "Nova is set up with your real modules and goals.", icon: Wand2 },
  { title: "AI Workflow", body: "You watch context move between modules live.", icon: Layers },
  { title: "Daily Planning", body: "A real morning brief is generated for your day.", icon: Sun },
  { title: "Automation", body: "See a task completion ripple into goals and calendar.", icon: Gauge },
  { title: "Insights", body: "Review what Nova noticed across a sample week.", icon: LineChart },
  { title: "Questions", body: "Open floor for anything specific to your workflow.", icon: MessageSquareText },
  { title: "Implementation", body: "We map a rollout plan for your team.", icon: ClipboardCheck },
];

function DemoExperience() {
  return (
    <section className="px-6 py-28 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <Eyebrow>Inside a live demo</Eyebrow>
          <h2
            className="mx-auto max-w-xl text-3xl font-semibold leading-tight tracking-tight text-[#EEF0F6] sm:text-4xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Forty-five minutes, mapped to your actual day.
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {demoJourney.map((step, i) => (
            <Reveal key={step.title} delay={i % 4} className="relative">
              <div className={`${glass} ${glassHover} flex h-full flex-col gap-3 p-5`}>
                <span
                  className="font-mono text-[11px] text-[#6B7086]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <step.icon className="h-[18px] w-[18px] text-[#B9BFFF]" strokeWidth={1.75} />
                <h3 className="text-sm font-semibold text-[#EEF0F6]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {step.title}
                </h3>
                <p className="text-[12px] leading-relaxed text-[#8A90A6]">{step.body}</p>
              </div>
              {i < demoJourney.length - 1 && i % 4 !== 3 && (
                <ArrowRight className="absolute -right-3 top-1/2 hidden h-3.5 w-3.5 -translate-y-1/2 text-[#3C4155] sm:block" />
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Customer Benefits                                         */
/* ------------------------------------------------------------------ */

const benefits: { stat: string; label: string; body: string }[] = [
  { stat: "6→1", label: "Fewer apps checked each morning", body: "Tasks, goals, calendar and journal open from one place." },
  { stat: "-38%", label: "Less context switching", body: "Reported by early teams after their second week on Nova." },
  { stat: "2 min", label: "Time to a finished daily plan", body: "Down from piecing one together across separate apps." },
  { stat: "100%", label: "Of context carried forward", body: "Nothing typed twice — every module reads the others." },
];

function CustomerBenefits() {
  return (
    <section className="px-6 py-28 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow>What actually changes</Eyebrow>
          <h2
            className="max-w-xl text-3xl font-semibold leading-tight tracking-tight text-[#EEF0F6] sm:text-4xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Not new features. A different kind of day.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <Reveal key={b.label} delay={i} className={`${glass} p-6`}>
              <div
                className="text-3xl font-semibold tracking-tight text-transparent"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  backgroundImage: "linear-gradient(90deg,#9BA6FF,#B98CFF)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}
              >
                {b.stat}
              </div>
              <p className="mt-3 text-sm font-medium text-[#EEF0F6]">{b.label}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#8A90A6]">{b.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={2} className={`mt-6 grid grid-cols-1 gap-4 ${glass} p-8 sm:grid-cols-2`}>
          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#6B7086]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Without Nova
            </p>
            <ul className="space-y-2.5 text-sm text-[#8A90A6]">
              <li>Plans rebuilt by hand across four apps</li>
              <li>Goals drift because progress isn't visible daily</li>
              <li>Notifications interrupt regardless of urgency</li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#7C8CFF]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              With Nova
            </p>
            <ul className="space-y-2.5 text-sm text-[#EEF0F6]">
              <li>One brief, generated from everything you did yesterday</li>
              <li>Goals move the moment a related task closes</li>
              <li>Only what's genuinely urgent reaches you</li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Final CTA                                                 */
/* ------------------------------------------------------------------ */

function FinalCTA() {
  return (
    <section className="px-6 pb-32 pt-8 sm:px-10 lg:px-16">
      <Reveal className="relative mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-white/[0.1] px-8 py-20 text-center sm:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(124,140,255,0.22), transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.03), transparent)",
          }}
        />
        <div className="relative">
          <Rocket className="mx-auto h-8 w-8 text-[#B9BFFF]" strokeWidth={1.5} />
          <h2
            className="mx-auto mt-6 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-[#EEF0F6] sm:text-4xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            See Nova transform your daily workflow
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[#A6ABC0]">
            Book a personalized walkthrough and discover how Nova connects every
            part of your day into one intelligent operating system.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium text-[#05070B] transition-transform duration-300 hover:scale-[1.02]">
              <span className="absolute inset-0 bg-gradient-to-r from-[#9BA6FF] to-[#B98CFF]" />
              <span className="relative">Request Demo</span>
              <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] px-7 py-3.5 text-sm font-medium text-[#EEF0F6] transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.04]">
              <CalendarCheck className="h-4 w-4" />
              Schedule Live Walkthrough
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Sticky header                                                      */
/* ------------------------------------------------------------------ */

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
      <div
        className={`flex items-center gap-2.5 rounded-full ${glass} px-4 py-2`}
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#7C8CFF] to-[#B98CFF]">
          <Coffee className="h-3 w-3 text-[#05070B]" strokeWidth={2.2} />
        </div>
        <span className="text-sm font-semibold text-[#EEF0F6]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Nova
        </span>
      </div>
      <button className="hidden items-center gap-2 rounded-full border border-white/[0.12] bg-[#05070B]/60 px-5 py-2.5 text-sm font-medium text-[#EEF0F6] backdrop-blur-xl transition-colors duration-300 hover:border-white/25 sm:inline-flex">
        Request Demo
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function RequestDemoPage() {
  return (
    <div
      className="min-h-screen bg-[#05070B] text-[#EEF0F6] antialiased"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        ${FONT_IMPORT}
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <Header />
      <Hero />
      <div className="mx-auto h-px max-w-6xl bg-white/[0.06]" />
      <WhatMakesDifferent />
      <div className="mx-auto h-px max-w-6xl bg-white/[0.06]" />
      <InteractiveWorkflow />
      <div className="mx-auto h-px max-w-6xl bg-white/[0.06]" />
      <AIEngine />
      <div className="mx-auto h-px max-w-6xl bg-white/[0.06]" />
      <DayTimeline />
      <div className="mx-auto h-px max-w-6xl bg-white/[0.06]" />
      <FeatureEcosystem />
      <div className="mx-auto h-px max-w-6xl bg-white/[0.06]" />
      <DemoExperience />
      <div className="mx-auto h-px max-w-6xl bg-white/[0.06]" />
      <CustomerBenefits />
      <FinalCTA />
    </div>
  );
}