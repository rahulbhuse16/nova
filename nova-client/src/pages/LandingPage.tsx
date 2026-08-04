import { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  Sparkles,
  CheckSquare,
  Target,
  CalendarDays,
  BookHeart,
  Images,
  Plane,
  Mic,
  Bell,
  Menu,
  X,
  ArrowRight,
  PlayCircle,
  Sunrise,
  Compass,
  BookOpen,
  Moon,
  Activity,
  Brain,
  ListOrdered,
  TrendingUp,
  MapPin,
  CloudSun,
  Wallet,
  Check,
  MessageCircle,
  Flame,
  ChevronRight,
} from "lucide-react";

interface NavLink {
  label: string;
  href: string;
}

interface FeatureCard {
  icon: typeof Sparkles;
  title: string;
  description: string;
}

interface TimelineStep {
  period: string;
  time: string;
  title: string;
  description: string;
  icon: typeof Sunrise;
}

interface AIFlowStep {
  label: string;
  icon: typeof Activity;
}

interface TaskItem {
  label: string;
  done: boolean;
}

interface CalendarChip {
  day: string;
  date: number;
  active: boolean;
}

const NAV_LINKS: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "AI", href: "#ai" },
  { label: "Pricing", href: "#pricing" },
];

const FEATURES: FeatureCard[] = [
  { icon: Sparkles, title: "AI Assistant", description: "A companion that understands your day and steps in exactly when it helps." },
  { icon: CheckSquare, title: "Smart Tasks", description: "Tasks that prioritize themselves based on your energy, deadlines, and habits." },
  { icon: Target, title: "Goals", description: "Long-term goals broken into daily moves you'll actually complete." },
  { icon: CalendarDays, title: "Calendar", description: "One intelligent calendar that plans around your focus, not just your meetings." },
  { icon: BookHeart, title: "Journal", description: "Reflect in seconds — Nova asks the right question at the right time." },
  { icon: Images, title: "Memories", description: "The moments worth keeping, resurfaced when they matter again." },
  { icon: Plane, title: "Travel Planner", description: "Full itineraries planned around your budget, pace, and interests." },
  { icon: Mic, title: "Voice Assistant", description: "Talk to Nova like a person — plan, log, and ask, hands-free." },
  { icon: Bell, title: "Smart Notifications", description: "Fewer pings, better timing — only what actually needs you." },
];

const DAILY_TIMELINE: TimelineStep[] = [
  { period: "Morning", time: "7:00 AM", title: "Daily Briefing", description: "Nova opens your day with what matters — weather, priorities, and a clear first move.", icon: Sunrise },
  { period: "Afternoon", time: "1:00 PM", title: "Focus & Tasks", description: "Deep work blocks protected automatically, tasks resurfaced when you have room.", icon: Compass },
  { period: "Evening", time: "7:00 PM", title: "Reflection & Journal", description: "A short prompt to close the day out, shaped by what actually happened.", icon: BookOpen },
  { period: "Night", time: "10:00 PM", title: "Tomorrow Planning", description: "Nova quietly lays out tomorrow while you wind down.", icon: Moon },
];

const AI_FLOW: AIFlowStep[] = [
  { label: "User activity", icon: Activity },
  { label: "Nova understands patterns", icon: Brain },
  { label: "AI organizes priorities", icon: ListOrdered },
  { label: "Nova suggests actions", icon: Sparkles },
  { label: "User achieves more", icon: TrendingUp },
];

const HERO_TASKS: TaskItem[] = [
  { label: "Morning workout", done: true },
  { label: "Review Q3 roadmap", done: true },
  { label: "Call with design team", done: false },
  { label: "Draft investor update", done: false },
];

