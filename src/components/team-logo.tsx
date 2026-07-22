import type { Team } from "@/lib/types";

interface Props {
  team: Pick<Team, "short_name" | "logo_color" | "name" | "logo_url">;
  size?: number;
  className?: string;
}

export function TeamLogo({ team, size = 32, className }: Props) {
  if (team.logo_url) {
    return (
      <img
        src={team.logo_url}
        alt={team.name}
        className={
          "shrink-0 rounded-full object-cover shadow-sm ring-1 ring-black/10 " +
          (className ?? "")
        }
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={
        "grid shrink-0 place-items-center rounded-full font-black text-white shadow-sm ring-1 ring-black/10 " +
        (className ?? "")
      }
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        backgroundColor: team.logo_color,
      }}
      aria-label={team.name}
    >
      {team.short_name.slice(0, 3)}
    </div>
  );
}
