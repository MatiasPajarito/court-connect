import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";
import { sponsors } from "./mock-data";
import type { Match, SetDetail, Team, Player, Venue, MatchScore } from "./types";

interface StoreCtx {
  matches: Match[];
  addMatch: (m: Omit<Match, "id" | "score" | "status">) => Promise<void>;
  saveResult: (id: string, setDetails: SetDetail[]) => Promise<void>;
  resetData: () => Promise<void>;
  teams: Team[];
  players: Player[];
  venues: Venue[];
  sponsors: typeof sponsors;
  deleteMatch: (matchId: string) => Promise<void>;
  updateMatchDetails: (matchId: string, details: Partial<Match>) => Promise<void>;
  updateTeam: (teamId: string, updates: Partial<Team>) => Promise<void>;
}

const Ctx = createContext<StoreCtx | null>(null);

function computeSetTotals(setDetails: SetDetail[]) {
  let home = 0,
    away = 0;
  for (const s of setDetails) {
    if (s.home > s.away) home++;
    else if (s.away > s.home) away++;
  }
  return { home, away };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);

  // 1. Cargar datos iniciales desde Supabase al montar el Provider
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [tRes, pRes, vRes, mRes] = await Promise.all([
          supabase.from("teams").select("*"),
          supabase.from("players").select("*"),
          supabase.from("venues").select("*"),
          supabase.from("matches").select("*"),
        ]);

        if (tRes.error) console.error("Error teams:", tRes.error);
        if (pRes.error) console.error("Error players:", pRes.error);
        if (vRes.error) console.error("Error venues:", vRes.error);
        if (mRes.error) console.error("Error matches:", mRes.error);

        if (tRes.data) setTeams(tRes.data);
        if (pRes.data) setPlayers(pRes.data);
        if (vRes.data) setVenues(vRes.data);
        if (mRes.data) setMatches(mRes.data);
      } catch (err) {
        console.error("Error conectando con Supabase:", err);
      }
    }

    loadInitialData();

    // 2. Suscripción en Tiempo Real (Realtime) para los partidos
    const channel = supabase
      .channel("public:matches")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "matches" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMatches((prev) => [...prev, payload.new as Match]);
          } else if (payload.eventType === "UPDATE") {
            setMatches((prev) =>
              prev.map((m) => (m.id === payload.new.id ? (payload.new as Match) : m))
            );
          } else if (payload.eventType === "DELETE") {
            setMatches((prev) => prev.filter((m) => m.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addMatch = useCallback(async (m: Omit<Match, "id" | "score" | "status">) => {
    const newMatchPayload = {
      ...m,
      status: "scheduled",
      score: { home_sets: 0, away_sets: 0, set_details: [] },
    };

    const { data, error } = await supabase
      .from("matches")
      .insert([newMatchPayload])
      .select()
      .single();

    if (error) {
      console.error("Error al agregar partido en Supabase:", error);
    } else if (data) {
      setMatches((prev) => [...prev, data]);
    }
  }, []);

  const saveResult = useCallback(async (id: string, setDetails: SetDetail[]) => {
    const totals = computeSetTotals(setDetails);
    const updatedScore: MatchScore = {
      home_sets: totals.home,
      away_sets: totals.away,
      set_details: setDetails,
    };

    const { error } = await supabase
      .from("matches")
      .update({
        status: "finished",
        score: updatedScore,
      })
      .eq("id", id);

    if (error) {
      console.error("Error al guardar resultado en Supabase:", error);
    } else {
      setMatches((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, status: "finished", score: updatedScore }
            : m
        )
      );
    }
  }, []);

  const resetData = useCallback(async () => {
    try {
      await supabase.from("matches").delete().neq("id", "0");
      setMatches([]);
    } catch (err) {
      console.error("Error al resetear datos:", err);
    }
  }, []);

  const deleteMatch = useCallback(async (matchId: string) => {
    const { error } = await supabase.from("matches").delete().eq("id", matchId);
    if (error) {
      console.error("Error al eliminar partido en Supabase:", error);
    } else {
      setMatches((prev) => prev.filter((m) => m.id !== matchId));
    }
  }, []);

  const updateMatchDetails = useCallback(async (matchId: string, details: Partial<Match>) => {
    const { error } = await supabase
      .from("matches")
      .update(details)
      .eq("id", matchId);

    if (error) {
      console.error("Error al actualizar detalles del partido:", error);
    } else {
      setMatches((prev) =>
        prev.map((m) => (m.id === matchId ? { ...m, ...details } : m))
      );
    }
  }, []);

  const updateTeam = useCallback(async (teamId: string, updates: Partial<Team>) => {
    const { error } = await supabase
      .from("teams")
      .update(updates)
      .eq("id", teamId);

    if (error) {
      console.error("Error al actualizar detalles del equipo:", error);
      throw error;
    }
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, ...updates } : t))
    );
  }, []);

  const value = useMemo<StoreCtx>(
    () => ({
      matches,
      addMatch,
      saveResult,
      resetData,
      deleteMatch,
      updateMatchDetails,
      updateTeam,
      teams,
      players,
      venues,
      sponsors,
    }),
    [matches, addMatch, saveResult, resetData, deleteMatch, updateMatchDetails, updateTeam, teams, players, venues]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used within StoreProvider");
  return v;
}

export function useTeam(id: string | undefined) {
  const { teams } = useStore();
  return teams.find((t) => t.id === id);
}

export function useVenue(id: string | undefined) {
  const { venues } = useStore();
  return venues.find((v) => v.id === id);
}