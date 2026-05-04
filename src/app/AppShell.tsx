import {
  MainLayout,
  QuickSearch,
  QuickSearchGroup,
  UserAvatar,
  UserMenu,
} from "@gouvfr-lasuite/ui-kit";
import { Switch } from "@gouvfr-lasuite/cunningham-react";
import { useCallback, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { CandidateDetail } from "../components/CandidateDetail";
import { SideNav } from "../components/SideNav";
import { useCandidaturesStore } from "../store/CandidaturesProvider";
import { pageTitleFromPath } from "./pageTitle";
import { useThemeMode } from "./ThemeModeContext";

function AppLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 0,
          background: "var(--dsfr-blue-france-sun, #000091)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: "0.02em",
        }}
      >
        ATS
      </div>
      <div style={{ borderLeft: "1px solid var(--dsfr-grey-900, #ddd)", paddingLeft: 12, height: 32, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <span
          style={{
            fontWeight: 700,
            fontSize: "0.875rem",
            letterSpacing: "0",
            display: "block",
            lineHeight: 1.2,
            color: "var(--dsfr-grey-50, #161616)",
          }}
        >
          CSP Lab
        </span>
        <span
          style={{
            fontSize: "0.6875rem",
            color: "var(--dsfr-grey-425, #666)",
            marginTop: 2,
          }}
        >
          Gestion des candidatures
        </span>
      </div>
    </div>
  );
}

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { candidatures } = useCandidaturesStore();
  const { theme, toggleTheme } = useThemeMode();

  const [searchQuery, setSearchQuery] = useState("");

  const detailMatch = location.pathname.match(/^\/candidatures\/([^/]+)$/);
  const detailId = detailMatch?.[1];
  const rightOpen = Boolean(detailId);

  const title = pageTitleFromPath(location.pathname);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return candidatures
      .filter(
        (c) =>
          c.candidatNom.toLowerCase().includes(q) ||
          c.candidatEmail.toLowerCase().includes(q),
      )
      .slice(0, 5);
  }, [searchQuery, candidatures]);

  const handleSelectCandidat = useCallback(
    (c: (typeof candidatures)[0]) => {
      navigate(`/candidatures/${c.id}`);
      setSearchQuery("");
    },
    [navigate],
  );

  return (
    <MainLayout
      icon={<AppLogo />}
      leftPanelContent={<SideNav />}
      enableResize
      rightPanelIsOpen={rightOpen}
      onToggleRightPanel={() => navigate("/candidatures")}
      rightPanelContent={
        detailId ? (
          <CandidateDetail
            candidatureId={detailId}
            onClose={() => navigate("/candidatures")}
          />
        ) : null
      }
      rightHeaderContent={
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Switch
            checked={theme === "dark"}
            onChange={toggleTheme}
            label="Mode sombre"
            labelSide="left"
          />

          <QuickSearch
            placeholder="Rechercher…"
            label=""
            showInput
            inputValue={searchQuery}
            onFilter={setSearchQuery}
          >
            {searchResults.length > 0 && (
              <QuickSearchGroup
                group={{
                  groupName: "Candidats",
                  elements: searchResults,
                }}
                onSelect={handleSelectCandidat}
                renderElement={(c) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "4px 0",
                    }}
                  >
                    <UserAvatar fullName={c.candidatNom} size="small" />
                    <div>
                      <div
                        style={{
                          fontWeight: 500,
                          fontSize: "0.875rem",
                        }}
                      >
                        {c.candidatNom}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--dsfr-grey-425, #666)",
                        }}
                      >
                        {c.candidatEmail}
                      </div>
                    </div>
                  </div>
                )}
              />
            )}
          </QuickSearch>

          <UserMenu
            user={{ full_name: "Marie Dupont", email: "marie.dupont@gouv.fr" }}
            logout={() => alert("Déconnexion (démo)")}
          />
        </div>
      }
    >
      <div
        style={{
          padding: "1.5rem 1rem",
          maxWidth: 1400,
        }}
      >
        <h1
          style={{
            margin: "0 0 1.5rem",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--dsfr-grey-50, #161616)",
          }}
        >
          {title}
        </h1>
        <Outlet />
      </div>
    </MainLayout>
  );
}
