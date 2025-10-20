import { useEffect, useState } from "react";
import { SalvageUnionReference } from "salvageunion-reference";
import { Frame } from "./shared/Frame";
import { DataList } from "./shared/DataList";
import type { DataValue } from "../../types/common";

interface AbilityData {
  name: string;
  source: string;
  tree: string;
  level: number | string;
  description?: string;
  effect?: string;
  activationCost?: number | string;
  range?: string;
  actionType?: string;
  page: number;
}

interface ClassData {
  name: string;
  source: string;
  type: "core" | "hybrid";
  description: string;
  coreAbilities: string[];
  hybridClasses?: string[];
  coreClasses?: string[];
  advancedAbilities?: string;
  legendaryAbilities: string[];
  page: number;
}

interface ClassDisplayProps {
  data: ClassData;
}

interface HydratedAbilities {
  [key: string]: AbilityData[];
}

function AbilitySection({
  title,
  abilities,
  headerColor,
}: {
  title: string;
  abilities: HydratedAbilities;
  headerColor: string;
}) {
  const abilityKeys = Object.keys(abilities);

  if (abilityKeys.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3
        className="text-xl font-bold uppercase text-center py-2"
        style={{ color: headerColor }}
      >
        {title}
      </h3>
      <div className="space-y-4">
        {abilityKeys.map((key) => (
          <AbilityList
            key={key}
            treeKey={key}
            abilities={abilities[key]}
            headerColor={headerColor}
          />
        ))}
      </div>
    </div>
  );
}

function AbilityList({
  treeKey,
  abilities,
  headerColor,
}: {
  treeKey: string;
  abilities: AbilityData[];
  headerColor: string;
}) {
  if (abilities.length === 0) return null;

  return (
    <div className="border border-[var(--color-su-black)] rounded-lg overflow-hidden">
      <div
        className="p-2 font-bold text-[var(--color-su-white)]"
        style={{ backgroundColor: headerColor }}
      >
        {treeKey}
      </div>
      <div className="bg-[var(--color-su-light-blue)] p-3 space-y-3">
        {abilities.map((ability, index) => (
          <AbilityItem key={index} ability={ability} />
        ))}
      </div>
    </div>
  );
}

function AbilityItem({ ability }: { ability: AbilityData }) {
  const details: DataValue[] = [];

  if (ability.activationCost) {
    const costValue =
      ability.activationCost === "Variable"
        ? "X AP"
        : `${ability.activationCost} AP`;
    details.push({ value: costValue, cost: true });
  }

  if (ability.range) {
    details.push({ value: ability.range });
  }

  if (ability.actionType) {
    details.push({ value: ability.actionType });
  }

  return (
    <div className="bg-[var(--color-su-white)] border border-[var(--color-su-black)] rounded p-3 space-y-2">
      <div className="flex items-start gap-2">
        <span className="bg-[var(--color-su-orange)] text-[var(--color-su-white)] font-bold px-2 py-1 rounded min-w-[30px] text-center">
          {ability.level}
        </span>
        <div className="flex-1">
          <h5 className="font-bold text-[var(--color-su-black)]">
            {ability.name}
          </h5>
          {details.length > 0 && (
            <div className="mt-1">
              <DataList values={details} textColor="var(--color-su-brick)" />
            </div>
          )}
        </div>
      </div>

      {ability.description && (
        <p className="text-[var(--color-su-black)] text-sm italic">
          {ability.description}
        </p>
      )}

      {ability.effect && (
        <p className="text-[var(--color-su-black)] leading-relaxed">
          {ability.effect}
        </p>
      )}
    </div>
  );
}

export function ClassDisplay({ data }: ClassDisplayProps) {
  const [abilities, setAbilities] = useState<AbilityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const abilityData = SalvageUnionReference.Abilities.all();
      setAbilities(abilityData as AbilityData[]);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load abilities:", err);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-[var(--color-su-black)]">
          Loading abilities...
        </div>
      </div>
    );
  }

  // Hydrate abilities
  const coreAbilities: HydratedAbilities = {};
  data.coreAbilities.forEach((tree) => {
    coreAbilities[tree] = abilities
      .filter((a) => a.tree === tree)
      .sort((a, b) => Number(a.level) - Number(b.level));
  });

  const advancedAbilities: HydratedAbilities = {};
  if (data.advancedAbilities) {
    advancedAbilities[data.advancedAbilities] = abilities
      .filter((a) => a.tree === data.advancedAbilities)
      .sort((a, b) => Number(a.level) - Number(b.level));
  }

  const legendaryAbilities: HydratedAbilities = {};
  if (data.legendaryAbilities && data.legendaryAbilities.length > 0) {
    legendaryAbilities["Legendary Abilities"] = data.legendaryAbilities
      .map((name) => abilities.find((a) => a.name === name))
      .filter((a): a is AbilityData => a !== undefined);
  }

  return (
    <Frame
      header={data.name}
      headerColor={
        data.type === "core" ? "var(--color-su-orange)" : "var(--color-su-pink)"
      }
      description={data.description}
      showSidebar={false}
    >
      <div className="space-y-6">
        {/* Class Info */}
        <div className="bg-[var(--color-su-white)] border border-[var(--color-su-black)] rounded p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--color-su-brick)]">
              Type:
            </span>
            <span className="text-[var(--color-su-black)] capitalize">
              {data.type}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--color-su-brick)]">
              Source:
            </span>
            <span className="text-[var(--color-su-black)] capitalize">
              {data.source}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--color-su-brick)]">
              Page:
            </span>
            <span className="text-[var(--color-su-black)]">{data.page}</span>
          </div>
          {data.hybridClasses && data.hybridClasses.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="font-bold text-[var(--color-su-brick)]">
                Hybrid Classes:
              </span>
              <span className="text-[var(--color-su-black)]">
                {data.hybridClasses.join(", ")}
              </span>
            </div>
          )}
          {data.coreClasses && data.coreClasses.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="font-bold text-[var(--color-su-brick)]">
                Core Classes:
              </span>
              <span className="text-[var(--color-su-black)]">
                {data.coreClasses.join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Core Abilities */}
        <AbilitySection
          title="Core Abilities"
          abilities={coreAbilities}
          headerColor="var(--color-su-brick)"
        />

        {/* Advanced Abilities */}
        {Object.keys(advancedAbilities).length > 0 && (
          <AbilitySection
            title="Advanced Abilities"
            abilities={advancedAbilities}
            headerColor="var(--color-su-orange)"
          />
        )}

        {/* Legendary Abilities */}
        {Object.keys(legendaryAbilities).length > 0 && (
          <AbilitySection
            title="Legendary Abilities"
            abilities={legendaryAbilities}
            headerColor="var(--color-su-pink)"
          />
        )}
      </div>
    </Frame>
  );
}
