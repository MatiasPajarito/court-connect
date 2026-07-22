import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Match } from "@/lib/types";
import { TeamLogo } from "@/components/team-logo";
import { useStore } from "@/lib/store";

export function ShareSchedule({ matchday, matches }: { matchday: number; matches: Match[] }) {
  const { teams, venues } = useStore();
  const printRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (!printRef.current) return;
    try {
      setLoading(true);
      toast.info("Generando imagen HD para WhatsApp...");
      
      // 1. Clave técnica: Clonamos el nodo en memoria
      const clone = printRef.current.cloneNode(true) as HTMLDivElement;
      
      // 2. Lo hacemos visible al navegador, pero físicamente oculto detrás del sitio web
      clone.style.position = "absolute";
      clone.style.left = "0px";
      clone.style.top = "0px";
      clone.style.zIndex = "-9999";
      clone.style.opacity = "1";
      clone.style.pointerEvents = "none";
      clone.style.display = "block";
      clone.style.width = "520px";
      
      // 3. Lo inyectamos en el DOM real momentáneamente
      document.body.appendChild(clone);

      // Pequeño retardo de seguridad (100ms) para que React y el navegador terminen de pintar fuentes e íconos
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      // 4. Capturamos el clon renderizado en calidad HD
      const dataUrl = await toPng(clone, {
        backgroundColor: "#09090b", // Fondo zinc-950 sólido
        pixelRatio: 2, // Calidad 2x para pantallas de celular
        skipAutoScale: true,
      });

      // 5. Limpiamos la memoria removiendo el clon del DOM
      document.body.removeChild(clone);

      // Descarga automática del archivo
      const link = document.createElement("a");
      link.download = `Copa-Mamba-Fecha-${matchday}.png`;
      link.href = dataUrl;
      link.click();

      toast.success("¡Imagen guardada! Lista para compartir en WhatsApp.");
    } catch (err) {
      console.error("Detalle del error al exportar:", err);
      toast.error("Hubo un problema al generar la imagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        disabled={loading || matches.length === 0}
        className="border-primary/50 text-primary hover:bg-primary/10"
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Share2 className="mr-2 h-4 w-4" />
        )}
        Compartir Jornada
      </Button>

      {/* Contenedor base invisible en el flujo normal, que servirá solo de molde para la clonación */}
      <div className="hidden">
        <div ref={printRef} className="w-[520px] rounded-2xl border-2 border-primary/40 bg-[#09090b] p-6 text-zinc-100 shadow-2xl space-y-6 font-sans">
          
          {/* Cabecera */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">
                Club Mamba Presenta
              </p>
              <h2 className="text-2xl font-black italic tracking-tight text-white">
                FECHA {matchday} · COPA MAMBA
              </h2>
            </div>
            <div className="text-right font-black text-primary text-sm italic leading-tight">
              VOLLEYBALL<br/><span className="text-zinc-400 text-xs font-normal">2026</span>
            </div>
          </div>

          {/* Lista de Partidos */}
          <div className="space-y-3">
            {matches.map((m) => {
              const home = teams.find((t) => t.id === m.home_team_id);
              const away = teams.find((t) => t.id === m.away_team_id);
              const venue = venues.find((v) => v.id === m.venue_id);
              const dateObj = new Date(m.datetime);
              const timeStr = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              const dateStr = dateObj.toLocaleDateString("es-CL", { weekday: "short", day: "numeric", month: "short" });

              return (
                <div key={m.id} className="rounded-xl border border-zinc-800 bg-[#18181b] p-3.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-2">
                    <span className="capitalize">{dateStr} · {timeStr} hrs</span>
                    <span className="text-primary/90 truncate max-w-[180px]">{venue?.name}</span>
                  </div>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
                    <div className="flex items-center justify-end gap-2 font-bold text-sm text-white">
                      <span className="truncate">{home?.short_name}</span>
                      {home && <TeamLogo team={home} size={28} />}
                    </div>
                    <div className="rounded-md bg-[#27272a] px-2.5 py-1 text-xs font-black text-primary">
                      VS
                    </div>
                    <div className="flex items-center justify-start gap-2 font-bold text-sm text-white">
                      {away && <TeamLogo team={away} size={28} />}
                      <span className="truncate">{away?.short_name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pie */}
          <div className="border-t border-zinc-800 pt-3 text-center">
            <p className="text-[11px] text-zinc-500 font-medium">
              Sigue los resultados en vivo en <span className="text-zinc-300 underline">copa-mamba.vercel.app</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}