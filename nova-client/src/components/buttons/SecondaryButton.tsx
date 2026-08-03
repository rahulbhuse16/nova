
import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { pressable } from "../shared/AnimatedSection";

const secondaryVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-pill font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        outline: "border border-border-strong bg-transparent text-text hover:bg-surface",
        ghost: "bg-transparent text-text-secondary hover:bg-surface hover:text-text",
        subtle: "bg-surface text-text hover:bg-card-elevated",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
      },
    },
    defaultVariants: { variant: "outline", size: "md" },
  }
);

export interface SecondaryButtonProps
  extends Omit<HTMLMotionProps<"button">, "children">,
    VariantProps<typeof secondaryVariants> {
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const SecondaryButton = React.forwardRef<HTMLButtonElement, SecondaryButtonProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        type="button"
        {...pressable}
        className={cn(secondaryVariants({ variant, size }), className)}
        {...props}
      >
        {icon}
        {children}
      </motion.button>
    );
  }
);
SecondaryButton.displayName = "SecondaryButton";
