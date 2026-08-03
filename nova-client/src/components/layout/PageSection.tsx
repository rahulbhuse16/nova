import * as React from "react";
import { SectionTitle } from "../shared/SectionTitle";
import { AnimatedSection } from "../shared/AnimatedSection";

export interface PageSectionProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  emphasis?: boolean;
  children: React.ReactNode;
  className?: string;
  /** Skip the entrance animation, e.g. for content already above the fold. */
  animate?: boolean;
}

/**
 * A labeled block within a page — "Today's mood", "Recent memories", etc.
 * Title is optional so PageSection can also just be a spacing/animation
 * wrapper around a single PremiumCard.
 */
export function PageSection({
  title,
  description,
  action,
  emphasis,
  children,
  className,
  animate = true,
}: PageSectionProps) {
  const heading = title && (
    <SectionTitle title={title} description={description} action={action} emphasis={emphasis} />
  );

  if (!animate) {
    return (
      <div className={className}>
        {heading}
        {children}
      </div>
    );
  }

  return (
    <AnimatedSection kind="slide-up" className={className}>
      {heading}
      {children}
    </AnimatedSection>
  );
}
