import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/clients/:id - Get a single client with relations
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      documents: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      deadlines: {
        orderBy: { dueDate: "asc" },
      },
      _count: {
        select: { documents: true, deadlines: true, messages: true },
      },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
  }

  return NextResponse.json(client);
}

// PUT /api/clients/:id - Update a client
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { name, siren, siret, formeJuridique, regimeFiscal, address, phone, email, notes } = body;

  const client = await prisma.client.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(siren !== undefined && { siren: siren || null }),
      ...(siret !== undefined && { siret: siret || null }),
      ...(formeJuridique !== undefined && { formeJuridique: formeJuridique || null }),
      ...(regimeFiscal !== undefined && { regimeFiscal: regimeFiscal || null }),
      ...(address !== undefined && { address: address || null }),
      ...(phone !== undefined && { phone: phone || null }),
      ...(email !== undefined && { email: email || null }),
      ...(notes !== undefined && { notes: notes || null }),
    },
  });

  return NextResponse.json(client);
}

// DELETE /api/clients/:id - Delete a client
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.client.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
