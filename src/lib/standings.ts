import type { Match, SetDetail, StandingRow, Team } from "./types";

export interface SetScoreValidation {
  valid: boolean;
  /** true once the set has a legal winner (used to know if it counts toward the total sets won) */
  decided: boolean;
  reason?: string;
}

/**
 * Valida el marcador de un set según las reglas oficiales de la FIVB y la liga:
 * - Sets normales: a 25 puntos, ganando por diferencia de 2.
 * - Set decisivo (Set 3 en regular, Set 5 en playoffs): a 15 puntos, ganando por diferencia de 2.
 * - Si se supera el puntaje objetivo, sigue exigiéndose diferencia exacta de 2 puntos
 *   (deuce indefinido, ej. 27-25 es válido, 27-24 no).
 */
export function isValidSetScore(
  home: number,
  away: number,
  isDecidingSet: boolean,
): SetScoreValidation {
  const target = isDecidingSet ? 15 : 25;
  const higher = Math.max(home, away);
  const lower = Math.min(home, away);
  const diff = higher - lower;

  if (home === 0 && away === 0) return { valid: true, decided: false };
  if (higher < target) return { valid: true, decided: false };
  if (diff < 2)
    return { valid: false, decided: false, reason: `Debe ganar por 2 puntos de diferencia` };
  if (higher > target && diff !== 2) {
    return {
      valid: false,
      decided: false,
      reason: `Pasado ${target}, la diferencia debe ser exactamente 2`,
    };
  }
  return { valid: true, decided: true };
}

/** 
 * Determina si el set en la posición `index` (0-indexed) es el set decisivo a 15 puntos.
 * - En Fase Regular (Mejor de 3): Set 3 (índice 2).
 * - En Playoffs / Finales (Mejor de 5): Set 5 (índice 4).
 */
export function isDecidingSetIndex(index: number, isBestOf5: boolean = false): boolean {
  return isBestOf5 ? index === 4 : index === 2;
}

/** 
 * Valida la planilla completa de un partido antes de guardar, adaptándose
 * automáticamente a si se juega al mejor de 3 o al mejor de 5 sets.
 */
export function validateScoreSheet(
  sets: SetDetail[],
  isBestOf5: boolean = false,
): {
  valid: boolean;
  errors: Record<number, string>;
} {
  const errors: Record<number, string> = {};
  let homeSetsWon = 0;
  let awaySetsWon = 0;
  const setsToWin = isBestOf5 ? 3 : 2;

  sets.forEach((s, i) => {
    const result = isValidSetScore(s.home, s.away, isDecidingSetIndex(i, isBestOf5));
    if (!result.valid && result.reason) {
      errors[i] = result.reason;
    } else if (result.decided) {
      if (s.home > s.away) homeSetsWon++;
      else awaySetsWon++;
      
      if (homeSetsWon > setsToWin || awaySetsWon > setsToWin) {
        errors[i] = "El partido ya estaba definido antes de este set";
      }
    }
  });

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Asigna los puntos de la tabla de posiciones según las bases oficiales:
 * - Artículo 6 (Fase Regular - Al mejor de 3): 2-0 (3 pts), 2-1 (2 pts), 1-2 (1 pt), 0-2 (0 pts).
 * - Artículo 10 (Playoffs - Al mejor de 5): 3-0/3-1 (3 pts), 3-2 (2 pts), 2-3 (1 pt), 1-3/0-3 (0 pts).
 */
export function computePointsForMatch(homeSets: number, awaySets: number) {
  // Formato Al mejor de 3 sets (Fase Regular)
  if (homeSets === 2 && awaySets === 0) return { home: 3, away: 0 };
  if (homeSets === 2 && awaySets === 1) return { home: 2, away: 1 };
  if (homeSets === 1 && awaySets === 2) return { home: 1, away: 2 };
  if (homeSets === 0 && awaySets === 2) return { home: 0, away: 3 };

  // Formato Al mejor de 5 sets (Semifinales y Finales)
  if (homeSets === 3 && (awaySets === 0 || awaySets === 1)) return { home: 3, away: 0 };
  if (awaySets === 3 && (homeSets === 0 || homeSets === 1)) return { home: 0, away: 3 };
  if (homeSets === 3 && awaySets === 2) return { home: 2, away: 1 };
  if (awaySets === 3 && homeSets === 2) return { home: 1, away: 2 };

  return { home: 0, away: 0 };
}

/**
 * Genera y ordena la tabla de posiciones de la Fase Regular aplicando
 * estrictamente los criterios de desempate del Artículo 11.
 */
export function computeStandings(teams: Team[], matches: Match[]): StandingRow[] {
  const rows = new Map<string, StandingRow>();
  for (const t of teams) {
    rows.set(t.id, {
      team_id: t.id,
      position: 0,
      pj: 0,
      pg: 0,
      pp: 0,
      pts: 0,
      sf: 0,
      sc: 0,
      ratio_sets: 0,
      pf: 0,
      pc: 0,
      ratio_points: 0,
    });
  }

  for (const m of matches) {
    if (m.status !== "finished" || m.phase !== "regular") continue;
    const home = rows.get(m.home_team_id);
    const away = rows.get(m.away_team_id);
    if (!home || !away) continue;

    const { home_sets, away_sets, set_details } = m.score;
    const pts = computePointsForMatch(home_sets, away_sets);

    home.pj++;
    away.pj++;
    home.sf += home_sets;
    home.sc += away_sets;
    away.sf += away_sets;
    away.sc += home_sets;

    for (const s of set_details) {
      home.pf += s.home;
      home.pc += s.away;
      away.pf += s.away;
      away.pc += s.home;
    }

    if (home_sets > away_sets) {
      home.pg++;
      away.pp++;
    } else {
      away.pg++;
      home.pp++;
    }
    home.pts += pts.home;
    away.pts += pts.away;
  }

  const list = Array.from(rows.values()).map((r) => ({
    ...r,
    ratio_sets: r.sc === 0 ? (r.sf > 0 ? r.sf : 0) : +(r.sf / r.sc).toFixed(3),
    ratio_points: r.pc === 0 ? (r.pf > 0 ? r.pf : 0) : +(r.pf / r.pc).toFixed(3),
  }));

  // Ordenamiento oficial según Artículo 11 de las bases:
  list.sort((a, b) => {
    // 1. Cantidad de Puntos Obtenidos
    if (b.pts !== a.pts) return b.pts - a.pts;
    // 2. Cantidad de Partidos Ganados
    if (b.pg !== a.pg) return b.pg - a.pg;
    // 3. Set Promedio (división entre sets ganados y perdidos)
    if (b.ratio_sets !== a.ratio_sets) return b.ratio_sets - a.ratio_sets;
    // 4. Punto Promedio (división entre puntos a favor y puntos en contra)
    return b.ratio_points - a.ratio_points;
  });

  list.forEach((r, i) => (r.position = i + 1));
  return list;
}