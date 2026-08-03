import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface NavGroupProps {
  label?: string;
  icon?: ReactNode;
  collapsed?: boolean;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export function NavGroup({
  label,
  icon,
  collapsed,
  children,
  className,
  defaultOpen = true,
}: NavGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (collapsed) {
    return <div className={cn("space-y-1", className)}>{children}</div>;
  }

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center gap-2 px-3.5 pb-2 pt-4 text-left transition-colors hover:bg-surface/50 rounded-md"
        >
          
          <p className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          {isOpen ? (
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          )}
        </button>
      )}

      {isOpen && children}
    </div>
  );
}