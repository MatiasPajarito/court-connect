import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ClipboardList, Trophy, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { SponsorsSection } from "@/components/sponsors-section";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Copa Mamba · Voleibol Interurbano 2026" },
      {
        name: "description",
        content:
          "La Copa Mamba reúne a los mejores clubes de voleibol interurbano. Sigue resultados, calendario, equipos y reglamento del torneo organizado por Club Mamba.",
      },
      { property: "og:title", content: "Copa Mamba · Voleibol Interurbano" },
      {
        property: "og:description",
        content:
          "Torneo interurbano de voleibol organizado por Club Mamba. Blanco, dorado y negro sobre la cancha.",
      },
    ],
  }),
  component: Home,
});

const SECTIONS = [
  {
    to: "/posiciones",
    title: "Posiciones y resultados",
    desc: "Tabla actualizada, ratios de sets y diferencia de puntos.",
    icon: Trophy,
  },
  {
    to: "/calendario",
    title: "Calendario y sedes",
    desc: "Fechas, horarios y ubicaciones de cada partido.",
    icon: CalendarDays,
  },
  {
    to: "/equipos",
    title: "Clubes y planteles",
    desc: "Rosters completos con carnet digital de cancha.",
    icon: Users,
  },
  {
    to: "/reglamento",
    title: "Reglamento",
    desc: "Normativa del torneo con búsqueda instantánea.",
    icon: ClipboardList,
  },
] as const;

function Home() {
  const { sponsors } = useStore();
  return (
    <AppShell>
      <div className="space-y-10">
        {/* HERO */}
        <section className="overflow-hidden rounded-2xl border border-primary/30 bg-secondary text-secondary-foreground shadow-lg">
          <div className="relative px-6 py-10 sm:px-10 sm:py-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 15% 20%, oklch(0.78 0.14 82 / 0.5) 0, transparent 45%), radial-gradient(circle at 85% 80%, oklch(0.78 0.14 82 / 0.35) 0, transparent 50%)",
              }}
            />
            <div className="relative">
              <div className="mb-5 flex items-center gap-3">
                <img
                  src="/mamba-mark-gold.png"
                  alt="Logo Copa Mamba"
                  className="h-12 w-12 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                    Club Mamba presenta
                  </div>
                  <div className="text-xs text-secondary-foreground/70">
                    Temporada 2026
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl">
                Copa <span className="text-primary">Mamba</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm text-secondary-foreground/80 sm:text-base">
                1ª versión de la Liga de Voleibol Competitiva, organizada por{" "}
                <strong className="text-primary">
                  Mamba Club Volley Melipilla
                </strong>
                . Blanco, dorado y negro sobre la cancha: seis clubes, una
                temporada, un solo campeón.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/posiciones"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-sm transition-transform hover:scale-[1.02]"
                >
                  <Trophy className="h-4 w-4" /> Ver posiciones
                </Link>
                <Link
                  to="/calendario"
                  className="inline-flex items-center gap-2 rounded-md border border-primary/50 bg-transparent px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-primary/10"
                >
                  <CalendarDays className="h-4 w-4" /> Calendario
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-primary/20 border-t border-primary/20 bg-black/20 text-center">
            <div className="px-3 py-4">
              <div className="text-2xl font-black text-primary sm:text-3xl">
                6
              </div>
              <div className="text-[10px] uppercase tracking-wider text-secondary-foreground/70">
                Clubes
              </div>
            </div>
            <div className="px-3 py-4">
              <div className="text-2xl font-black text-primary sm:text-3xl">
                5
              </div>
              <div className="text-[10px] uppercase tracking-wider text-secondary-foreground/70">
                Fechas
              </div>
            </div>
            <div className="px-3 py-4">
              <div className="text-2xl font-black text-primary sm:text-3xl">
                3
              </div>
              <div className="text-[10px] uppercase tracking-wider text-secondary-foreground/70">
                Sedes
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="grid gap-4 sm:grid-cols-[2fr_1fr]">
          <Card className="p-6">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Sobre el torneo
            </h2>
            <h3 className="mb-3 text-2xl font-black leading-tight">
              Voleibol de club, entre ciudades, con espíritu Mamba.
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              La Copa Mamba es la 1ª versión de la Liga de Voleibol Competitiva:
              seis clubes de distintas ciudades disputan una fase regular
              todos-contra-todos al mejor de 3 sets, clasificando los 4 mejores
              a semifinales y final al mejor de 5 sets. Los resultados se cargan
              tras cada jornada y la tabla se recalcula automáticamente por
              puntos, partidos ganados, set promedio y punto promedio.
            </p>
          </Card>

          <Card className="flex flex-col justify-between gap-3 border-secondary bg-secondary p-6 text-secondary-foreground">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Organiza
              </div>
              <div className="mt-1 text-xl font-black">
                Mamba Club Volley Melipilla
              </div>
              <p className="mt-2 text-xs text-secondary-foreground/70">
                Los colores oficiales — blanco, dorado y negro — visten la
                cancha y esta plataforma.
              </p>
            </div>
            <div className="flex gap-1.5">
              <span className="h-6 flex-1 rounded bg-white ring-1 ring-primary/30" />
              <span className="h-6 flex-1 rounded bg-primary" />
              <span className="h-6 flex-1 rounded bg-black ring-1 ring-primary/30" />
            </div>
          </Card>
        </section>

        {/* SECTIONS GRID */}
        <section>
          <h2 className="mb-3 text-lg font-black uppercase tracking-tight">
            Explora el torneo
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.to}
                  to={s.to}
                  className="group flex items-start gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-base font-black uppercase tracking-tight">
                      {s.title}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {s.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <SponsorsSection sponsors={sponsors} />
      </div>
    </AppShell>
  );
}