const CALENDAR_STRIP: CalendarChip[] = [
  { day: "M", date: 12, active: false },
  { day: "T", date: 13, active: false },
  { day: "W", date: 14, active: true },
  { day: "T", date: 15, active: false },
  { day: "F", date: 16, active: false },
  { day: "S", date: 17, active: false },
  { day: "S", date: 18, active: false },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

function Reveal({
  children,
  variants = fadeUp,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function DashboardMock({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "p-5" : "p-6"}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-500 dark:text-indigo-400">Wednesday, Jan 14</p>
          <h3 className={compact ? "mt-1 text-lg font-semibold text-zinc-900 dark:text-white" : "mt-1 text-xl font-semibold text-zinc-900 dark:text-white"}>
            Good morning
          </h3>
        </div>
        <div className="relative h-12 w-12 shrink-0">
          <svg viewBox="0 0 48 48" className="h-12 w-12 -rotate-90">
            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-zinc-200 dark:text-zinc-800" />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="url(#novaGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="125.6"
              strokeDashoffset="35"
            />
            <defs>
              <linearGradient id="novaGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-zinc-900 dark:text-white">72%</span>
        </div>
      </div>

      <div className="mt-5 flex gap-1.5">
        {CALENDAR_STRIP.map((chip) => (
          <div
            key={chip.date}
            className={
              chip.active
                ? "flex flex-1 flex-col items-center rounded-xl bg-gradient-to-b from-indigo-500 to-purple-600 py-2 text-white shadow-lg shadow-indigo-500/30"
                : "flex flex-1 flex-col items-center rounded-xl bg-zinc-100 py-2 text-zinc-500 dark:bg-zinc-800/80 dark:text-zinc-400"
            }
          >
            <span className="text-[10px] font-medium">{chip.day}</span>
            <span className="text-xs font-semibold">{chip.date}</span>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">Today's tasks</p>
        <div className="mt-2 space-y-2">
          {HERO_TASKS.map((task) => (
            <div key={task.label} className="flex items-center gap-2.5 rounded-xl bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800/60">
              <span
                className={
                  task.done
                    ? "flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                    : "h-4 w-4 shrink-0 rounded-full border-2 border-zinc-300 dark:border-zinc-600"
                }
              >
                {task.done && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
              </span>
              <span className={task.done ? "text-sm text-zinc-400 line-through dark:text-zinc-500" : "text-sm text-zinc-700 dark:text-zinc-200"}>
                {task.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-3.5 dark:from-indigo-500/10 dark:to-purple-500/10">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
        <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
          You have a 2-hour gap at 2 PM — want Nova to schedule deep work for the investor update?
        </p>
      </div>
    </div>
  );
}

function LaptopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="rounded-[28px] border-[10px] border-zinc-800 bg-zinc-800 shadow-2xl dark:border-zinc-700 dark:bg-zinc-700">
        <div className="relative overflow-hidden rounded-[18px] bg-white dark:bg-zinc-950">
          <div className="absolute left-1/2 top-0 h-5 w-32 -translate-x-1/2 rounded-b-xl bg-zinc-800 dark:bg-zinc-700" />
          {children}
        </div>
      </div>
      <div className="mx-auto h-4 w-[110%] max-w-none -translate-x-[5%] rounded-b-2xl bg-gradient-to-b from-zinc-300 to-zinc-400 shadow-lg dark:from-zinc-700 dark:to-zinc-800" />
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const heroParallaxY = useTransform(scrollY, [0, 800], [0, 160]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-[#09090B] dark:text-white">
      <nav
        className={
          scrolled
            ? "fixed inset-x-0 top-0 z-50 border-b border-zinc-200/70 bg-white/70 backdrop-blur-xl transition-colors dark:border-zinc-800/70 dark:bg-[#09090B]/70"
            : "fixed inset-x-0 top-0 z-50 border-b border-transparent bg-transparent transition-colors"
        }
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a href="#" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Nova</span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a href="/auth" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
              Login
            </a>
            <a href="/today" className="group flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.03] dark:bg-white dark:text-zinc-900">
              Get Started
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-700 md:hidden dark:text-zinc-200"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-zinc-200 bg-white px-6 py-4 md:hidden dark:border-zinc-800 dark:bg-[#09090B]"
          >
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a key={link.label} href={link.href} className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                  {link.label}
                </a>
              ))}
              <a href="/today" className="rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </nav>

      <section className="relative overflow-hidden pb-24 pt-40 md:pt-48">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <motion.div
            style={{ y: heroParallaxY }}
            className="absolute left-1/2 top-[-10%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200 via-blue-100 to-purple-200 opacity-60 blur-3xl dark:from-indigo-500/20 dark:via-blue-500/10 dark:to-purple-500/20"
          />
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/60 px-3.5 py-1.5 text-xs font-medium text-zinc-600 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300">
                <Sparkles className="h-3 w-3 text-indigo-500" />
                Introducing Nova
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
                Your Life.
                <br />
                <span className="bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  One Intelligent Operating System.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-500 dark:text-zinc-400">
                Nova plans, organizes, and reasons about your entire day — tasks, calendar, goals, and more — so you can
                spend less time managing life and more time living it.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-transform hover:scale-[1.03]">
                  Start Using Nova
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800">
                  <PlayCircle className="h-4 w-4" />
                  Watch Demo
                </button>
              </div>
            </Reveal>
          </div>

          <div className="relative mx-auto mt-20 max-w-3xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={scaleIn}>
              <div className="rounded-[32px] border border-zinc-200/80 bg-white/90 shadow-2xl shadow-zinc-300/40 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/90 dark:shadow-black/40">
                <DashboardMock />
              </div>
            </motion.div>

            <motion.div
              className="absolute -left-10 top-10 hidden w-52 rounded-2xl border border-zinc-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/95 lg:block"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.7 }}
              animate={{ y: [0, -10, 0] }}
              style={{ animationDuration: "6s" }}
            >
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-500" />
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Goal progress</span>
              </div>
              <p className="mt-2 text-2xl font-semibold">68%</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" />
              </div>
              <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">Run a 10K by March</p>
            </motion.div>

            <motion.div
              className="absolute -right-8 bottom-6 hidden w-56 rounded-2xl border border-zinc-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/95 lg:block"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55, duration: 0.7 }}
              animate={{ y: [0, 12, 0] }}
              style={{ animationDuration: "7s" }}
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                  <MessageCircle className="h-4 w-4 text-white" />
                </span>
                <div>
                  <p className="text-xs font-semibold">Nova</p>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500">Just now</p>
                </div>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                You focused for 3.5 hours today — your best streak this month.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="ai" className="border-t border-zinc-100 bg-zinc-50/60 py-28 dark:border-zinc-900 dark:bg-zinc-950/40">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-500">Context-aware AI</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Nova understands your context</h2>
            <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
              Not another chatbot bolted onto a to-do list — Nova reasons about how you actually spend your day.
            </p>
          </Reveal>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="mt-16 flex flex-col items-center gap-4 md:flex-row md:items-stretch md:justify-between md:gap-3"
          >
            {AI_FLOW.map((step, i) => (
              <motion.div key={step.label} variants={staggerItem} className="flex items-center gap-3 md:flex-1 md:flex-col md:gap-0 md:text-center">
                <div className="flex flex-col items-center md:flex-1 md:justify-center">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-lg shadow-zinc-200/60 dark:bg-zinc-900 dark:shadow-black/30">
                    <step.icon className="h-6 w-6 text-indigo-500" />
                  </div>
                  <p className="mt-3 max-w-[9rem] text-sm font-medium text-zinc-700 dark:text-zinc-200">{step.label}</p>
                </div>
                {i < AI_FLOW.length - 1 && (
                  <ChevronRight className="hidden h-5 w-5 shrink-0 text-zinc-300 dark:text-zinc-700 md:mt-6 md:block" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-28">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-500">A day with Nova</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Present through the whole day</h2>
          </Reveal>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {DAILY_TIMELINE.map((step) => (
              <motion.div
                key={step.period}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                  <step.icon className="h-5 w-5 text-indigo-500" />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  {step.period} · {step.time}
                </p>
                <h3 className="mt-1.5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="features" className="border-t border-zinc-100 bg-zinc-50/60 py-28 dark:border-zinc-900 dark:bg-zinc-950/40">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-500">Everything, in one place</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Built for your entire day</h2>
          </Reveal>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-600 transition-transform duration-300 group-hover:scale-x-100" />
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-500">Travel Planner</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Trips, planned like magic</h2>
              <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
                Drop a pin, tell Nova your budget and interests, and get a full itinerary — weather, places, restaurants,
                and a day-by-day plan built around how you actually like to travel.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {[
                  { icon: MapPin, label: "Destination-aware" },
                  { icon: CloudSun, label: "Live weather" },
                  { icon: Wallet, label: "Budget planning" },
                ].map((pill) => (
                  <span
                    key={pill.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                  >
                    <pill.icon className="h-3.5 w-3.5 text-indigo-500" />
                    {pill.label}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal variants={scaleIn}>
              <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex h-44 items-center justify-center bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600">
                  <MapPin className="h-10 w-10 text-white/90" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Santorini, Greece</h3>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                      98 trip score
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl bg-zinc-50 py-3 dark:bg-zinc-800/60">
                      <CloudSun className="mx-auto h-4 w-4 text-indigo-500" />
                      <p className="mt-1 text-sm font-semibold">26°C</p>
                    </div>
                    <div className="rounded-xl bg-zinc-50 py-3 dark:bg-zinc-800/60">
                      <Wallet className="mx-auto h-4 w-4 text-indigo-500" />
                      <p className="mt-1 text-sm font-semibold">$2,400</p>
                    </div>
                    <div className="rounded-xl bg-zinc-50 py-3 dark:bg-zinc-800/60">
                      <CalendarDays className="mx-auto h-4 w-4 text-indigo-500" />
                      <p className="mt-1 text-sm font-semibold">6 days</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                    Nova's plan leans into sunset views and quiet coastal towns, with two open evenings to wander.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-100 bg-zinc-50/60 py-28 dark:border-zinc-900 dark:bg-zinc-950/40">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-500">See it in action</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">A dashboard that feels alive</h2>
          </Reveal>

          <Reveal variants={scaleIn} className="mt-16">
            <LaptopFrame>
              <div className="flex">
                <div className="hidden w-16 flex-col items-center gap-5 border-r border-zinc-100 bg-zinc-50/80 py-6 dark:border-zinc-800 dark:bg-zinc-900/60 sm:flex">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                    <Sparkles className="h-4 w-4 text-white" />
                  </span>
                  {[Flame, CheckSquare, CalendarDays, Target, BookHeart].map((Icon, i) => (
                    <span
                      key={i}
                      className={
                        i === 0
                          ? "flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10"
                          : "flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 dark:text-zinc-600"
                      }
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                  ))}
                </div>
                <div className="flex-1">
                  <DashboardMock compact />
                </div>
              </div>
            </LaptopFrame>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden py-32">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600" />
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_45%)]" />

        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <h2 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Build a better tomorrow with Nova.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
              Your day, understood and organized by an AI that actually pays attention.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-xl transition-transform hover:scale-[1.03]">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                Explore Nova
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-zinc-100 py-10 dark:border-zinc-900">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <a href="#" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </span>
            <span className="text-sm font-semibold">Nova</span>
          </a>
          <p className="text-xs text-zinc-400 dark:text-zinc-600">© {new Date().getFullYear()} Nova. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}