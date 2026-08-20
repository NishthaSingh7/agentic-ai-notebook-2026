"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({ text, label = "Copy", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const value = text.trimEnd();
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      data-no-highlight
      onClick={handleCopy}
      aria-label={copied ? "Copied" : label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-background/80 px-2 py-1 text-[11px] font-medium text-text-muted transition-colors hover:bg-surface-elevated hover:text-text-primary",
        className,
      )}
    >
      {copied ? <Check className="h-3 w-3 text-accent" strokeWidth={2.5} /> : <Copy className="h-3 w-3" strokeWidth={2} />}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
