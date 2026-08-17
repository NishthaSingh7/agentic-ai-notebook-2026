"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Search,
  Bot,
  ChevronDown,
  KeyRound,
  FileText,
  Info,
  Terminal,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchDialog } from "./search-dialog";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "./theme-toggle";
import { NavProgress } from "./nav-progress";
import { BrandLogo } from "./brand-logo";

const primaryNav = [
  { name: "Roadmap", href: "/roadmap" },
  { name: "Projects", href: "/projects" },
  { name: "Glossary", href: "/glossary" },
] as const;

const moreLinks = [
  { name: "Get API Keys", href: "/get-api-keys", icon: KeyRound },
  { name: "Blog", href: "/blog", icon: FileText },
  { name: "About", href: "/about", icon: Info },
] as const;

const phaseLinks = [
  { name: "Programming", href: "/roadmap/programming-foundations", icon: Terminal },
  { name: "GenAI", href: "/roadmap/genai-foundations", icon: Brain },
  { name: "Agents", href: "/roadmap/agent-foundations", icon: Bot },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLink({
  href,
  children,
  pathname,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  pathname: string;
  onClick?: () => void;
}) {
  const active = isActive(pathname, href);
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex h-14 items-center border-b-2 px-3 text-sm font-medium transition-colors",
        active
          ? "border-accent text-text-primary"
          : "border-transparent text-text-muted hover:text-text-secondary"
      )}
    >
      {children}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const moreActive = moreLinks.some((item) => isActive(pathname, item.href));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
          {/* Brand */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <BrandLogo />
            <span className="hidden font-semibold tracking-tight sm:block">
              Agentic AI
              <span className="ml-1.5 font-normal text-text-muted">2026</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {primaryNav.map((item) => (
              <NavLink key={item.href} href={item.href} pathname={pathname}>
                {item.name}
              </NavLink>
            ))}

            <div ref={moreRef} className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((prev) => !prev)}
                className={cn(
                  "flex h-14 items-center gap-1 border-b-2 px-3 text-sm font-medium transition-colors",
                  moreActive || moreOpen
                    ? "border-accent text-text-primary"
                    : "border-transparent text-text-muted hover:text-text-secondary"
                )}
                aria-expanded={moreOpen}
              >
                More
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform", moreOpen && "rotate-180")}
                />
              </button>

              {moreOpen && (
                <div className="absolute left-0 top-full z-50 mt-3 w-48 overflow-hidden rounded-xl border border-border bg-background py-1 shadow-xl">
                  {moreLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 text-sm transition-colors",
                        isActive(pathname, item.href)
                          ? "bg-surface-elevated text-text-primary"
                          : "text-text-secondary hover:bg-surface hover:text-text-primary"
                      )}
                    >
                      <item.icon className="h-4 w-4 text-text-muted" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
            <div className="hidden sm:flex items-center gap-1 rounded-full border border-border bg-surface/60 p-0.5">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-elevated hover:text-text-primary"
                title="Search (⌘K)"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
              <NavProgress compact />
              <ThemeToggle compact />
            </div>

            {/* Mobile-only search + theme outside pill */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface sm:hidden"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <div className="sm:hidden">
              <ThemeToggle compact />
            </div>

            <UserMenu />

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="border-t border-border bg-background px-4 py-4 lg:hidden">
            <div className="mb-4 sm:hidden">
              <NavProgress />
            </div>

            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Navigate
            </p>
            <div className="space-y-0.5 mb-5">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive(pathname, item.href)
                      ? "bg-surface-elevated text-text-primary font-medium"
                      : "text-text-secondary hover:bg-surface"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Phases
            </p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {phaseLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border border-border px-2 py-3 text-center text-xs transition-colors",
                    isActive(pathname, item.href)
                      ? "border-accent/40 bg-accent/5 text-text-primary"
                      : "text-text-secondary hover:bg-surface"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>

            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              More
            </p>
            <div className="space-y-0.5">
              {moreLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive(pathname, item.href)
                      ? "bg-surface-elevated text-text-primary font-medium"
                      : "text-text-secondary hover:bg-surface"
                  )}
                >
                  <item.icon className="h-4 w-4 text-text-muted" />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
