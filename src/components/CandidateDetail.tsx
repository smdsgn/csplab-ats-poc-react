import { Button, Tooltip } from "@gouvfr-lasuite/cunningham-react";
import {
  Badge,
  CustomTabs,
  Mail,
  UserAvatar,
} from "@gouvfr-lasuite/ui-kit";
import { badgeVariantForEtape } from "../lib/badgeEtape";
import { useCandidaturesStore } from "../store/CandidaturesProvider";
import { ETAPE_LABEL } from "../types/domain";

type Props = {
  candidatureId: string;
  onClose: () => void;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="poc-detail-field">
      <label>{label}</label>
      <p>{children}</p>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const type = score >= 80 ? "success" : score >= 60 ? "warning" : "neutral";
  return (
    <Tooltip content={`Score de matching basé sur le profil`} placement="bottom">
      <Badge type={type}>{score} / 100</Badge>
    </Tooltip>
  );
}

export function CandidateDetail({ candidatureId, onClose }: Props) {
  const { candidatures, avancer, reculer } = useCandidaturesStore();
  const c = candidatures.find((x) => x.id === candidatureId);

  if (!c) {
    return (
      <div style={{ padding: "1rem" }}>
        <p>Candidature introuvable.</p>
        <Button onClick={onClose}>Fermer</Button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <div className="poc-detail-header">
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <UserAvatar fullName={c.candidatNom} size="large" />
          <div>
            <h2 className="poc-detail-title">{c.candidatNom}</h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 4,
              }}
            >
              <Badge type={badgeVariantForEtape(c.etape)}>
                {ETAPE_LABEL[c.etape]}
              </Badge>
              {c.score != null && <ScoreBadge score={c.score} />}
            </div>
          </div>
        </div>
        <Button size="small" color="neutral" onClick={onClose}>
          Fermer
        </Button>
      </div>

      <div className="poc-detail-body">
        <CustomTabs
          defaultSelectedTab="profil"
          tabs={[
            {
              id: "profil",
              label: "Profil",
              content: (
                <div style={{ paddingTop: "1rem" }}>
                  <Field label="E-mail">
                    <a
                      href={`mailto:${c.candidatEmail}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        color: "var(--dsfr-blue-france-sun, #000091)",
                        textDecoration: "none",
                      }}
                    >
                      <Mail style={{ width: 16, height: 16 }} />
                      {c.candidatEmail}
                    </a>
                  </Field>
                  <Field label="Offre">{c.offreTitre}</Field>
                  <Field label="Résumé">{c.resume}</Field>
                </div>
              ),
            },
            {
              id: "activite",
              label: "Activité",
              content: (
                <div
                  style={{
                    paddingTop: "1rem",
                    fontSize: "0.875rem",
                    lineHeight: 1.7,
                  }}
                >
                  <p style={{ margin: "0 0 0.5rem" }}>
                    <strong>Candidature reçue</strong> — données statiques POC
                  </p>
                  <p style={{ margin: "0 0 0.5rem" }}>
                    <strong>Dernière étape</strong> — {ETAPE_LABEL[c.etape]}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--dsfr-grey-425, #666)",
                    }}
                  >
                    Historique temps réel non branché (hors scope POC).
                  </p>
                </div>
              ),
            },
          ]}
        />

        <div
          style={{
            marginTop: "2rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--dsfr-grey-925, #e5e5e5)",
            display: "flex",
            gap: "0.5rem",
          }}
        >
          <Button size="small" color="neutral" onClick={() => reculer(c.id)}>
            ← Étape précédente
          </Button>
          <Button size="small" onClick={() => avancer(c.id)}>
            Étape suivante →
          </Button>
        </div>
      </div>
    </div>
  );
}
