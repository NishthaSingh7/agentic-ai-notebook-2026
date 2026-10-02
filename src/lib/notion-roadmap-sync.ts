import { getRoadmapProgressRows } from "@/lib/roadmap-progress";

type SkillStatus = "Know" | "Learning" | "Next";

/** Skillset rows that follow a roadmap chapter. Not a secret. */
const SKILLSET_PAGES: { pageId: string; slug: string }[] = [
  { pageId: "3d188b90-241e-81d6-ba37-c99cf1ef8a95", slug: "crewai" },
  { pageId: "3d188b90-241e-81f5-96ca-e5b328cced87", slug: "context-engineering" },
  { pageId: "3d188b90-241e-8100-b917-c2d224ee3cdb", slug: "langgraph" },
  { pageId: "3d188b90-241e-8114-8932-f3c5266e57ff", slug: "security-guardrails" },
  { pageId: "3d188b90-241e-8125-9c88-cb4d78a7bb34", slug: "llm-engineering" },
  { pageId: "3d188b90-241e-812a-b4ce-ff0ccfd73ee1", slug: "agent-evaluation" },
  { pageId: "3d188b90-241e-8130-81fe-fdb8e5f8d455", slug: "production-agents" },
  { pageId: "3d188b90-241e-8133-9de8-ec8b6c169fa7", slug: "rag-engineering" },
  { pageId: "3d188b90-241e-8143-89b1-fd04d2e70a97", slug: "rag-engineering" },
  { pageId: "3d188b90-241e-8163-82b8-fa87fc97e616", slug: "agent-evaluation" },
  { pageId: "3d188b90-241e-8165-aa2d-c14cc9587302", slug: "agent-foundations" },
  { pageId: "3d188b90-241e-8173-a593-db6eba2c6f7e", slug: "mcp" },
  { pageId: "3d188b90-241e-81c7-b61d-fbd1c9e51215", slug: "agent-memory" },
  { pageId: "3d188b90-241e-81e5-9a7c-f6206b7e2261", slug: "tool-calling" },
  { pageId: "3d188b90-241e-81e5-ba26-e3230a1b8fe5", slug: "multi-agent-systems" },
];

const NOTION_VERSION = "2022-06-28";

function toSkillStatus(status: string): SkillStatus {
  if (status === "Cleared") return "Know";
  if (status === "In progress") return "Learning";
  return "Next";
}

function notionConfigured() {
  return Boolean(process.env.NOTION_TOKEN);
}

function shouldSyncEmail(email: string | null | undefined) {
  const owner = process.env.NOTION_SYNC_EMAIL;
  if (!owner || !email) return false;
  return owner.trim().toLowerCase() === email.trim().toLowerCase();
}

async function patchSkillPage(pageId: string, status: SkillStatus) {
  const token = process.env.NOTION_TOKEN;
  if (!token) return;

  const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION,
    },
    body: JSON.stringify({
      properties: {
        Status: { select: { name: status } },
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Notion skill ${pageId} ${response.status}: ${detail.slice(0, 200)}`);
  }
}

export async function syncNotionRoadmap(input: {
  completed: string[];
  email?: string | null;
}) {
  if (!notionConfigured() || !shouldSyncEmail(input.email)) return;

  const bySlug = new Map(
    getRoadmapProgressRows(input.completed).map((row) => [row.slug, row])
  );
  const queue = [...SKILLSET_PAGES];
  const workers = 3;

  await Promise.all(
    Array.from({ length: workers }, async () => {
      while (queue.length > 0) {
        const item = queue.shift();
        if (!item) return;
        const row = bySlug.get(item.slug);
        if (!row) continue;
        await patchSkillPage(item.pageId, toSkillStatus(row.status));
      }
    })
  );
}

export function scheduleNotionRoadmapSync(input: {
  completed: string[];
  email?: string | null;
}) {
  if (!notionConfigured() || !shouldSyncEmail(input.email)) return;
  void syncNotionRoadmap(input).catch((error) => {
    console.error("Notion skillset sync failed", error);
  });
}
