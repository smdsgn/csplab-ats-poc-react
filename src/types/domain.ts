export type EtapeId =
  | "nouveau"
  | "preselection"
  | "entretien"
  | "offre"
  | "embauche"
  | "refus";

export type Candidature = {
  id: string;
  candidatNom: string;
  candidatEmail: string;
  offreTitre: string;
  etape: EtapeId;
  /** 0–100, optionnel (démo) */
  score?: number;
  resume: string;
};

export const ETAPES_ORDER: EtapeId[] = [
  "nouveau",
  "preselection",
  "entretien",
  "offre",
  "embauche",
  "refus",
];

export const ETAPE_LABEL: Record<EtapeId, string> = {
  nouveau: "Nouveau",
  preselection: "Présélection",
  entretien: "Entretien",
  offre: "Offre",
  embauche: "Embauche",
  refus: "Refus",
};
