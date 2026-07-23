"use client";

import { ProgressProvider } from "@/contexts/progress-context";

export function AppProgressProvider({ children }: { children: React.ReactNode }) {
  return <ProgressProvider>{children}</ProgressProvider>;
}
