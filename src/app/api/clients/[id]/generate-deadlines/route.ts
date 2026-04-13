import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateDeadlinesForRegime } from "@/lib/deadlines/templates";

// POST /api/clients/:id/generate-deadlines - Auto-generate deadlines based on regime fiscal
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const year = body.year ?? new Date().getFullYear();

  const client = await prisma.client.findUnique({
    where: { id },
    select: { id: true, regimeFiscal: true, name: true },
  });

  if (!client) {
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
  }

  if (!client.regimeFiscal) {
    return NextResponse.json(
      { error: "Le client n'a pas de regime fiscal configure. Modifiez sa fiche d'abord." },
      { status: 400 }
    );
  }

  const templates = generateDeadlinesForRegime(client.regimeFiscal, year);

  if (templates.length === 0) {
    return NextResponse.json(
      { error: "Aucun template d'echeance pour ce regime fiscal" },
      { status: 400 }
    );
  }

  // Create all deadlines in a batch
  const created = await prisma.deadline.createMany({
    data: templates.map((t) => ({
      title: t.title,
      type: t.type as never,
      description: t.description,
      dueDate: t.dueDate,
      clientId: id,
      status: t.dueDate < new Date() ? "OVERDUE" as const : "UPCOMING" as const,
    })),
  });

  return NextResponse.json({
    success: true,
    created: created.count,
    year,
    regime: client.regimeFiscal,
    message: `${created.count} echeances generees pour ${client.name} (${year})`,
  });
}
