import { auth } from "@/auth";
import { isHighlightPhase } from "@/lib/curriculum-phases";
import { sanitizeHighlights } from "@/lib/lesson-highlights";
import clientPromise, { getDbName } from "@/lib/mongodb";

function parseSlug(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const slug = value.trim();
  if (!slug || slug.length > 120 || !/^[a-z0-9-]+$/.test(slug)) return null;
  return slug;
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const phaseSlug = parseSlug(url.searchParams.get("phaseSlug"));
  const moduleSlug = parseSlug(url.searchParams.get("moduleSlug"));

  if (!phaseSlug || !moduleSlug || !isHighlightPhase(phaseSlug)) {
    return Response.json({ error: "Invalid module" }, { status: 400 });
  }

  const client = await clientPromise;
  const doc = await client
    .db(getDbName())
    .collection("module_highlights")
    .findOne({ userId: session.user.id, phaseSlug, moduleSlug });

  return Response.json({
    highlights: sanitizeHighlights(doc?.highlights),
  });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    phaseSlug?: unknown;
    moduleSlug?: unknown;
    highlights?: unknown;
  };

  const phaseSlug = parseSlug(body.phaseSlug);
  const moduleSlug = parseSlug(body.moduleSlug);

  if (!phaseSlug || !moduleSlug || !isHighlightPhase(phaseSlug)) {
    return Response.json({ error: "Invalid module" }, { status: 400 });
  }

  const highlights = sanitizeHighlights(body.highlights);

  const client = await clientPromise;
  await client
    .db(getDbName())
    .collection("module_highlights")
    .updateOne(
      { userId: session.user.id, phaseSlug, moduleSlug },
      {
        $set: {
          userId: session.user.id,
          phaseSlug,
          moduleSlug,
          highlights,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

  return Response.json({ ok: true, highlights });
}
