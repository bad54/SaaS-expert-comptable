import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/messages?clientId=xxx - Get messages for a client
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");

  if (!clientId) {
    return NextResponse.json({ error: "clientId requis" }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: { clientId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });

  return NextResponse.json(messages);
}

// POST /api/messages - Send a message
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { content, clientId, senderId } = body;

  if (!content || !clientId || !senderId) {
    return NextResponse.json(
      { error: "Le contenu, le client et l'expediteur sont requis" },
      { status: 400 }
    );
  }

  const message = await prisma.message.create({
    data: {
      content,
      clientId,
      senderId,
    },
    include: {
      sender: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });

  return NextResponse.json(message, { status: 201 });
}
