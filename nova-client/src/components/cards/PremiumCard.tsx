
import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { pressable } from "../shared/AnimatedSection";

const cardVariants = cva(
  "relative rounded-lg p-6 transition-shadow",
  {
    variants: {
      variant: {
        default: "bg-card border border-border shadow-soft",
        glass: "glass border border-border shadow-soft",
        gradient: "text-white border-0 shadow-glow",
        outlined: "bg-transparent border border-border-strong",
        success: "bg-success/8 border border-success/20",
        warning: "bg-warning/8 border border-warning/20",
        danger: "bg-error/8 border border-error/20",
        interactive: "bg-card border border-border shadow-soft cursor-pointer hover:shadow-float",
        loading: "bg-card border border-border shadow-soft overflow-hidden",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface PremiumCardProps
  extends Omit<HTMLMotionProps<"div">, "children">,
    VariantProps<typeof cardVariants> {
  children?: React.ReactNode;
  /** Renders a shimmering skeleton body instead of children. */
  loadingRows?: number;
}

/**
 * THE reusable card for Nova. Every surface — a journal entry, a mood
 * summary, a goal, a settings group — is a PremiumCard with a variant,
 * never a bespoke one-off component.
 */
export const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ className, variant, children, loadingRows = 3, onClick, ...props }, ref) => {
    const isInteractive = variant === "interactive" && !!onClick;
    const isLoading = variant === "loading";

    return (
      <motion.div
        ref={ref}
        onClick={onClick}
        {...(isInteractive ? pressable : {})}
        style={variant === "gradient" ? { backgroundImage: "var(--gradient-aurora)" } : undefined}
        className={cn(cardVariants({ variant }), className)}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        {...props}
      >
        {isLoading ? (
          <div className="space-y-3" aria-busy="true" aria-label="Loading">
            {Array.from({ length: loadingRows }).map((_, i) => (
              <div
                key={i}
                className="h-4 rounded-full bg-gradient-to-r from-surface via-card-elevated to-surface bg-[length:800px_100%] animate-shimmer"
                style={{ width: i === loadingRows - 1 ? "60%" : "100%" }}
              />
            ))}
          </div>
        ) : (
          children
        )}
      </motion.div>
    );
  }
);
PremiumCard.displayName = "PremiumCard";

/** Small helper for a card-level inline spinner (e.g. saving state on a card action). */
export function CardSpinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-4 w-4 animate-spin text-muted", className)} />;
}
