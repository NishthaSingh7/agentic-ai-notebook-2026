import { auth } from "@/auth";
import clientPromise, { getDbName } from "@/lib/mongodb";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const doc = await client
    .db(getDbName())
    .collection("user_progress")
    .findOne({ userId: session.user.id });

  return Response.json({ completed: doc?.completed ?? [] });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { completed?: unknown };
  const completed = Array.isArray(body.completed)
    ? body.completed.filter((item): item is string => typeof item === "string")
    : [];

  const client = await clientPromise;
  await client
    .db(getDbName())
    .collection("user_progress")
    .updateOne(
      { userId: session.user.id },
      { $set: { completed, updatedAt: new Date() } },
      { upsert: true }
    );

  return Response.json({ ok: true, completed });
}
