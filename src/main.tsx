import "@gouvfr-lasuite/ui-kit/style";
import "@gouvfr-lasuite/ui-kit/fonts/Marianne";
import "./styles/app.css";
import { CunninghamProvider } from "@gouvfr-lasuite/ui-kit";
import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Navigate, Route, Routes, BrowserRouter } from "react-router";
import { AppShell } from "./app/AppShell";
import { ThemeModeProvider, type DsfrTheme } from "./app/ThemeModeContext";
import { CandidaturesPage } from "./pages/CandidaturesPage";
import { PipelinePage } from "./pages/PipelinePage";
import { TableauDeBordPage } from "./pages/TableauDeBordPage";
import { CandidaturesProvider } from "./store/CandidaturesProvider";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Élément #root introuvable");
}

function App() {
  const [theme, setTheme] = useState<DsfrTheme>("default");

  const contextValue = useMemo(
    () => ({
      theme,
      toggleTheme: () =>
        setTheme((prev) => {
          const next = prev === "default" ? "dark" : "default";
          document.documentElement.setAttribute("data-theme", next);
          return next;
        }),
    }),
    [],
  );

  // Apply initial theme attribute
  document.documentElement.setAttribute("data-theme", theme);

  return (
    <CunninghamProvider theme={theme} currentLocale="fr-FR">
      <ThemeModeProvider value={contextValue}>
        <CandidaturesProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppShell />}>
                <Route index element={<Navigate to="/tableau-de-bord" replace />} />
                <Route path="tableau-de-bord" element={<TableauDeBordPage />} />
                <Route path="pipeline" element={<PipelinePage />} />
                <Route path="candidatures" element={<CandidaturesPage />} />
                <Route path="candidatures/:id" element={<CandidaturesPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CandidaturesProvider>
      </ThemeModeProvider>
    </CunninghamProvider>
  );
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
