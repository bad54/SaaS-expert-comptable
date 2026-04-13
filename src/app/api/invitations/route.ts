import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendClientInvitation } from "@/lib/email";
import crypto from "crypto";

// POST /api/invitations - Send an invitation to a client
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { clientId, email } = body;

  if (!clientId || !email) {
    return NextResponse.json(
      { error: "clientId et email requis" },
      { status: 400 }
    );
  }

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      cabinet: { select: { name: true } },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
  }

  // Generate a unique invitation token
  const token = crypto.randomBytes(32).toString("hex");

  // Update the client email if not set
  if (!client.email) {
    await prisma.client.update({
      where: { id: clientId },
      data: { email },
    });
  }

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portal?invite=${token}&client=${clientId}`;

  try {
    await sendClientInvitation({
      to: email,
      clientName: client.name,
      cabinetName: client.cabinet?.name ?? "Votre cabinet",
      inviteUrl,
    });

    return NextResponse.json({
      success: true,
      inviteUrl,
      message: `Invitation envoyee a ${email}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur d'envoi" },
      { status: 500 }
    );
  }
}
