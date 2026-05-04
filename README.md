# csplab-ats-poc-react

POC React (Vite + TypeScript) pour évaluer **@gouvfr-lasuite/ui-kit** sur un parcours ATS minimal.

## Écrans

| Route            | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `/pipeline`      | Vue Kanban (colonnes HTML maison, pas de composant natif)|
| `/candidatures`  | Table DataGrid Cunningham + filtre local                 |
| `/candidatures/:id` | Fiche candidat (panneau droit `MainLayout`)           |
| `/comparatif`    | Synthèse Vue+RekaUI+DSFR vs React+ui-kit                |

## Démarrage

```bash
npm install
npm run dev
```

L'app écoute par défaut sur [http://localhost:5173](http://localhost:5173).

## Objectif

Comparer de manière honnête les deux approches :

1. **Vue 3 + Reka UI + tokens DSFR** — assemblage manuel, conformité DSFR native
2. **React 19 + @gouvfr-lasuite/ui-kit** — composants prêts, mutualisation Suite numérique

Les limites assumées du kit sont listées en bas des écrans et dans [`src/kitLimits.ts`](src/kitLimits.ts).

## Stack

- React 19, Vite 6, TypeScript strict
- `@gouvfr-lasuite/ui-kit` 0.20.2 (thème `dsfr-light`, police Marianne)
- `@gouvfr-lasuite/cunningham-react` (Button, DataGrid, Input…)
- react-router 7

## Structure

```
src/
├── app/            # Shell, router, pageTitle
├── components/     # SideNav, CandidateDetail, KitLimitsNote
├── data/           # Données statiques démo
├── lib/            # Helpers (étapes, badge variants)
├── pages/          # Pipeline, Candidatures, Comparatif
├── store/          # Context candidatures
├── styles/         # CSS global POC
└── types/          # domain.ts
```
