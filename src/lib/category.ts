import type { Match, Team } from "./types";

export type Category = "varon" | "damas";

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "varon", label: "Varón TC" },
  { value: "damas", label: "Damas TC" },
];

export function categoryLabel(cat: Category) {
  return cat === "damas" ? "Damas TC" : "Varón TC";
}
 
/** Categoría de un club (por defecto varones, para datos antiguos sin categoría). */
export function teamCategory(team: Pick<Team, "category"> | undefined): Category {
  return team?.category === "damas" ? "damas" : "varon";
}

/** Categoría de un partido: la propia si existe, si no la del club local. */
export function matchCategory(match: Match, teams: Team[]): Category {
  if (match.category === "damas" || match.category === "varon") return match.category;
  return teamCategory(teams.find((t) => t.id === match.home_team_id));
}
