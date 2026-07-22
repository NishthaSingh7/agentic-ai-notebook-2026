import Link from "next/link";
import { Bot, Heart, Github } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg brand-gradient">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">{siteConfig.name}</span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed mb-4 max-w-sm">
              {siteConfig.description}
            </p>
            <div className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 max-w-sm">
              <p className="text-sm text-text-secondary leading-relaxed">
                <Heart className="inline h-3.5 w-3.5 text-accent mr-1 -mt-0.5" />
                Learning along? We&apos;d love your notes, fixes, and module improvements
                as you go.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Learn</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><Link href="/roadmap" className="hover:text-text-secondary transition-colors">Roadmap</Link></li>
              <li><Link href="/roadmap/genai-foundations" className="hover:text-text-secondary transition-colors">GenAI Foundations</Link></li>
              <li><Link href="/roadmap/agent-foundations" className="hover:text-text-secondary transition-colors">Agent Foundations</Link></li>
              <li><Link href="/projects" className="hover:text-text-secondary transition-colors">Projects</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Prepare</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><Link href="/interview" className="hover:text-text-secondary transition-colors">Interview Prep</Link></li>
              <li><Link href="/glossary" className="hover:text-text-secondary transition-colors">Glossary</Link></li>
              <li><Link href="/resources" className="hover:text-text-secondary transition-colors">Resources</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Community</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><Link href="/blog" className="hover:text-text-secondary transition-colors">Blog</Link></li>
              <li><Link href="/about" className="hover:text-text-secondary transition-colors">About</Link></li>
              <li>
                <Link href="/about#contribute" className="hover:text-text-secondary transition-colors">
                  Contribute
                </Link>
              </li>
              <li>
                <a
                  href={siteConfig.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-text-secondary transition-colors"
                >
                  <Github className="h-3.5 w-3.5" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <div className="text-center sm:text-left">
            <p>{siteConfig.tagline}</p>
            <p className="mt-1 text-xs">
              © {siteConfig.copyright.year}{" "}
              <a
                href={siteConfig.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-text-secondary transition-colors"
              >
                {siteConfig.copyright.holder}
              </a>
              {" · "}
              <a
                href={siteConfig.copyright.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-text-secondary transition-colors"
              >
                MIT License
              </a>
            </p>
          </div>
          <a
            href={siteConfig.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-text-secondary transition-colors"
          >
            <Github className="h-4 w-4" />
            @{siteConfig.github.username}
          </a>
        </div>
      </div>
    </footer>
  );
}
