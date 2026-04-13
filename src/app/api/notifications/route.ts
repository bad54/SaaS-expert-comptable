import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDeadlineReminder, sendDocumentDepositNotification } from "@/lib/email";
import { DEADLINE_TYPE_LABELS } from "@/types";

// POST /api/notifications - Process and send pending notifications
// Called by Railway Cron Service (daily at 7h UTC)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type } = body;

  if (type === "deadline_reminders") {
    return handleDeadlineReminders();
  }

  if (type === "document_deposit") {
    return handleDocumentDeposit(body);
  }

  return NextResponse.json({ error: "Type de notification inconnu" }, { status: 400 });
}

async function handleDeadlineReminders() {
  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Find upcoming deadlines within 7 days that are not completed
  const deadlines = await prisma.deadline.findMany({
    where: {
      status: { not: "COMPLETED" },
      dueDate: {
        gte: now,
        lte: in7Days,
      },
    },
    include: {
      client: {
        include: {
          cabinet: {
            include: {
              users: {
                where: { role: { in: ["OWNER", "COLLABORATOR"] } },
                select: { email: true },
              },
            },
          },
        },
      },
    },
  });

  let sent = 0;

  for (const deadline of deadlines) {
    const daysLeft = Math.ceil(
      (new Date(deadline.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Update status to DUE_SOON
    await prisma.deadline.update({
      where: { id: deadline.id },
      data: { status: "DUE_SOON" },
    });

    // Send email to all cabinet members
    const emails = deadline.client.cabinet?.users.map((u) => u.email) ?? [];
    for (const email of emails) {
      try {
        await sendDeadlineReminder({
          to: email,
          clientName: deadline.client.name,
          deadlineTitle: deadline.title,
          deadlineType: DEADLINE_TYPE_LABELS[deadline.type] ?? deadline.type,
          dueDate: new Date(deadline.dueDate).toLocaleDateString("fr-FR"),
          daysLeft,
        });
        sent++;
      } catch {
        // Log but don't fail the whole batch
      }
    }
  }

  // Mark overdue deadlines
  await prisma.deadline.updateMany({
    where: {
      status: { not: "COMPLETED" },
      dueDate: { lt: now },
    },
    data: { status: "OVERDUE" },
  });

  return NextResponse.json({ sent, deadlinesProcessed: deadlines.length });
}

async function handleDocumentDeposit(body: { clientId: string; documentName: string; documentType: string }) {
  const { clientId, documentName, documentType } = body;

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      cabinet: {
        include: {
          users: {
            where: { role: { in: ["OWNER", "COLLABORATOR"] } },
            select: { email: true },
          },
        },
      },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
  }

  let sent = 0;
  const emails = client.cabinet?.users.map((u) => u.email) ?? [];

  for (const email of emails) {
    try {
      await sendDocumentDepositNotification({
        to: email,
        clientName: client.name,
        documentName,
        documentType,
      });
      sent++;
    } catch {
      // Log but don't fail
    }
  }

  return NextResponse.json({ sent });
}
