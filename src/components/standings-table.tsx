import { TeamLogo } from "@/components/team-logo";
import type { StandingRow, Team } from "@/lib/types";

interface Props {
  rows: StandingRow[];
  teams: Team[];
}

export function StandingsTable({ rows, teams }: Props) {
  const teamMap = new Map(teams.map((t) => [t.id, t]));
  return (
    <>
      {/* Móvil: lista apilada, sin scroll horizontal ni zoom necesario */}
      <div className="divide-y rounded-lg border bg-card sm:hidden">
        {rows.map((r) => {
          const team = teamMap.get(r.team_id);
          if (!team) return null;
          const diff = r.pf - r.pc;
          return (
            <div key={r.team_id} className="flex items-center gap-3 p-3">
              <div className="w-5 shrink-0 text-center font-bold tabular-nums text-muted-foreground">
                {r.position}
              </div>
              <TeamLogo team={team} size={32} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">
                  {team.name}
                </div>
                <div className="flex flex-wrap gap-x-2 text-[11px] text-muted-foreground">
                  <span>PJ {r.pj}</span>
                  <span>PG {r.pg}</span>
                  <span>PP {r.pp}</span>
                  <span>Ratio {r.ratio_sets.toFixed(2)}</span>
                  <span
                    className={
                      diff > 0
                        ? "text-primary"
                        : diff < 0
                          ? "text-destructive"
                          : ""
                    }
                  >
                    Dif {diff > 0 ? `+${diff}` : diff}
                  </span>
                </div>
              </div>
              <div className="shrink-0 rounded bg-primary px-2 py-1 text-center font-black tabular-nums text-primary-foreground">
                {r.pts}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tablet / desktop: tabla completa */}
      <div className="hidden overflow-x-auto rounded-lg border bg-card sm:block">
        <table className="w-full min-w-[780px] text-sm">
          <thead className="bg-secondary text-secondary-foreground">
            <tr className="text-xs uppercase tracking-wide">
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Equipo</th>
              <th className="px-2 py-2 text-center font-bold text-primary-foreground">
                <span className="rounded bg-primary px-1.5 py-0.5">Pts</span>
              </th>
              <th className="px-2 py-2 text-center">PJ</th>
              <th className="px-2 py-2 text-center">PG</th>
              <th className="px-2 py-2 text-center">PP</th>
              <th className="px-2 py-2 text-center">SF</th>
              <th className="px-2 py-2 text-center">SC</th>
              <th className="px-2 py-2 text-center">Ratio</th>
              <th className="px-2 py-2 text-center">PF</th>
              <th className="px-2 py-2 text-center">PC</th>
              <th className="px-2 py-2 text-center">Dif</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const team = teamMap.get(r.team_id);
              if (!team) return null;
              const diff = r.pf - r.pc;
              return (
                <tr
                  key={r.team_id}
                  className="border-t transition-colors hover:bg-muted/50"
                >
                  <td className="px-3 py-2 font-bold tabular-nums">
                    {r.position}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <TeamLogo team={team} size={28} />
                      <div className="min-w-0">
                        <div className="truncate font-semibold">
                          {team.name}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {team.city}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-center font-black tabular-nums text-primary">
                    {r.pts}
                  </td>
                  <td className="px-2 py-2 text-center tabular-nums">{r.pj}</td>
                  <td className="px-2 py-2 text-center tabular-nums">{r.pg}</td>
                  <td className="px-2 py-2 text-center tabular-nums">{r.pp}</td>
                  <td className="px-2 py-2 text-center tabular-nums">{r.sf}</td>
                  <td className="px-2 py-2 text-center tabular-nums">{r.sc}</td>
                  <td className="px-2 py-2 text-center font-mono tabular-nums">
                    {r.ratio_sets.toFixed(2)}
                  </td>
                  <td className="px-2 py-2 text-center tabular-nums">{r.pf}</td>
                  <td className="px-2 py-2 text-center tabular-nums">{r.pc}</td>
                  <td
                    className={
                      "px-2 py-2 text-center font-bold tabular-nums " +
                      (diff > 0
                        ? "text-primary"
                        : diff < 0
                          ? "text-destructive"
                          : "text-muted-foreground")
                    }
                  >
                    {diff > 0 ? `+${diff}` : diff}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
