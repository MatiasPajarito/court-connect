import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { MatchCard } from "@/components/match-card";
import { StandingsTable } from "@/components/standings-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import { computeStandings } from "@/lib/standings";
import type { Match } from "@/lib/types";
import { PlayoffBracket } from "@/components/playoff-bracket"; // <-- AGREGA ESTA LÍNEA ARRIBA

export const Route = createFileRoute("/posiciones")({
  head: () => ({
    meta: [
      { title: "Posiciones y Resultados · Copa Mamba" },
      {
        name: "description",
        content:
          "Tabla de posiciones, resultados y próximos partidos de la Copa Mamba de Voleibol.",
      },
    ],
  }),
  component: Posiciones,
});

function Posiciones() {
  const { matches, teams } = useStore();
  const [phase, setPhase] = useState<"regular" | "playoffs">("regular");

  const standings = useMemo(
    () => computeStandings(teams, matches),
    [teams, matches],
  );

  // Un solo resultado por fecha (el último partido jugado de esa jornada), para no
  // duplicar el detalle completo que ya se ve en /calendario. Ordenado de la fecha
  // más reciente a la más antigua.
  const lastResultPerFecha = useMemo(() => {
    const byMatchday = new Map<number, Match>();
    for (const m of matches) {
      if (m.phase !== phase || m.status !== "finished") continue;
      const current = byMatchday.get(m.matchday);
      if (!current || m.datetime > current.datetime) {
        byMatchday.set(m.matchday, m);
      }
    }
    return Array.from(byMatchday.values()).sort(
      (a, b) => b.matchday - a.matchday,
    );
  }, [matches, phase]);

  return (
    <AppShell>
      <div className="space-y-8">
        <section>
          <div className="mb-3">
            <h1 className="text-xl font-black uppercase tracking-tight sm:text-2xl">
              Tabla de posiciones
            </h1>
            <p className="text-xs text-muted-foreground">
              Ordenada por Pts · Ratio de sets · Diferencia de puntos (PF − PC)
            </p>
          </div>
          <Tabs
            value={phase}
            onValueChange={(v) => setPhase(v as "regular" | "playoffs")}
          >
            <TabsList className="mb-3">
              <TabsTrigger value="regular">Fase Regular</TabsTrigger>
              <TabsTrigger value="playoffs">Playoffs</TabsTrigger>
            </TabsList>
            <TabsContent value="regular" className="mt-0">
              <StandingsTable rows={standings} teams={teams} />
            </TabsContent>
            
            {/* AQUÍ ESTÁ EL CAMBIO: Reemplazamos el texto por el componente */}
            <TabsContent value="playoffs" className="mt-0">
              <PlayoffBracket standings={standings} />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </AppShell>
  );
}
