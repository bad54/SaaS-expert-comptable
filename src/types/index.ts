// Labels lisibles pour les enums Prisma

export const FORME_JURIDIQUE_LABELS: Record<string, string> = {
  EI: "Entreprise Individuelle",
  EIRL: "EIRL",
  EURL: "EURL",
  SARL: "SARL",
  SAS: "SAS",
  SASU: "SASU",
  SA: "SA",
  SNC: "SNC",
  SCI: "SCI",
  AUTO_ENTREPRENEUR: "Auto-entrepreneur",
  AUTRE: "Autre",
};

export const REGIME_FISCAL_LABELS: Record<string, string> = {
  MICRO_BIC: "Micro-BIC",
  MICRO_BNC: "Micro-BNC",
  REEL_SIMPLIFIE: "Reel simplifie",
  REEL_NORMAL: "Reel normal",
  IS: "Impot sur les societes",
};

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  FACTURE_ACHAT: "Facture d'achat",
  FACTURE_VENTE: "Facture de vente",
  RELEVE_BANCAIRE: "Releve bancaire",
  JUSTIFICATIF: "Justificatif",
  BULLETIN_PAIE: "Bulletin de paie",
  CONTRAT: "Contrat",
  AUTRE: "Autre",
};

export const DOCUMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  PROCESSING: "En traitement",
  VALIDATED: "Valide",
  REJECTED: "Rejete",
};

export const DOCUMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  VALIDATED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};
