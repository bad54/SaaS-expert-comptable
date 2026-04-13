// OCR extraction helpers
// Uses Tesseract.js for MVP, can be swapped for Mindee/Veryfi later

export interface OcrResult {
  rawText: string;
  extractedData: {
    date: string | null;
    amount: string | null;
    vendor: string | null;
    invoiceNumber: string | null;
    vatAmount: string | null;
  };
  confidence: number;
}

// Extract structured data from raw OCR text
export function extractInvoiceData(text: string): OcrResult["extractedData"] {
  // Date patterns: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
  const dateMatch = text.match(
    /(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/
  );
  const date = dateMatch ? dateMatch[0] : null;

  // Amount patterns: look for "Total", "Montant", "TTC" followed by number
  const amountMatch = text.match(
    /(?:total|montant|ttc|net\s+[aà]\s+payer)[^\d]*(\d[\d\s]*[.,]\d{2})/i
  );
  const amount = amountMatch
    ? amountMatch[1].replace(/\s/g, "").replace(",", ".")
    : null;

  // VAT amount
  const vatMatch = text.match(
    /(?:tva|t\.v\.a)[^\d]*(\d[\d\s]*[.,]\d{2})/i
  );
  const vatAmount = vatMatch
    ? vatMatch[1].replace(/\s/g, "").replace(",", ".")
    : null;

  // Invoice number patterns
  const invoiceMatch = text.match(
    /(?:facture|fact|invoice|n[°o])[^\w]*([A-Z0-9][\w\-\/]{2,20})/i
  );
  const invoiceNumber = invoiceMatch ? invoiceMatch[1] : null;

  // Vendor: usually one of the first lines
  const lines = text.split("\n").filter((l) => l.trim().length > 2);
  const vendor = lines.length > 0 ? lines[0].trim().substring(0, 100) : null;

  return { date, amount, vendor, invoiceNumber, vatAmount };
}

// Suggest accounting entry based on extracted data
export function suggestAccountingEntry(data: OcrResult["extractedData"], docType: string) {
  const entries: { account: string; label: string; journal: string } = {
    account: "401000",
    label: "Fournisseur",
    journal: "AC",
  };

  switch (docType) {
    case "FACTURE_ACHAT":
      entries.account = "401000";
      entries.label = data.vendor ? `Achat ${data.vendor}` : "Achat fournisseur";
      entries.journal = "AC";
      break;
    case "FACTURE_VENTE":
      entries.account = "411000";
      entries.label = "Vente client";
      entries.journal = "VE";
      break;
    case "RELEVE_BANCAIRE":
      entries.account = "512000";
      entries.label = "Banque";
      entries.journal = "BQ";
      break;
    case "BULLETIN_PAIE":
      entries.account = "421000";
      entries.label = "Salaires";
      entries.journal = "OD";
      break;
    default:
      entries.account = "471000";
      entries.label = "Compte d'attente";
      entries.journal = "OD";
  }

  return entries;
}
