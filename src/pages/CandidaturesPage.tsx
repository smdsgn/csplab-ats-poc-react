import {
  Button,
  DataGrid,
  Input,
  Tooltip,
} from "@gouvfr-lasuite/cunningham-react";
import { Badge, UserAvatar } from "@gouvfr-lasuite/ui-kit";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { badgeVariantForEtape } from "../lib/badgeEtape";
import { useCandidaturesStore } from "../store/CandidaturesProvider";
import { ETAPE_LABEL, type Candidature } from "../types/domain";

function ScoreCell({ score }: { score?: number }) {
  if (score == null) {
    return (
      <span style={{ color: "var(--dsfr-grey-625, #929292)" }}>—</span>
    );
  }
  const type = score >= 80 ? "success" : score >= 60 ? "warning" : "neutral";
  return (
    <Tooltip content={`Score de matching : ${score}/100`} placement="top">
      <Badge type={type}>{score}</Badge>
    </Tooltip>
  );
}

function CandidatCell({ row }: { row: Candidature }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <UserAvatar fullName={row.candidatNom} size="small" />
      <div>
        <div
          style={{
            fontWeight: 500,
            fontSize: "0.875rem",
          }}
        >
          {row.candidatNom}
        </div>
        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--dsfr-grey-425, #666)",
          }}
        >
          {row.candidatEmail}
        </div>
      </div>
    </div>
  );
}

export function CandidaturesPage() {
  const navigate = useNavigate();
  const { candidatures } = useCandidaturesStore();
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return candidatures;
    return candidatures.filter((c) => {
      return (
        c.candidatNom.toLowerCase().includes(q) ||
        c.candidatEmail.toLowerCase().includes(q) ||
        c.offreTitre.toLowerCase().includes(q) ||
        ETAPE_LABEL[c.etape].toLowerCase().includes(q)
      );
    });
  }, [candidatures, query]);

  return (
    <div>
      <div className="poc-table-toolbar">
        <div className="poc-table-search">
          <Input
            label="Rechercher"
            placeholder="Nom, e-mail, offre, étape…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <span className="poc-table-stats">
          {rows.length} candidature{rows.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="poc-table-wrapper">
        <DataGrid<Candidature>
          rows={rows}
          enableSorting
          columns={[
            {
              id: "candidat",
              field: "candidatNom",
              headerName: "Candidat",
              size: 280,
              renderCell: ({ row }) => <CandidatCell row={row} />,
            },
            { field: "offreTitre", headerName: "Offre", size: 220 },
            {
              id: "etape",
              field: "etape",
              headerName: "Étape",
              size: 130,
              renderCell: ({ row }) => (
                <Badge type={badgeVariantForEtape(row.etape)}>
                  {ETAPE_LABEL[row.etape]}
                </Badge>
              ),
            },
            {
              id: "score",
              field: "score",
              headerName: "Score",
              size: 80,
              renderCell: ({ row }) => <ScoreCell score={row.score} />,
            },
            {
              id: "actions",
              headerName: "",
              size: 100,
              renderCell: ({ row }) => (
                <Button
                  size="small"
                  onClick={() => navigate(`/candidatures/${row.id}`)}
                >
                  Voir
                </Button>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
