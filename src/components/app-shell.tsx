import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, ClipboardList, Home, Trophy, Users } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/category";

const NAV = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/posiciones", label: "Posiciones", icon: Trophy },
  { to: "/calendario", label: "Calendario", icon: CalendarDays },
  { to: "/equipos", label: "Equipos", icon: Users },
  { to: "/reglamento", label: "Reglas", icon: ClipboardList },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { selectedCategory, setSelectedCategory } = useStore();

  return (
    <div data-category={selectedCategory} className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-20 border-b bg-secondary text-secondary-foreground shadow-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-3 rounded-md transition-opacity hover:opacity-80"
            aria-label="Ir al inicio"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-black/25 p-1 ring-1 ring-primary/40">
              <img
                src="/mamba-mark-gold.png"
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-black uppercase tracking-wide">
                LIVOCOM
              </div>
              <div className="truncate text-[11px] text-secondary-foreground/70">
                Liga de Voleibol Competitiva · Sept. 2026
              </div>
            </div>
          </Link>

          <div
            role="tablist"
            aria-label="Categoría del torneo"
            className="ml-auto flex shrink-0 rounded-full border border-primary/40 bg-black/25 p-0.5"
          >
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                role="tab"
                aria-selected={selectedCategory === c.value}
                onClick={() => setSelectedCategory(c.value)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-wide transition-colors",
                  selectedCategory === c.value
                    ? "bg-primary text-primary-foreground"
                    : "text-secondary-foreground/70 hover:text-secondary-foreground",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <ul className="mx-auto grid max-w-5xl grid-cols-5">
          {NAV.map((n) => {
            const active =
              n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className={cn(
                    "flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
                  <span className="uppercase tracking-wide">{n.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
