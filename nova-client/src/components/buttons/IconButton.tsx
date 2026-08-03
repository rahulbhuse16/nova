
import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { pressableSubtle } from "../shared/AnimatedSection";

const iconButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        ghost: "text-text-secondary hover:bg-surface hover:text-text",
        glass: "glass border border-border text-text",
        solid: "bg-primary text-primary-foreground",
      },
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
      },
    },
    defaultVariants: { variant: "ghost", size: "md" },
  }
);

export interface IconButtonProps
  extends HTMLMotionProps<"button">,
    VariantProps<typeof iconButtonVariants> {
  icon: React.ReactNode;
  label: string; // required for a11y since there's no visible text
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, icon, label, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        {...pressableSubtle}
        className={cn(iconButtonVariants({ variant, size }), className)}
        {...props}
      >
        {icon}
      </motion.button>
    );
  }
);
IconButton.displayName = "IconButton";
