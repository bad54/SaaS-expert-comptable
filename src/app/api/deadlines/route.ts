import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/deadlines - List deadlines with filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const clientId = searchParams.get("clientId");
  const month = searchParams.get("month"); // format: YYYY-MM

  const where: Record<string, unknown> = {};
  if (type) where.type = type;
  if (status) where.status = status;
  if (clientId) where.clientId = clientId;
  if (month) {
    const [year, m] = month.split("-").map(Number);
    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 0, 23, 59, 59);
    where.dueDate = { gte: start, lte: end };
  }

  const deadlines = await prisma.deadline.findMany({
    where,
    orderBy: { dueDate: "asc" },
    include: {
      client: {
        select: { id: true, name: true },
      },
    },
  });

  return NextResponse.json(deadlines);
}

// POST /api/deadlines - Create a new deadline
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, type, dueDate, clientId } = body;

  if (!title || !type || !dueDate || !clientId) {
    return NextResponse.json(
      { error: "Le titre, le type, la date et le client sont requis" },
      { status: 400 }
    );
  }

  const deadline = await prisma.deadline.create({
    data: {
      title,
      description: description || null,
      type,
      dueDate: new Date(dueDate),
      clientId,
    },
    include: {
      client: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(deadline, { status: 201 });
}
