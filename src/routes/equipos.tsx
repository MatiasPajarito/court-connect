import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, Star } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { TeamLogo } from "@/components/team-logo";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import type { Team } from "@/lib/types";

export const Route = createFileRoute("/equipos")({
  component: Equipos,
  head: () => ({
    meta: [
      { title: "Clubes y Carnet Digital · Copa Interurbana" },
      { name: "description", content: "Plantillas oficiales de cada club para verificación arbitral." },
    ],
  }),
});

function Equipos() {
  const { teams, players } = useStore();
  const [open, setOpen] = useState<Team | null>(null);

  const roster = open ? players.filter((p) => p.team_id === open.id).sort((a, b) => a.number - b.number) : [];

  return (
    <AppShell>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight sm:text-2xl">Clubes participantes</h1>
          <p className="text-xs text-muted-foreground">Selecciona un club para ver su carnet digital de cancha.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {teams.map((t) => (
            <button
              key={t.id}
              onClick={() => setOpen(t)}
              className="text-left transition-transform hover:-translate-y-0.5"
            >
              <Card className="flex flex-col items-center gap-2 p-4">
                <TeamLogo team={t} size={56} />
                <div className="text-center">
                  <div className="text-sm font-black leading-tight">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.city}</div>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          {open && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <TeamLogo team={open} size={48} />
                  <div className="min-w-0">
                    <DialogTitle className="truncate text-left">{open.name}</DialogTitle>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-2 flex items-center gap-2 rounded-md border-l-4 border-primary bg-muted p-2 text-xs">
                <Shield className="h-4 w-4 text-primary" />
                <span className="font-semibold uppercase tracking-wide">Carnet Digital de Cancha</span>
              </div>

              <div className="mt-3 overflow-hidden rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary text-secondary-foreground text-xs uppercase">
                    <tr>
                      <th className="px-2 py-1.5 text-center">#</th>
                      <th className="px-2 py-1.5 text-left">Jugador</th>
                      <th className="px-2 py-1.5 text-left">Posición</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roster.map((p) => (
                      <tr key={p.id} className="border-t">
                        <td className="px-2 py-2 text-center font-mono font-bold tabular-nums">{p.number}</td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium">{p.name}</span>
                            {p.is_captain && (
                              <Badge variant="outline" className="gap-1 text-[10px]">
                                <Star className="h-3 w-3 fill-current" /> C
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-2">
                          {p.position === "Líbero" ? (
                            <span className="inline-flex items-center rounded-full bg-libero px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-libero-foreground">
                              Líbero
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">{p.position}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}