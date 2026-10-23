import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/logos/hello-human.png"
      alt=""
      width={64}
      height={64}
      className={cn("h-8 w-8 shrink-0 rounded-lg", className)}
      priority
    />
  );
}
