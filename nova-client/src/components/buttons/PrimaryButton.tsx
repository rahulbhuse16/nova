
import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { pressable } from "../shared/AnimatedSection";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-pill font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid: "bg-primary text-primary-foreground shadow-soft hover:brightness-105",
        gradient: "text-white shadow-glow",
        glass: "glass border border-border text-text hover:bg-card-elevated",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  }
);

export interface PrimaryButtonProps
  extends Omit<HTMLMotionProps<"button">, "children">,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * The primary call-to-action button. Use "gradient" sparingly — one per
 * screen — for the single most important action (e.g. "Start check-in").
 */
export const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, variant, size, loading, icon, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        type="button"
        {...pressable}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size }), className)}
        style={variant === "gradient" ? { backgroundImage: "var(--gradient-aurora)" } : undefined}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
        {children}
      </motion.button>
    );
  }
);
PrimaryButton.displayName = "PrimaryButton";
