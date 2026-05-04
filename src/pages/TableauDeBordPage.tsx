import { Badge, UserAvatar } from "@gouvfr-lasuite/ui-kit";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { badgeVariantForEtape } from "../lib/badgeEtape";
import { useCandidaturesStore } from "../store/CandidaturesProvider";
import { ETAPE_LABEL, ETAPES_ORDER } from "../types/domain";

function percent(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}

export function TableauDeBordPage() {
  const navigate = useNavigate();
  const { candidatures } = useCandidaturesStore();

  const stats = useMemo(() => {
    const total = candidatures.length;
    const embauchees = candidatures.filter((c) => c.etape === "embauche").length;
    const refusees = candidatures.filter((c) => c.etape === "refus").length;
    const avecScore = candidatures.filter((c) => c.score != null);
    const scoreMoyen = avecScore.length
      ? Math.round(
          avecScore.reduce((acc, c) => acc + (c.score ?? 0), 0) / avecScore.length,
        )
      : null;

    return {
      total,
      embauchees,
      refusees,
      tauxEmbauche: percent(embauchees, total),
      scoreMoyen,
    };
  }, [candidatures]);

  const repartition = useMemo(() => {
    return ETAPES_ORDER.map((etape) => {
      const count = candidatures.filter((c) => c.etape === etape).length;
      return {
        etape,
        label: ETAPE_LABEL[etape],
        count,
        pct: percent(count, candidatures.length),
      };
    });
  }, [candidatures]);

  const recents = useMemo(() => candidatures.slice(0, 5), [candidatures]);

  return (
    <div className="poc-dashboard">
      <section className="poc-dashboard-kpis">
        <article className="poc-dashboard-kpi-card">
          <p className="poc-dashboard-kpi-label">Candidatures</p>
          <p className="poc-dashboard-kpi-value">{stats.total}</p>
        </article>
        <article className="poc-dashboard-kpi-card">
          <p className="poc-dashboard-kpi-label">Taux d'embauche</p>
          <p className="poc-dashboard-kpi-value">{stats.tauxEmbauche}%</p>
        </article>
        <article className="poc-dashboard-kpi-card">
          <p className="poc-dashboard-kpi-label">Refus</p>
          <p className="poc-dashboard-kpi-value">{stats.refusees}</p>
        </article>
        <article className="poc-dashboard-kpi-card">
          <p className="poc-dashboard-kpi-label">Score moyen</p>
          <p className="poc-dashboard-kpi-value">
            {stats.scoreMoyen == null ? "—" : `${stats.scoreMoyen}/100`}
          </p>
        </article>
      </section>

      <section className="poc-dashboard-grid">
        <article className="poc-dashboard-panel">
          <h2 className="poc-dashboard-panel-title">Répartition du pipeline</h2>
          <div className="poc-dashboard-stages">
            {repartition.map((item) => (
              <div key={item.etape} className="poc-dashboard-stage-row">
                <div className="poc-dashboard-stage-head">
                  <Badge type={badgeVariantForEtape(item.etape)}>{item.label}</Badge>
                  <span className="poc-dashboard-stage-count">
                    {item.count} ({item.pct}%)
                  </span>
                </div>
                <div className="poc-dashboard-stage-track" aria-hidden>
                  <span
                    className="poc-dashboard-stage-fill"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="poc-dashboard-panel">
          <h2 className="poc-dashboard-panel-title">Dernières candidatures</h2>
          <div className="poc-dashboard-recents">
            {recents.map((c) => (
              <button
                key={c.id}
                type="button"
                className="poc-dashboard-recent-item"
                onClick={() => navigate(`/candidatures/${c.id}`)}
              >
                <UserAvatar fullName={c.candidatNom} size="small" />
                <div className="poc-dashboard-recent-main">
                  <span className="poc-dashboard-recent-name">{c.candidatNom}</span>
                  <span className="poc-dashboard-recent-sub">{c.offreTitre}</span>
                </div>
                <Badge type={badgeVariantForEtape(c.etape)}>{ETAPE_LABEL[c.etape]}</Badge>
              </button>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
