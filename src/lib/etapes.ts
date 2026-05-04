import { ETAPES_ORDER, type EtapeId } from "../types/domain";

export function etapeSuivante(etape: EtapeId): EtapeId {
  const i = ETAPES_ORDER.indexOf(etape);
  if (i === -1 || i >= ETAPES_ORDER.length - 1) return etape;
  return ETAPES_ORDER[i + 1]!;
}

export function etapePrecedente(etape: EtapeId): EtapeId {
  const i = ETAPES_ORDER.indexOf(etape);
  if (i <= 0) return etape;
  return ETAPES_ORDER[i - 1]!;
}
