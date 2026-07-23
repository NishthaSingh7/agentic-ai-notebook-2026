"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { ChevronDown, Loader2, LogIn, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface">
        <Loader2 className="h-4 w-4 animate-spin text-text-muted" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <button
        type="button"
        onClick={() => signIn("google")}
        className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 text-sm text-text-secondary transition-colors hover:border-accent/40 hover:text-text-primary sm:px-3"
        title="Sign in with Google"
      >
        <LogIn className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Sign in</span>
      </button>
    );
  }

  const displayName = session.user.name ?? session.user.email ?? "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface pl-1 pr-2 transition-colors hover:border-accent/30",
          open && "border-accent/40"
        )}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={displayName}
            width={28}
            height={28}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-xs font-medium text-accent">
            {initial}
          </div>
        )}
        <ChevronDown
          className={cn("h-3.5 w-3.5 text-text-muted transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-background shadow-xl"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-medium">{displayName}</p>
            {session.user.email && (
              <p className="truncate text-xs text-text-muted">{session.user.email}</p>
            )}
          </div>
          <div className="p-1">
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
            >
              <User className="h-4 w-4" />
              Profile & progress
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                void signOut();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
