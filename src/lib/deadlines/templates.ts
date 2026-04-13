// Templates d'echeances fiscales et sociales par regime fiscal
// Ces templates generent automatiquement les echeances recurrentes

interface DeadlineTemplate {
  title: string;
  type: string;
  description: string;
  // month: 1-12, day: jour du mois
  occurrences: { month: number; day: number }[];
}

type RegimeTemplates = Record<string, DeadlineTemplate[]>;

// Echeances communes a tous les regimes
const COMMON: DeadlineTemplate[] = [
  {
    title: "CFE - Cotisation Fonciere des Entreprises",
    type: "CFE",
    description: "Paiement de la CFE",
    occurrences: [{ month: 12, day: 15 }],
  },
];

// Templates par regime fiscal
export const DEADLINE_TEMPLATES: RegimeTemplates = {
  MICRO_BIC: [
    ...COMMON,
    {
      title: "Declaration de chiffre d'affaires (mensuelle)",
      type: "TVA",
      description: "Declaration CA micro-BIC au regime micro-fiscal",
      occurrences: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, day: 28 })),
    },
    {
      title: "Declaration des revenus (BIC)",
      type: "DECLARATION_REVENU",
      description: "Declaration annuelle des revenus BIC (formulaire 2042-C-PRO)",
      occurrences: [{ month: 5, day: 31 }],
    },
  ],
  MICRO_BNC: [
    ...COMMON,
    {
      title: "Declaration de recettes (mensuelle)",
      type: "TVA",
      description: "Declaration recettes micro-BNC au regime micro-fiscal",
      occurrences: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, day: 28 })),
    },
    {
      title: "Declaration des revenus (BNC)",
      type: "DECLARATION_REVENU",
      description: "Declaration annuelle 2042-C-PRO",
      occurrences: [{ month: 5, day: 31 }],
    },
  ],
  REEL_SIMPLIFIE: [
    ...COMMON,
    {
      title: "TVA - Acompte semestriel (juillet)",
      type: "TVA",
      description: "Acompte TVA regime simplifie - 1er semestre",
      occurrences: [{ month: 7, day: 15 }],
    },
    {
      title: "TVA - Acompte semestriel (decembre)",
      type: "TVA",
      description: "Acompte TVA regime simplifie - 2eme semestre",
      occurrences: [{ month: 12, day: 15 }],
    },
    {
      title: "TVA - Declaration annuelle CA12",
      type: "TVA",
      description: "Declaration annuelle de regularisation TVA (CA12)",
      occurrences: [{ month: 5, day: 3 }],
    },
    {
      title: "Liasse fiscale",
      type: "LIASSE_FISCALE",
      description: "Depot de la liasse fiscale (bilan, compte de resultat)",
      occurrences: [{ month: 5, day: 3 }],
    },
    {
      title: "Declaration des revenus",
      type: "DECLARATION_REVENU",
      description: "Declaration annuelle des revenus",
      occurrences: [{ month: 5, day: 31 }],
    },
    {
      title: "CVAE - Declaration",
      type: "CVAE",
      description: "Declaration de la CVAE (si CA > 500K EUR)",
      occurrences: [{ month: 5, day: 3 }],
    },
  ],
  REEL_NORMAL: [
    ...COMMON,
    {
      title: "TVA - Declaration mensuelle CA3 (janvier)",
      type: "TVA",
      description: "Declaration TVA mensuelle",
      occurrences: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, day: 19 })),
    },
    {
      title: "Liasse fiscale",
      type: "LIASSE_FISCALE",
      description: "Depot de la liasse fiscale (bilan, compte de resultat, annexes)",
      occurrences: [{ month: 5, day: 3 }],
    },
    {
      title: "Declaration des revenus",
      type: "DECLARATION_REVENU",
      description: "Declaration annuelle des revenus",
      occurrences: [{ month: 5, day: 31 }],
    },
    {
      title: "CVAE - Declaration",
      type: "CVAE",
      description: "Declaration de la CVAE",
      occurrences: [{ month: 5, day: 3 }],
    },
    {
      title: "CVAE - Acomptes",
      type: "CVAE",
      description: "Acomptes CVAE (si CA > 500K EUR)",
      occurrences: [{ month: 6, day: 15 }, { month: 9, day: 15 }],
    },
  ],
  IS: [
    ...COMMON,
    {
      title: "TVA - Declaration mensuelle CA3",
      type: "TVA",
      description: "Declaration TVA mensuelle",
      occurrences: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, day: 19 })),
    },
    {
      title: "IS - 1er acompte",
      type: "IS",
      description: "Premier acompte d'impot sur les societes",
      occurrences: [{ month: 3, day: 15 }],
    },
    {
      title: "IS - 2eme acompte",
      type: "IS",
      description: "Deuxieme acompte IS",
      occurrences: [{ month: 6, day: 15 }],
    },
    {
      title: "IS - 3eme acompte",
      type: "IS",
      description: "Troisieme acompte IS",
      occurrences: [{ month: 9, day: 15 }],
    },
    {
      title: "IS - 4eme acompte",
      type: "IS",
      description: "Quatrieme acompte IS",
      occurrences: [{ month: 12, day: 15 }],
    },
    {
      title: "IS - Solde + Liasse fiscale",
      type: "LIASSE_FISCALE",
      description: "Solde IS + depot liasse fiscale",
      occurrences: [{ month: 5, day: 15 }],
    },
    {
      title: "Charges sociales - Trimestriel T1",
      type: "CHARGES_SOCIALES",
      description: "Paiement charges sociales (URSSAF) T1",
      occurrences: [{ month: 4, day: 15 }],
    },
    {
      title: "Charges sociales - Trimestriel T2",
      type: "CHARGES_SOCIALES",
      description: "Paiement charges sociales (URSSAF) T2",
      occurrences: [{ month: 7, day: 15 }],
    },
    {
      title: "Charges sociales - Trimestriel T3",
      type: "CHARGES_SOCIALES",
      description: "Paiement charges sociales (URSSAF) T3",
      occurrences: [{ month: 10, day: 15 }],
    },
    {
      title: "Charges sociales - Trimestriel T4",
      type: "CHARGES_SOCIALES",
      description: "Paiement charges sociales (URSSAF) T4",
      occurrences: [{ month: 1, day: 15 }],
    },
  ],
};

// Generate deadlines for a given regime and year
export function generateDeadlinesForRegime(
  regime: string,
  year: number
): { title: string; type: string; description: string; dueDate: Date }[] {
  const templates = DEADLINE_TEMPLATES[regime];
  if (!templates) return [];

  const deadlines: { title: string; type: string; description: string; dueDate: Date }[] = [];

  for (const template of templates) {
    for (const occ of template.occurrences) {
      const dueDate = new Date(year, occ.month - 1, occ.day);
      deadlines.push({
        title: template.title,
        type: template.type,
        description: template.description,
        dueDate,
      });
    }
  }

  // Sort by date
  deadlines.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  return deadlines;
}
