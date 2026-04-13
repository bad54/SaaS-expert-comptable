import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/export/fec?clientId=xxx&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
// Generates a FEC (Fichier des Ecritures Comptables) export
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!clientId) {
    return NextResponse.json({ error: "clientId requis" }, { status: 400 });
  }

  // Fetch validated documents with OCR data
  const documents = await prisma.document.findMany({
    where: {
      clientId,
      status: "VALIDATED",
      ...(startDate && endDate && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate + "T23:59:59"),
        },
      }),
    },
    orderBy: { createdAt: "asc" },
    include: {
      client: { select: { name: true, siren: true } },
    },
  });

  // FEC header (norme DGFiP)
  const header = [
    "JournalCode",
    "JournalLib",
    "EcritureNum",
    "EcritureDate",
    "CompteNum",
    "CompteLib",
    "CompAuxNum",
    "CompAuxLib",
    "PieceRef",
    "PieceDate",
    "EcritureLib",
    "Debit",
    "Credit",
    "EcrtureLet",
    "DateLet",
    "ValidDate",
    "Montantdevise",
    "Idevise",
  ].join("\t");

  const lines = [header];
  let ecritureNum = 1;

  for (const doc of documents) {
    const ocrData = doc.ocrData as Record<string, unknown> | null;
    const extractedData = (ocrData?.extractedData ?? {}) as Record<string, string | null>;
    const suggestedEntry = (ocrData?.suggestedEntry ?? {}) as Record<string, string>;

    const date = extractedData.date
      ? formatFecDate(extractedData.date)
      : formatFecDate(doc.createdAt.toISOString().split("T")[0]);
    const amount = extractedData.amount ?? "0.00";
    const journal = suggestedEntry.journal ?? "OD";
    const journalLib = getJournalLib(journal);
    const account = suggestedEntry.account ?? "471000";
    const label = suggestedEntry.label ?? doc.name;
    const pieceRef = extractedData.invoiceNumber ?? doc.id.substring(0, 10);

    // Debit line
    lines.push(
      [
        journal,
        journalLib,
        String(ecritureNum).padStart(6, "0"),
        date,
        account,
        label,
        "",
        "",
        pieceRef,
        date,
        doc.name,
        amount,
        "0.00",
        "",
        "",
        date,
        "",
        "EUR",
      ].join("\t")
    );

    // Credit counterpart
    const counterAccount = getCounterAccount(journal);
    lines.push(
      [
        journal,
        journalLib,
        String(ecritureNum).padStart(6, "0"),
        date,
        counterAccount,
        "Contrepartie",
        "",
        "",
        pieceRef,
        date,
        doc.name,
        "0.00",
        amount,
        "",
        "",
        date,
        "",
        "EUR",
      ].join("\t")
    );

    ecritureNum++;
  }

  const fecContent = lines.join("\n");

  return new NextResponse(fecContent, {
    headers: {
      "Content-Type": "text/tab-separated-values; charset=utf-8",
      "Content-Disposition": `attachment; filename="FEC_${clientId}_${new Date().toISOString().split("T")[0]}.txt"`,
    },
  });
}

function formatFecDate(dateStr: string): string {
  // Convert various date formats to YYYYMMDD
  const parts = dateStr.match(/(\d{1,4})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/);
  if (!parts) return new Date().toISOString().split("T")[0].replace(/-/g, "");

  let [, a, b, c] = parts;
  // If first part is 4 digits: YYYY-MM-DD
  if (a.length === 4) return `${a}${b.padStart(2, "0")}${c.padStart(2, "0")}`;
  // Otherwise DD/MM/YYYY
  if (c.length === 2) c = `20${c}`;
  return `${c}${b.padStart(2, "0")}${a.padStart(2, "0")}`;
}

function getJournalLib(code: string): string {
  const map: Record<string, string> = {
    AC: "Achats",
    VE: "Ventes",
    BQ: "Banque",
    OD: "Operations diverses",
    AN: "A nouveau",
  };
  return map[code] ?? "Journal";
}

function getCounterAccount(journal: string): string {
  const map: Record<string, string> = {
    AC: "607000",
    VE: "707000",
    BQ: "580000",
    OD: "471000",
  };
  return map[journal] ?? "471000";
}
