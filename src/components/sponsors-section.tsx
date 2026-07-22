import { Megaphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Sponsor } from "@/lib/types";

const TIER_LABEL: Record<NonNullable<Sponsor["tier"]>, string> = {
  oro: "Auspiciador Oro",
  plata: "Auspiciador Plata",
  bronce: "Auspiciador Bronce",
};

function SponsorTile({ sponsor }: { sponsor: Sponsor }) {
  const content = (
    <Card className="flex h-24 items-center justify-center gap-3 p-4 transition-shadow hover:shadow-md">
      {sponsor.logo_url ? (
        <img
          src={sponsor.logo_url}
          alt={sponsor.name}
          className="max-h-14 max-w-full object-contain"
        />
      ) : (
        <span className="text-center text-sm font-bold uppercase tracking-wide text-muted-foreground">
          {sponsor.name}
        </span>
      )}
    </Card>
  );

  if (!sponsor.website_url) return content;
  return (
    <a
      href={sponsor.website_url}
      target="_blank"
      rel="noreferrer"
      aria-label={sponsor.name}
    >
      {content}
    </a>
  );
}

/** Sección de auspiciadores para el home. Si aún no hay sponsors cargados, muestra
 * una invitación a auspiciar en su lugar (no inventa marcas ficticias). */
export function SponsorsSection({ sponsors }: { sponsors: Sponsor[] }) {
  if (sponsors.length === 0) {
    return (
      <section>
        <h2 className="mb-3 text-lg font-black uppercase tracking-tight">
          Auspiciadores
        </h2>
        <Card className="flex flex-col items-center gap-2 border-dashed p-8 text-center">
          <Megaphone className="h-8 w-8 text-primary" />
          <p className="text-sm font-semibold">
            Este espacio está reservado para los auspiciadores del torneo.
          </p>
          <p className="max-w-md text-xs text-muted-foreground">
            ¿Tu marca quiere auspiciar la Copa Mamba? Contáctate con la
            organización para aparecer aquí.
          </p>
        </Card>
      </section>
    );
  }

  const byTier = (tier: Sponsor["tier"]) =>
    sponsors.filter((s) => s.tier === tier);
  const untiered = sponsors.filter((s) => !s.tier);

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-black uppercase tracking-tight">
        Auspiciadores
      </h2>
      {(["oro", "plata", "bronce"] as const).map((tier) => {
        const list = byTier(tier);
        if (list.length === 0) return null;
        return (
          <div key={tier}>
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              {TIER_LABEL[tier]}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {list.map((s) => (
                <SponsorTile key={s.id} sponsor={s} />
              ))}
            </div>
          </div>
        );
      })}
      {untiered.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {untiered.map((s) => (
            <SponsorTile key={s.id} sponsor={s} />
          ))}
        </div>
      )}
    </section>
  );
}
