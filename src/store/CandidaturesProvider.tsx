import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { initialCandidatures } from "../data/initialCandidatures";
import { etapePrecedente, etapeSuivante } from "../lib/etapes";
import type { Candidature, EtapeId } from "../types/domain";

type Ctx = {
  candidatures: Candidature[];
  setEtape: (id: string, etape: EtapeId) => void;
  avancer: (id: string) => void;
  reculer: (id: string) => void;
};

const CandidaturesContext = createContext<Ctx | null>(null);

export function CandidaturesProvider({ children }: { children: ReactNode }) {
  const [candidatures, setCandidatures] = useState<Candidature[]>(
    () => initialCandidatures,
  );

  const setEtape = useCallback((id: string, etape: EtapeId) => {
    setCandidatures((prev) =>
      prev.map((c) => (c.id === id ? { ...c, etape } : c)),
    );
  }, []);

  const avancer = useCallback((id: string) => {
    setCandidatures((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, etape: etapeSuivante(c.etape) } : c,
      ),
    );
  }, []);

  const reculer = useCallback((id: string) => {
    setCandidatures((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, etape: etapePrecedente(c.etape) } : c,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({ candidatures, setEtape, avancer, reculer }),
    [candidatures, setEtape, avancer, reculer],
  );

  return (
    <CandidaturesContext.Provider value={value}>
      {children}
    </CandidaturesContext.Provider>
  );
}

export function useCandidaturesStore(): Ctx {
  const v = useContext(CandidaturesContext);
  if (!v) {
    throw new Error("useCandidaturesStore doit être sous CandidaturesProvider");
  }
  return v;
}
