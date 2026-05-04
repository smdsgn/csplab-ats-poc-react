import type { EtapeId } from "../types/domain";

/** Mapping naïf étape → variante `Badge` du kit */
export function badgeVariantForEtape(
  etape: EtapeId,
): "accent" | "neutral" | "danger" | "success" | "warning" | "info" {
  switch (etape) {
    case "refus":
      return "danger";
    case "embauche":
      return "success";
    case "offre":
      return "accent";
    case "entretien":
      return "info";
    case "preselection":
      return "warning";
    default:
      return "neutral";
  }
}
