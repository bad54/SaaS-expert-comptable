import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/documents/:id - Update document (status, type, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { name, type, status } = body;

  const document = await prisma.document.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(type !== undefined && { type }),
      ...(status !== undefined && { status }),
    },
  });

  return NextResponse.json(document);
}

// DELETE /api/documents/:id - Delete a document
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.document.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
