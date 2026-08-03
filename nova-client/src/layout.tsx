import type { ReactNode } from "react";



import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

interface RootProviderProps {
  children: ReactNode;
}

export default function RootProvider({ children }: RootProviderProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen font-body bg-background text-foreground antialiased">
        {children}
      </div>
    </ThemeProvider>
  );
}