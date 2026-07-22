import React from "react";
import { Card } from "@/components/ui/card";
import { TeamLogo } from "@/components/team-logo";
import { useStore } from "@/lib/store";
import type { Team } from "@/lib/types";

interface BracketNodeProps {
  title: string;
  subtitle?: string;
  team1?: Team;
  team2?: Team;
  score1?: number;
  score2?: number;
  isFinal?: boolean;
  dateStr?: string;
}

function MatchCard({ title, subtitle, team1, team2, score1, score2, isFinal = false, dateStr }: BracketNodeProps) {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-center mb-1.5">
        <span className={`block text-[11px] font-black uppercase tracking-wider ${isFinal ? "text-primary animate-pulse" : "text-foreground font-bold"}`}>
          {title}
        </span>
        {subtitle && <span className="block text-[10px] text-muted-foreground font-medium">{subtitle}</span>}
      </div>
      <Card className={`w-full overflow-hidden border transition-all ${isFinal ? "border-primary/80 bg-gradient-to-b from-card to-primary/10 shadow-[0_0_20px_rgba(234,179,8,0.15)] scale-105" : "border-border/60 bg-card/80"}`}>
        <div className="divide-y divide-border/40">
          {/* Equipo 1 */}
          <div className="flex items-center justify-between p-2.5">
            <div className="flex items-center gap-2 min-w-0">
              {team1 ? <TeamLogo team={team1} size={24} /> : <div className="h-6 w-6 rounded-full bg-muted animate-pulse" />}
              <span className={`text-xs font-bold truncate ${!team1 ? "text-muted-foreground italic" : ""}`}>
                {team1?.name || "Por definir"}
              </span>
            </div>
            <span className="font-mono text-xs font-black text-primary ml-2">
              {score1 !== undefined ? score1 : "-"}
            </span>
          </div>
          {/* Equipo 2 */}
          <div className="flex items-center justify-between p-2.5">
            <div className="flex items-center gap-2 min-w-0">
              {team2 ? <TeamLogo team={team2} size={24} /> : <div className="h-6 w-6 rounded-full bg-muted animate-pulse" />}
              <span className={`text-xs font-bold truncate ${!team2 ? "text-muted-foreground italic" : ""}`}>
                {team2?.name || "Por definir"}
              </span>
            </div>
            <span className="font-mono text-xs font-black text-primary ml-2">
              {score2 !== undefined ? score2 : "-"}
            </span>
          </div>
        </div>
      </Card>
      {dateStr && <span className="mt-1.5 text-[10px] text-muted-foreground font-semibold">{dateStr}</span>}
    </div>
  );
}

export function PlayoffBracket({ standings }: { standings?: any[] }) {
  const { teams } = useStore();
  
  // Mapeamos el top 4 según el orden actual de la tabla de posiciones (standings)
  const sortedTeams = standings && standings.length >= 4
    ? standings.map((row) => teams.find((t) => t.id === (row.team_id || row.id))).filter(Boolean) as Team[]
    : teams;

  const team1 = sortedTeams[0]; // 1° Lugar provisional
  const team2 = sortedTeams[1]; // 2° Lugar provisional
  const team3 = sortedTeams[2]; // 3° Lugar provisional
  const team4 = sortedTeams[3]; // 4° Lugar provisional

  return (
    <div className="w-full py-4 space-y-6">
      
      {/* BANNER DE PROYECCIÓN EN VIVO */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center max-w-2xl mx-auto space-y-1">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-0.5 text-xs font-black uppercase tracking-wide text-primary">
          <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
          Proyección en tiempo real
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed pt-1">
          Así se jugarían las semifinales si la fase regular terminara hoy. Los cruces oficiales se confirmarán automáticamente al finalizar el <strong className="text-foreground">Todos contra Todos</strong>.
        </p>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
          Cuadro de <span className="text-primary">Playoffs</span>
        </h2>
        <p className="text-xs text-muted-foreground">Llave eliminatoria por el título de la Copa Mamba</p>
      </div>

      {/* Rejilla Simétrica */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center max-w-5xl mx-auto px-2 relative pt-2">
        
        {/* Columna Izquierda: Semifinal A (1° vs 4°) */}
        <div className="space-y-4 relative">
          <MatchCard 
            title="Semifinal A" 
            subtitle="Proyección: 1° vs 4° de la tabla"
            team1={team1} 
            team2={team4} 
            dateStr="Sáb 14 Nov · 16:00 hrs"
          />
        </div>

        {/* Columna Central: GRAN FINAL */}
        <div className="space-y-8 my-4 md:my-0 order-first md:order-none z-10">
          <MatchCard 
            title="👑 GRAN FINAL COPA MAMBA" 
            subtitle="Ganador Semifinal A vs Ganador Semifinal B"
            isFinal={true}
            dateStr="Dom 15 Nov · 18:00 hrs · Estelar"
          />
          <div className="pt-2 opacity-85">
            <MatchCard 
              title="Disputa 3° Lugar" 
              subtitle="Perdedor Semifinal A vs Perdedor Semifinal B"
              dateStr="Dom 15 Nov · 16:00 hrs"
            />
          </div>
        </div>

        {/* Columna Derecha: Semifinal B (2° vs 3°) */}
        <div className="space-y-4 relative">
          <MatchCard 
            title="Semifinal B" 
            subtitle="Proyección: 2° vs 3° de la tabla"
            team1={team2} 
            team2={team3} 
            dateStr="Sáb 14 Nov · 17:30 hrs"
          />
        </div>

      </div>
    </div>
  );
}