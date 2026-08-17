import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/logos/logo-option-2.png"
      alt="Agentic AI Notebook"
      width={128}
      height={128}
      className={cn("h-8 w-8 shrink-0 rounded-lg", className)}
      priority
    />
  );
}
