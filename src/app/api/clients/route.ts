import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/clients - List clients with optional search & filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const formeJuridique = searchParams.get("formeJuridique");
  const regimeFiscal = searchParams.get("regimeFiscal");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const skip = (page - 1) * limit;

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { siren: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(formeJuridique && { formeJuridique: formeJuridique as never }),
    ...(regimeFiscal && { regimeFiscal: regimeFiscal as never }),
  };

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: limit,
      include: {
        _count: {
          select: { documents: true, deadlines: true },
        },
      },
    }),
    prisma.client.count({ where }),
  ]);

  return NextResponse.json({
    clients,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// POST /api/clients - Create a new client
export async function POST(request: NextRequest) {
  const body = await request.json();

  const { name, siren, siret, formeJuridique, regimeFiscal, address, phone, email, notes, cabinetId } = body;

  if (!name || !cabinetId) {
    return NextResponse.json(
      { error: "Le nom et le cabinet sont requis" },
      { status: 400 }
    );
  }

  const client = await prisma.client.create({
    data: {
      name,
      siren: siren || null,
      siret: siret || null,
      formeJuridique: formeJuridique || null,
      regimeFiscal: regimeFiscal || null,
      address: address || null,
      phone: phone || null,
      email: email || null,
      notes: notes || null,
      cabinetId,
    },
  });

  return NextResponse.json(client, { status: 201 });
}
