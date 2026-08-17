import { auth } from "@/auth";
import { isHighlightPhase } from "@/lib/curriculum-phases";
import {
  highlightsToColorDict,
  mergeHighlightedText,
  sanitizeHighlightedText,
  sanitizeHighlights,
  type HighlightedText,
} from "@/lib/lesson-highlights";
import clientPromise, { getDbName } from "@/lib/mongodb";

function parseSlug(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const slug = value.trim();
  if (!slug || slug.length > 120 || !/^[a-z0-9-]+$/.test(slug)) return null;
  return slug;
}

function isPhaseTree(tree: HighlightedText): boolean {
  return Object.keys(tree).every((phaseSlug) => isHighlightPhase(phaseSlug));
}

async function loadHighlightedText(userId: string): Promise<HighlightedText> {
  const db = (await clientPromise).db(getDbName());
  const userDoc = await db.collection("user_highlights").findOne({ userId });
  if (userDoc) return sanitizeHighlightedText(userDoc.highlightedText);

  const oldDocs = await db.collection("module_highlights").find({ userId }).toArray();
  if (oldDocs.length === 0) return {};

  let migrated: HighlightedText = {};
  for (const doc of oldDocs) {
    const phaseSlug = parseSlug(doc.phaseSlug);
    const moduleSlug = parseSlug(doc.moduleSlug);
    if (!phaseSlug || !moduleSlug || !isHighlightPhase(phaseSlug)) continue;
    migrated = mergeHighlightedText(migrated, {
      [phaseSlug]: {
        [moduleSlug]: highlightsToColorDict(sanitizeHighlights(doc.highlights)),
      },
    });
  }
  return migrated;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const highlightedText = await loadHighlightedText(session.user.id);
  return Response.json({ highlightedText });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { highlightedText?: unknown };
  const incoming = sanitizeHighlightedText(body.highlightedText);
  if (!isPhaseTree(incoming)) {
    return Response.json({ error: "Invalid highlighted text" }, { status: 400 });
  }

  const existing = await loadHighlightedText(session.user.id);
  const highlightedText = mergeHighlightedText(existing, incoming);

  const client = await clientPromise;
  await client
    .db(getDbName())
    .collection("user_highlights")
    .updateOne(
      { userId: session.user.id },
      {
        $set: {
          userId: session.user.id,
          highlightedText,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

  return Response.json({ ok: true, highlightedText });
}
