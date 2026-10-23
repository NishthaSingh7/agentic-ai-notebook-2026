export interface ToolLink {
  name: string;
  line: string;
  url: string;
  /** What to open on that site. */
  open: string;
  /** When to stop and come back. */
  stop: string;
  lastChecked: string;
}

export interface OneFunction {
  title: string;
  why: string;
  code: string;
  language: string;
}

export interface SpokenLesson {
  picture: string;
  pictureCaption: string;
  story: string;
  plain: string;
  example: string;
  tryThis: string;
  tools: ToolLink[];
  oneFunction?: OneFunction;
  remember: string;
}

export const CHECKED = "October 2026";

export function tool(
  name: string,
  line: string,
  url: string,
  open: string,
  stop: string
): ToolLink {
  return { name, line, url, open, stop, lastChecked: CHECKED };
}
