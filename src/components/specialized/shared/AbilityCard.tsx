import { ActionDisplay } from "./ActionDisplay";

interface AbilityCardProps {
  ability: {
    name: string;
    description?: string;
    effect?: string;
    range?: string;
    damage?: { type: string; amount: number } | string;
    actionType?: string;
    traits?: Array<{ type: string; amount?: number }>;
    options?: Array<{ label: string; value: string }>;
  };
  headerColor?: string;
}

/**
 * Reusable component for displaying ability cards with consistent styling
 * Used by BioTitanDisplay, NPCDisplay, and similar components
 */
export function AbilityCard({
  ability,
  headerColor = "var(--color-su-brick)",
}: AbilityCardProps) {
  return (
    <div className="border-2 border-[var(--color-su-black)] bg-[var(--color-su-white)]">
      {/* Ability Header */}
      <div
        className="text-[var(--color-su-white)] px-3 py-2 font-bold uppercase"
        style={{ backgroundColor: headerColor }}
      >
        {ability.name}
      </div>

      {/* Ability Details */}
      <div className="p-3 space-y-2">
        <ActionDisplay action={ability} />

        {/* Description */}
        {ability.description && (
          <div className="pt-2 border-t-2 border-[var(--color-su-black)]">
            <p className="text-[var(--color-su-black)]">{ability.description}</p>
          </div>
        )}

        {/* Effect */}
        {ability.effect && (
          <div className="pt-2 border-t-2 border-[var(--color-su-black)]">
            <p className="text-[var(--color-su-black)] italic">{ability.effect}</p>
          </div>
        )}
      </div>
    </div>
  );
}

