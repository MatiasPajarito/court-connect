import { CalendarDays, MapPin, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TeamLogo } from "@/components/team-logo";
import type { Match } from "@/lib/types";
import { useTeam, useVenue } from "@/lib/store";

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-CL", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
}

export function MatchCard({
  match,
  hideVenue = false,
}: {
  match: Match;
  hideVenue?: boolean;
}) {
  const home = useTeam(match.home_team_id);
  const away = useTeam(match.away_team_id);
  const venue = useVenue(match.venue_id);

  // 1. Respaldo seguro para partidos de playoffs donde los equipos aún no están definidos en la base de datos
  const homeTeam = home || {
    id: "tbd_home",
    name: "Por definir",
    short_name: "TBD",
    logo_url: "",
    city: "",
  };

  const awayTeam = away || {
    id: "tbd_away",
    name: "Por definir",
    short_name: "TBD",
    logo_url: "",
    city: "",
  };

  const finished = match.status === "finished";

  // 2. Coordenadas seguras para evitar el error "Cannot read properties of undefined (reading 'lat')"
  const lat = (venue as any)?.lat ?? venue?.coordinates?.lat ?? 0;
  const lng = (venue as any)?.lng ?? venue?.coordinates?.lng ?? 0;

  return (
    <Card className="p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs text-muted-foreground">
        <span className="flex min-w-0 items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            Fecha {match.matchday} · {fmtDate(match.datetime)} ·{" "}
            {fmtTime(match.datetime)}
          </span>
        </span>
        {finished && <Badge variant="secondary">Final</Badge>}
        {!finished && <Badge variant="outline">Programado</Badge>}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <TeamLogo team={homeTeam as any} size={40} />
          <div className="min-w-0">
            <div className="truncate text-sm font-bold">{homeTeam.name}</div>
            <div className="truncate text-xs text-muted-foreground">Local</div>
          </div>
        </div>
        
        <div className="text-center">
          {finished ? (
            <div className="font-mono text-3xl font-black tabular-nums">
              <span
                className={
                  match.score.home_sets > match.score.away_sets
                    ? "text-primary"
                    : ""
                }
              >
                {match.score.home_sets}
              </span>
              <span className="mx-1 text-muted-foreground">–</span>
              <span
                className={
                  match.score.away_sets > match.score.home_sets
                    ? "text-primary"
                    : ""
                }
              >
                {match.score.away_sets}
              </span>
            </div>
          ) : (
            <div className="text-2xl font-black text-muted-foreground">VS</div>
          )}
        </div>

        <div className="flex min-w-0 items-center justify-end gap-2 text-right">
          <div className="min-w-0">
            <div className="truncate text-sm font-bold">{awayTeam.name}</div>
            <div className="truncate text-xs text-muted-foreground">Visita</div>
          </div>
          <TeamLogo team={awayTeam as any} size={40} />
        </div>
      </div>

      {match.score.set_details.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {match.score.set_details.map((s) => (
            <span
              key={s.set}
              className="rounded-md bg-muted px-2 py-1 font-mono text-xs tabular-nums"
            >
              {s.home}–{s.away}
            </span>
          ))}
        </div>
      )}

      {venue && !hideVenue && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs">
          <div className="flex min-w-0 items-center gap-1 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {venue.name} · {venue.city}
            </span>
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-primary/50 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-primary hover:bg-primary/10"
            onClick={(e) => e.stopPropagation()}
          >
            <Navigation className="h-3 w-3" /> Cómo llegar
          </a>
        </div>
      )}
    </Card>
  );
}