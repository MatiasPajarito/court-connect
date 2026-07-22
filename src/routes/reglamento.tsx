import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/reglamento")({
  component: Reglamento,
  head: () => ({
    meta: [
      { title: "Reglamento · Copa Interurbana" },
      { name: "description", content: "Bases oficiales del campeonato, en formato nativo y con búsqueda instantánea." },
    ],
  }),
});

interface Rule { id: string; title: string; body: string[]; }
interface Section { id: string; title: string; rules: Rule[]; }

const SECTIONS: Section[] = [
  {
    id: "s1",
    title: "1. Formato de Competencia y Puntuación",
    rules: [
      { id: "r11", title: "Sistema de juego", body: [
        "Fase Regular: Se disputa bajo el formato todos contra todos. Cada partido se jugará al mejor de 3 sets (los primeros dos a 25 puntos, eventual tercero a 15 puntos, siempre con diferencia de 2).",
        "Playoffs (Semifinal y Final): Clasifican los 4 mejores de la tabla. Los partidos de esta fase se jugarán al mejor de 5 sets (primeros cuatro a 25 puntos, eventual quinto a 15 puntos, siempre con diferencia de 2).",
      ]},
      { id: "r12", title: "Sistema de puntuación en Tabla", body: [
        "Victoria 2-0: Otorga 3 puntos al ganador y 0 al perdedor.",
        "Victoria 2-1: Otorga 2 puntos al ganador y 1 al perdedor.",
        "Criterios de Desempate: En caso de igualdad de puntos, la tabla se definirá en el siguiente orden estricto: 1) Mayor cantidad de partidos ganados, 2) Ratio de Sets (Sets a favor / Sets en contra), 3) Ratio de Puntos (Puntos a favor / Puntos en contra), 4) Resultado del partido directo entre los involucrados.",
      ]},
    ],
  },
  {
    id: "s2",
    title: "2. Planilla O-2 bis, Inscripciones y Carnet",
    rules: [
      { id: "r21", title: "Inscripción y Planilla O-2 bis", body: [
        "Es estrictamente obligatorio el uso del formulario oficial O-2 bis para presentar la nómina del equipo antes del inicio de cada partido.",
        "Para que un partido sea oficial y no se declare W.O., un equipo debe presentarse con un mínimo de 6 jugadores en cancha.",
        "El máximo de jugadores habilitados por nómina para un encuentro es de 14 (incluyendo los líberos).",
      ]},
      { id: "r22", title: "Suplantación de identidad", body: [
        "Toda suplantación conlleva la pérdida automática del partido (W.O.) y una sanción al club involucrado por 2 fechas.",
        "La mesa de control validará la identidad mediante el Carnet Digital de Cancha disponible en esta plataforma.",
      ]},
    ],
  },
  {
    id: "s3",
    title: "3. Cancha, Indumentaria y Reglas del Líbero",
    rules: [
      { id: "r30", title: "Altura de la red", body: [
        "La altura oficial de la red para todos los encuentros del torneo será de 2.43 metros.",
      ]},
      { id: "r31", title: "Uniforme", body: [
        "Todos los jugadores de campo deben vestir camiseta idéntica con número visible en pecho y espalda.",
      ]},
      { id: "r32", title: "El Líbero", body: [
        "El Líbero debe usar una camiseta de color contrastante con la del resto del equipo.",
        "Solo puede jugar en la zona de defensa (zaguero). No puede sacar, bloquear ni intentar bloquear.",
        "No puede atacar completando un balón sobre el borde superior de la red.",
        "Se permite inscribir hasta 2 líberos por equipo por partido.",
      ]},
    ],
  },
  {
    id: "s4",
    title: "4. Puntualidad, Tiempos de Espera y W.O.",
    rules: [
      { id: "r41", title: "Hora de citación", body: [
        "Los equipos deben presentarse 30 minutos antes del inicio programado del partido.",
      ]},
      { id: "r42", title: "Atraso y W.O.", body: [
        "Tolerancia máxima: 15 minutos desde la hora oficial de inicio fijada en el calendario.",
        "Superado ese tiempo, se declara W.O. a favor del rival con marcador máximo en contra (2-0 en fase regular: 25-0, 25-0).",
        "El equipo que reincida en atrasos o ausencias podrá ser sancionado con el descuento de puntos en la tabla general.",
      ]},
      { id: "r43", title: "Sustituciones", body: [
        "Cada equipo puede realizar hasta 6 sustituciones por set. Los cambios de líbero son ilimitados y no cuentan como sustitución regular.",
      ]},
    ],
  },
];

function highlight(text: string, q: string) {
  if (!q) return text;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
  return parts.map((p, i) =>
    p.toLowerCase() === q.toLowerCase()
      ? <mark key={i} className="rounded bg-accent px-0.5 text-accent-foreground">{p}</mark>
      : <span key={i}>{p}</span>,
  );
}

function Reglamento() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return SECTIONS;
    const needle = q.toLowerCase();
    return SECTIONS
      .map((s) => ({
        ...s,
        rules: s.rules.filter(
          (r) => r.title.toLowerCase().includes(needle) || r.body.some((b) => b.toLowerCase().includes(needle)),
        ),
      }))
      .filter((s) => s.rules.length > 0);
  }, [q]);

  const openAll = q.trim() ? filtered.map((s) => s.id) : undefined;

  return (
    <AppShell>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight sm:text-2xl">Reglamento oficial</h1>
          <p className="text-xs text-muted-foreground">Prueba con: "O-2 bis", "W.O.", "red", "desempate".</p>
        </div>

        <div className="sticky top-14 z-10 -mx-3 bg-background px-3 py-2 sm:mx-0 sm:px-0">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar en el reglamento..."
              className="pl-9"
            />
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
            Sin resultados para "{q}".
          </div>
        )}

        <Accordion
          type="multiple"
          value={openAll}
          className="overflow-hidden rounded-lg border bg-card"
        >
          {filtered.map((s) => (
            <AccordionItem key={s.id} value={s.id} className="border-b last:border-b-0">
              <AccordionTrigger className="px-4 text-left text-sm font-bold uppercase tracking-wide">
                {s.title}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  {s.rules.map((r) => (
                    <div key={r.id}>
                      <h3 className="mb-1 text-sm font-bold">{highlight(r.title, q)}</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {r.body.map((line, i) => (
                          <li key={i} className="leading-relaxed">• {highlight(line, q)}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </AppShell>
  );
}