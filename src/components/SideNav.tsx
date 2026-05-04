import { Bento, ChartFilled, Face } from "@gouvfr-lasuite/ui-kit";
import { NavLink } from "react-router";

export function SideNav() {
  return (
    <nav aria-label="Navigation principale" className="poc-sidebar">
      <p className="poc-sidebar-section">Recrutement</p>
      <NavLink
        to="/tableau-de-bord"
        className={({ isActive }) =>
          `poc-sidebar-link ${isActive ? "active" : ""}`
        }
      >
        <ChartFilled style={{ width: 18, height: 18 }} />
        Tableau de bord
      </NavLink>
      <NavLink
        to="/pipeline"
        end
        className={({ isActive }) =>
          `poc-sidebar-link ${isActive ? "active" : ""}`
        }
      >
        <Bento style={{ width: 18, height: 18 }} />
        Pipeline
      </NavLink>
      <NavLink
        to="/candidatures"
        className={({ isActive }) =>
          `poc-sidebar-link ${isActive ? "active" : ""}`
        }
      >
        <Face style={{ width: 18, height: 18 }} />
        Candidatures
      </NavLink>
    </nav>
  );
}
