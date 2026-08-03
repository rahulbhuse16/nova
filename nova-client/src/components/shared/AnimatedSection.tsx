
import * as React from "react";
import { motion, type Variants, type HTMLMotionProps } from "framer-motion";

type AnimationKind = "fade" | "slide-up" | "slide-right" | "scale" | "stagger-children";

const springTransition = { type: "spring", stiffness: 280, damping: 28, mass: 0.9 } as const;

const variantsMap: Record<Exclude<AnimationKind, "stagger-children">, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: springTransition },
  },
  "slide-up": {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: springTransition },
  },
  "slide-right": {
    hidden: { opacity: 0, x: -16 },
    show: { opacity: 1, x: 0, transition: springTransition },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.96 },
    show: { opacity: 1, scale: 1, transition: springTransition },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.03 },
  },
};

export interface AnimatedSectionProps extends Omit<HTMLMotionProps<"div">, "children"> {
  kind?: AnimationKind;
  delay?: number;
  once?: boolean;
  children: React.ReactNode;
}

/**
 * Reusable scroll/mount reveal wrapper. Wraps any content with a consistent
 * spring-based entrance. Use kind="stagger-children" with AnimatedItem
 * children to stagger a list or grid.
 */
export function AnimatedSection({
  kind = "slide-up",
  delay = 0,
  once = true,
  children,
  ...props
}: AnimatedSectionProps) {
  const variants = kind === "stagger-children" ? staggerContainer : variantsMap[kind];

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-40px" }}
      variants={variants}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Pair with AnimatedSection kind="stagger-children" for list/grid items. */
export function AnimatedItem({
  className,
  children,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={variantsMap["slide-up"]} className={className} {...props}>
      {children}
    </motion.div>
  );
}

/** Standard hover + tap micro-interaction for tappable surfaces (cards, buttons). */
export const pressable = {
  whileHover: { scale: 1.015, y: -2 },
  whileTap: { scale: 0.985 },
  transition: springTransition,
};

/** Subtler press for compact controls like icon buttons and chips. */
export const pressableSubtle = {
  whileHover: { scale: 1.04 },
  whileTap: { scale: 0.94 },
  transition: springTransition,
};
