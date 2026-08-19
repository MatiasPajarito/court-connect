import type { Match, Team } from "./types";

export type Category = "varon" | "damas";

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "varon", label: "Varón TC" },
  { value: "damas", label: "Damas TC" },
];

// Este es el diccionario que Vercel estaba reclamando que faltaba
export const CATEGORY_LABELS: Record<Category, string> = {
  varon: "Varón TC",
  damas: "Damas TC",
};

export function categoryLabel(cat: Category) {
  return CATEGORY_LABELS[cat];
}

/** Categoría de un club (por defecto varones, para datos antiguos sin categoría). */
export function teamCategory(team: Pick<Team, "category"> | undefined): Category {
  return team?.category === "damas" ? "damas" : "varon";
}

/** Categoría de un partido: La propia si existe, si no la del club local. */
export function matchCategory(match: Match, teams?: Team[]): Category {
  if (match.category === "damas" || match.category === "varon") return match.category;
  if (!teams) return "varon";
  return teamCategory(teams.find((t) => t.id === match.home_team_id));
}