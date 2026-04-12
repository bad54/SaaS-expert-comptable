import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/clients/:id/documents - List documents for a client
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  const documents = await prisma.document.findMany({
    where: {
      clientId: id,
      ...(type && { type: type as never }),
      ...(status && { status: status as never }),
    },
    orderBy: { createdAt: "desc" },
    include: {
      uploadedBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return NextResponse.json(documents);
}

// POST /api/clients/:id/documents - Create a document record
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { name, type, fileUrl, fileSize, mimeType, uploadedById } = body;

  if (!name || !fileUrl || !uploadedById) {
    return NextResponse.json(
      { error: "Le nom, l'URL du fichier et l'auteur sont requis" },
      { status: 400 }
    );
  }

  const document = await prisma.document.create({
    data: {
      name,
      type: type || "AUTRE",
      fileUrl,
      fileSize: fileSize || null,
      mimeType: mimeType || null,
      clientId: id,
      uploadedById,
    },
  });

  return NextResponse.json(document, { status: 201 });
}
