import {
  DndContext,
  type DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import {
  Badge,
  DropdownMenu,
  MoreCircle,
  UserAvatar,
} from "@gouvfr-lasuite/ui-kit";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { badgeVariantForEtape } from "../lib/badgeEtape";
import { useCandidaturesStore } from "../store/CandidaturesProvider";
import {
  ETAPE_LABEL,
  ETAPES_ORDER,
  type Candidature,
  type EtapeId,
} from "../types/domain";

function ScoreBadge({ score }: { score?: number }) {
  if (score == null) return null;
  const type = score >= 80 ? "success" : score >= 60 ? "warning" : "neutral";
  return <Badge type={type}>{score} pts</Badge>;
}

function CandidateCard({
  candidature,
  onView,
}: {
  candidature: Candidature;
  onView: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: candidature.id,
    data: { type: "candidature", candidatureId: candidature.id },
  });

  const menuOptions = [
    { label: "Voir la fiche", callback: onView },
    { type: "separator" as const },
    {
      label: "Archiver",
      variant: "danger" as const,
      callback: () => alert("Archiver (démo)"),
    },
  ];

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <article
      ref={setNodeRef}
      className="poc-kanban-card"
      style={{
        ...style,
        opacity: isDragging ? 0.6 : 1,
      }}
    >
      <div className="poc-kanban-card-header">
        <button
          type="button"
          {...listeners}
          {...attributes}
          aria-label={`Déplacer ${candidature.candidatNom}`}
          style={{
            all: "unset",
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "grab",
          }}
        >
          <UserAvatar fullName={candidature.candidatNom} size="small" />
          <span className="poc-kanban-card-name">{candidature.candidatNom}</span>
        </button>
        <DropdownMenu
          options={menuOptions}
          isOpen={menuOpen}
          onOpenChange={setMenuOpen}
        >
          <button
            type="button"
            aria-label="Actions"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              borderRadius: 4,
              display: "flex",
              color: "var(--c--contextuals--content--secondary--default)",
            }}
          >
            <MoreCircle style={{ width: 20, height: 20 }} />
          </button>
        </DropdownMenu>
      </div>

      <p className="poc-kanban-card-meta">{candidature.offreTitre}</p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: "var(--c--globals--spacings--sm)",
        }}
      >
        <Badge type={badgeVariantForEtape(candidature.etape)}>
          {ETAPE_LABEL[candidature.etape]}
        </Badge>
        <ScoreBadge score={candidature.score} />
      </div>
    </article>
  );
}

function KanbanColumn({
  etape,
  cards,
  onView,
}: {
  etape: EtapeId;
  cards: Candidature[];
  onView: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: etape,
    data: { type: "etape", etape },
  });

  return (
    <section
      aria-labelledby={`col-${etape}`}
      className="poc-kanban-column"
      style={{
        outline: isOver ? "2px solid var(--c--globals--colors--brand-500)" : "none",
        outlineOffset: isOver ? "-2px" : "0",
      }}
    >
      <div className="poc-kanban-column-header">
        <h2 id={`col-${etape}`} className="poc-kanban-column-title">
          {ETAPE_LABEL[etape]}
        </h2>
        <Badge type="neutral">{cards.length}</Badge>
      </div>
      <div ref={setNodeRef} className="poc-kanban-cards">
        {cards.map((c) => (
          <CandidateCard
            key={c.id}
            candidature={c}
            onView={() => onView(c.id)}
          />
        ))}
      </div>
    </section>
  );
}

export function PipelinePage() {
  const navigate = useNavigate();
  const { candidatures, setEtape } = useCandidaturesStore();

  const parEtape = useMemo(() => {
    const map = new Map<EtapeId, Candidature[]>();
    for (const e of ETAPES_ORDER) map.set(e, []);
    for (const c of candidatures) {
      map.get(c.etape)?.push(c);
    }
    return map;
  }, [candidatures]);

  const handleDragEnd = (event: DragEndEvent) => {
    const candidatureId = String(event.active.id);
    const targetEtape = event.over?.id as EtapeId | undefined;
    if (!targetEtape) return;
    setEtape(candidatureId, targetEtape);
  };

  return (
    <div>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="poc-kanban">
          {ETAPES_ORDER.map((etape) => (
            <KanbanColumn
              key={etape}
              etape={etape}
              cards={parEtape.get(etape) ?? []}
              onView={(id) => navigate(`/candidatures/${id}`)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
