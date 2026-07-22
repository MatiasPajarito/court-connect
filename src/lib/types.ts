export type PlayerPosition =
  "Armador" | "Punta/Receptor" | "Central" | "Opuesto" | "Líbero";

export interface Sponsor {
  id: string;
  name: string;
  /** Logo del auspiciador. Si no está, se muestra el nombre en texto. */
  logo_url?: string;
  website_url?: string;
  tier?: "oro" | "plata" | "bronce";
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  coordinates: { lat: number; lng: number };
  /** Foto opcional del gimnasio (fachada). Si no está, se muestra un bloque ilustrado. */
  photo_url?: string;
}

export interface Team {
  id: string;
  name: string;
  short_name: string;
  city: string;
  logo_color: string;
  coach: string;
  /** Logo real del club. Si no está, se muestra el círculo con sus iniciales. */
  logo_url?: string;
}

export interface Player {
  id: string;
  team_id: string;
  number: number;
  name: string;
  position: PlayerPosition;
  is_captain: boolean;
}

export interface SetDetail {
  set: number;
  home: number;
  away: number;
}

export type MatchStatus = "scheduled" | "live" | "finished";
export type Phase = "regular" | "playoffs";

export interface Match {
  id: string;
  matchday: number;
  phase: Phase;
  datetime: string;
  status: MatchStatus;
  home_team_id: string;
  away_team_id: string;
  venue_id: string;
  score: {
    home_sets: number;
    away_sets: number;
    set_details: SetDetail[];
  };
}

export interface StandingRow {
  team_id: string;
  position: number;
  pj: number;
  pg: number;
  pp: number;
  pts: number;
  sf: number;
  sc: number;
  ratio_sets: number;
  pf: number;
  pc: number;
  ratio_points: number;
}


export interface MatchScore {
  home_sets: number;
  away_sets: number;
  set_details: SetDetail[];
}