import type { ReactNode } from "react";
import { stripFocusMarker } from "@/lib/enhance-lesson-code";

const KEYWORDS: Record<string, Set<string>> = {
  python: new Set([
    "import", "from", "def", "class", "return", "if", "else", "elif", "for", "while",
    "with", "as", "try", "except", "raise", "async", "await", "yield", "pass", "None",
    "True", "False", "and", "or", "not", "in", "is", "lambda", "global", "assert",
  ]),
  bash: new Set(["if", "then", "else", "fi", "for", "do", "done", "export", "echo"]),
  yaml: new Set(["name", "on", "jobs", "runs-on", "steps", "uses", "with", "run", "needs", "if"]),
  sql: new Set(["SELECT", "FROM", "WHERE", "INSERT", "INTO", "UPDATE", "DELETE", "JOIN", "ORDER", "BY", "LIMIT"]),
};

function detectLanguage(code: string): string {
  if (code.includes("runs-on:") || code.includes("github/workflows")) return "yaml";
  if (code.startsWith("#") && (code.includes("git ") || code.includes("docker "))) return "bash";
  if (code.includes("import ") || code.includes("def ") || code.includes("@app.")) return "python";
  if (code.includes("SELECT ") || code.includes("Column(")) return "python";
  return "bash";
}

function highlightString(token: string, key: string): ReactNode {
  return (
    <span key={key} className="text-amber-300">
      {token}
    </span>
  );
}

function highlightComment(text: string, key: string): ReactNode {
  return (
    <span key={key} className="text-emerald-400/80 italic">
      {text}
    </span>
  );
}

function highlightKeyword(token: string, key: string): ReactNode {
  return (
    <span key={key} className="text-sky-300 font-medium">
      {token}
    </span>
  );
}

function tokenizeLine(line: string, lang: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const keywords = KEYWORDS[lang] ?? KEYWORDS.python;
  let i = 0;
  let key = 0;

  while (i < line.length) {
    const rest = line.slice(i);

    // Full-line or inline comment
    if (rest.startsWith("#")) {
      parts.push(highlightComment(rest, `c${key++}`));
      break;
    }

    // Strings
    const strMatch = rest.match(/^("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')/);
    if (strMatch) {
      parts.push(highlightString(strMatch[0], `s${key++}`));
      i += strMatch[0].length;
      continue;
    }

    // Words (keywords)
    const wordMatch = rest.match(/^([a-zA-Z_@][\w]*)/);
    if (wordMatch) {
      const word = wordMatch[1];
      if (keywords.has(word) || keywords.has(word.toUpperCase())) {
        parts.push(highlightKeyword(word, `k${key++}`));
      } else {
        parts.push(<span key={`w${key++}`}>{word}</span>);
      }
      i += word.length;
      continue;
    }

    // Other characters
    parts.push(<span key={`o${key++}`}>{rest[0]}</span>);
    i += 1;
  }

  return parts;
}

export interface HighlightedCodeLine {
  tokens: ReactNode[];
  focused: boolean;
}

export function highlightCodeToLines(code: string, language?: string): HighlightedCodeLine[] {
  const lang = language ?? detectLanguage(code);
  return code.split("\n").map((line) => {
    const { content, focused } = stripFocusMarker(line);
    return {
      tokens: tokenizeLine(content, lang),
      focused,
    };
  });
}
