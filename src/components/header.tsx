"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Search,
  BookOpen,
  Code,
  Map,
  Brain,
  Bot,
  Terminal,
  FolderKanban,
  BookMarked,
  Library,
  FileText,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchDialog } from "./search-dialog";
import { UserMenu } from "./user-menu";

const navigation = [
  { name: "Home", href: "/", icon: BookOpen },
  { name: "Roadmap", href: "/roadmap", icon: Map },
  { name: "Programming", href: "/roadmap/programming-foundations", icon: Terminal },
  { name: "GenAI", href: "/roadmap/genai-foundations", icon: Brain },
  { name: "Agents", href: "/roadmap/agent-foundations", icon: Bot },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Glossary", href: "/glossary", icon: BookMarked },
  { name: "Resources", href: "/resources", icon: Library },
  { name: "Blog", href: "/blog", icon: FileText },
  { name: "About", href: "/about", icon: Info },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg brand-gradient">
              <Bot className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="hidden font-semibold sm:block">
              Agentic AI Notebook <span className="text-text-muted font-normal">2026</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navigation.filter((item) =>
              ["Home", "Roadmap", "Projects", "Glossary", "Resources"].includes(item.name)
            ).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "bg-surface-elevated text-text-primary"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-colors hover:text-text-secondary sm:w-auto sm:px-3 sm:gap-2"
              title="Search (⌘K)"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline text-sm">Search</span>
              <kbd className="hidden lg:inline rounded border border-border bg-surface-elevated px-1.5 py-0.5 text-[10px] font-mono">
                ⌘K
              </kbd>
            </button>

            <UserMenu />

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-text-secondary hover:bg-surface lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-border bg-background px-4 py-3 lg:hidden">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  pathname === item.href
                    ? "bg-surface-elevated text-text-primary"
                    : "text-text-secondary hover:bg-surface"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
