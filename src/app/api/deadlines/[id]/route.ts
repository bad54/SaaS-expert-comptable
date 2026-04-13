import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/deadlines/:id - Update a deadline
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { title, description, type, status, dueDate } = body;

  const deadline = await prisma.deadline.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description: description || null }),
      ...(type !== undefined && { type }),
      ...(status !== undefined && { status }),
      ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
    },
    include: {
      client: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(deadline);
}

// DELETE /api/deadlines/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.deadline.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
