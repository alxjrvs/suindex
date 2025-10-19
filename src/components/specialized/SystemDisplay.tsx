import { Frame } from "./shared/Frame";
import { RollTableDisplay } from "./shared/RollTableDisplay";
import { ActionDisplay } from "./shared/ActionDisplay";

interface TraitReference {
  type: string;
  amount?: number;
}

interface DamageData {
  type: string;
  amount: number | string;
}

interface StatBonusData {
  stat: string;
  bonus: number;
}

interface SystemData {
  name: string;
  source: string;
  techLevel: 1 | 2 | 3 | 4 | 5 | 6;
  slotsRequired: number;
  salvageValue: number;
  description: string;
  page: number;
  range?: string;
  damage?: DamageData;
  traits?: TraitReference[];
  actionType?: string;
  statBonus?: StatBonusData;
  rollTable?: Record<string, string>;
  notes?: string;
  activationCost?: number | string;
  actions?: any[];
  recommended?: boolean;
}

interface SystemDisplayProps {
  data: SystemData;
}

function formatTraits(traits?: TraitReference[]): string[] {
  if (!traits) return [];
  return traits.map((t) => {
    const type = t.type.charAt(0).toUpperCase() + t.type.slice(1);
    const amount = t.amount !== undefined ? `(${t.amount})` : "";
    return `${type}${amount}`;
  });
}

function generateDetails(data: SystemData) {
  const details: Array<{ value: string | number; cost?: boolean }> = [];

  // Activation cost
  if (data.activationCost !== undefined) {
    const costValue =
      String(data.activationCost).toLowerCase() === "variable"
        ? "XEP"
        : `${data.activationCost}EP`;
    details.push({ value: costValue, cost: true });
  }

  // Action type
  if (data.actionType) {
    const actionType = data.actionType.includes("action")
      ? data.actionType
      : `${data.actionType} Action`;
    details.push({ value: actionType });
  }

  // Range
  if (data.range) {
    details.push({ value: `Range:${data.range}` });
  }

  // Damage
  if (data.damage) {
    details.push({ value: `Damage:${data.damage.amount}${data.damage.type}` });
  }

  // Traits
  const traits = formatTraits(data.traits);
  traits.forEach((t) => {
    details.push({ value: t });
  });

  // Recommended
  if (data.recommended) {
    details.push({ value: "Recommended" });
  }

  return details;
}

export function SystemDisplay({ data }: SystemDisplayProps) {
  const details = generateDetails(data);

  return (
    <Frame
      header={data.name}
      techLevel={data.techLevel}
      details={details}
      description={data.description}
      notes={data.notes}
      showSidebar={true}
      slotsRequired={data.slotsRequired}
      salvageValue={data.salvageValue}
    >
      {/* Stat Bonus */}
      {data.statBonus && (
        <div className="bg-[var(--color-su-white)] border border-[var(--color-su-black)] rounded p-3">
          <span className="font-bold text-[var(--color-su-brick)]">
            Stat Bonus:{" "}
          </span>
          <span className="text-[var(--color-su-black)]">
            +{data.statBonus.bonus} {data.statBonus.stat.replace(/_/g, " ")}
          </span>
        </div>
      )}

      {/* Actions */}
      {data.actions && data.actions.length > 0 && (
        <div className="space-y-3">
          {data.actions.map((action, index) => (
            <ActionDisplay
              key={index}
              action={action}
              activationCurrency="EP"
            />
          ))}
        </div>
      )}

      {/* Roll Table */}
      {data.rollTable && <RollTableDisplay rollTable={data.rollTable} />}
    </Frame>
  );
}

