
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GreetingHeaderProps {
  name: string;
  /** Optional override; defaults to a time-of-day greeting. */
  greeting?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

function timeOfDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}

/**
 * The warm, human opener at the top of every page — this is where Nova's
 * "companion" personality lives. Uses the display serif deliberately.
 */
export function GreetingHeader({ name, greeting, subtitle, action, className }: GreetingHeaderProps) {
  const [resolvedGreeting, setResolvedGreeting] = React.useState(greeting ?? "Hello");

  React.useEffect(() => {
    if (!greeting) setResolvedGreeting(timeOfDayGreeting());
  }, [greeting]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className={cn("flex flex-wrap items-end justify-between gap-4", className)}
    >
      <div>
        <p className="text-sm font-medium text-primary">{resolvedGreeting}</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight text-text md:text-4xl">
          {name}
        </h1>
        {subtitle && <p className="mt-2 max-w-lg text-sm text-text-secondary">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
}
