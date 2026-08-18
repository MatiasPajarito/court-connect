import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  Camera,
  ClipboardList,
  Instagram,
  Medal,
  MessageCircle,
  Star,
  Ticket,
  Trophy,
  Users,
  Youtube,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { SponsorsSection } from "@/components/sponsors-section";
import { useStore } from "@/lib/store";
import { categoryLabel } from "@/lib/category";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LIVOCOM · Liga de Voleibol Competitiva 2026" },
      {
        name: "description",
        content:
          "LIVOCOM, Liga de Voleibol Competitiva. Inicio Septiembre 2026: 8 clubes por categoría en Varón TC y Damas TC, premios en efectivo y cupos al Torneo de Verano 2027.",
      },
      { property: "og:title", content: "LIVOCOM · Liga de Voleibol Competitiva" },
      {
        property: "og:description",
        content:
          "Varón TC y Damas TC, 7 fechas todos contra todos, premios en efectivo y clasificación al Torneo de Verano 2027.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  const { sponsors, selectedCategory } = useStore();
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
                  alt="Logo LIVOCOM"
                  className="h-12 w-12 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                    Mamba Club Volley presenta
                  </div>
                  <div className="text-xs text-secondary-foreground/70">
                    Inicio oficial · Septiembre 2026 · {categoryLabel(selectedCategory)}
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl">
                LIVO<span className="text-primary">COM</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm text-secondary-foreground/80 sm:text-base">
                Liga de Voleibol Competitiva, organizada por{" "}
                <strong className="text-primary">
                  Mamba Club Volley Melipilla
                </strong>
                . Dos ramas — Varón TC y Damas TC — con 8 clubes cada una, 7 fechas
                todos contra todos y playoffs por el título.
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
                <a
                  href="https://api.whatsapp.com/send?phone=56974203763"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-primary/50 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-primary/10"
                >
                  <MessageCircle className="h-4 w-4" /> Solicitar bases
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-primary/20 border-t border-primary/20 bg-black/20 text-center sm:grid-cols-4">
            <div className="px-3 py-4">
              <div className="text-2xl font-black text-primary sm:text-3xl">
                8
              </div>
              <div className="text-[10px] uppercase tracking-wider text-secondary-foreground/70">
                Clubes por categoría
              </div>
            </div>
            <div className="px-3 py-4">
              <div className="text-2xl font-black text-primary sm:text-3xl">
                7
              </div>
              <div className="text-[10px] uppercase tracking-wider text-secondary-foreground/70">
                Fechas regulares
              </div>
            </div>
            <div className="px-3 py-4">
              <div className="text-2xl font-black text-primary sm:text-3xl">
                2
              </div>
              <div className="text-[10px] uppercase tracking-wider text-secondary-foreground/70">
                Categorías
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

        {/* PREMIOS */}
        <section>
          <h2 className="mb-3 text-lg font-black uppercase tracking-tight">
            Premios y beneficios
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Trophy,
                title: "Premios en efectivo",
                desc: "Bolsa en dinero ($$) para el 1° y 2° lugar de cada categoría.",
              },
              {
                icon: Medal,
                title: "Copas y medallas",
                desc: "Copa y medallas oficiales para campeón y vicecampeón.",
              },
              {
                icon: Star,
                title: "MVP por jornada",
                desc: "Reconocimiento al jugador o jugadora más valiosa de cada fecha.",
              },
              {
                icon: Ticket,
                title: "Cupos Verano 2027",
                desc: "Los 2 primeros de cada rama clasifican directo al Torneo de Verano 2027.",
              },
            ].map((p) => (
              <Card key={p.title} className="p-5">
                <p.icon className="mb-2 h-6 w-6 text-primary" />
                <div className="text-sm font-black uppercase tracking-tight">
                  {p.title}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
              </Card>
            ))}
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
              LIVOCOM es la Liga de Voleibol Competitiva que parte en Septiembre 2026
              con 8 clubes por categoría (Varón TC y Damas TC). La fase regular son 7
              fechas todos contra todos al mejor de 3 sets, y los 4 mejores avanzan a
              playoffs al mejor de 5 sets. La tabla se recalcula automáticamente
              priorizando Puntos, Partidos Ganados, Ratio de Sets y Ratio de Puntos.
              Cada fecha cuenta con registro fotográfico oficial rotativo para todos
              los clubes y cobertura en el Canal Oficial de YouTube de la liga. Además,
              los clubes socios pueden solicitar la localía de una jornada y
              autogestionar la venta de entradas de ese encuentro.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 px-3 py-1">
                <Camera className="h-3.5 w-3.5 text-primary" /> Registro fotográfico rotativo
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 px-3 py-1">
                <Youtube className="h-3.5 w-3.5 text-primary" /> Canal Oficial de YouTube
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 px-3 py-1">
                <Ticket className="h-3.5 w-3.5 text-primary" /> Localía y venta de entradas
              </span>
            </div>
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

        {/* CONTACTO */}
        <section className="grid gap-3 sm:grid-cols-2">
          <a
            href="https://instagram.com/volleyball.melipilla"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary"
          >
            <Instagram className="h-6 w-6 shrink-0 text-primary" />
            <div className="min-w-0">
              <div className="text-sm font-black uppercase tracking-tight">Instagram oficial</div>
              <p className="truncate text-xs text-muted-foreground">@volleyball.melipilla</p>
            </div>
          </a>
          <a
            href="https://api.whatsapp.com/send?phone=56974203763"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary"
          >
            <MessageCircle className="h-6 w-6 shrink-0 text-primary" />
            <div className="min-w-0">
              <div className="text-sm font-black uppercase tracking-tight">WhatsApp · Bases</div>
              <p className="truncate text-xs text-muted-foreground">+569 7420 3763</p>
            </div>
          </a>
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