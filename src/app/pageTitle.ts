export function pageTitleFromPath(pathname: string): string {
  if (pathname.startsWith("/tableau-de-bord")) return "Tableau de bord";
  if (pathname.startsWith("/pipeline")) return "Pipeline";
  if (pathname.startsWith("/candidatures")) return "Candidatures";
  return "ATS";
}
