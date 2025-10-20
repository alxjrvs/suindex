import { Frame } from "./shared/Frame";
import { StatList } from "./shared/StatList";
import { ActionDisplay } from "./shared/ActionDisplay";

interface NPCDisplayProps {
  data: {
    name: string;
    source: string;
    description?: string;
    hitPoints: number;
    abilities?: Array<{
      name: string;
      description?: string;
      effect?: string;
      range?: string;
      damage?: { type: string; amount: number } | string;
      actionType?: string;
      traits?: Array<{ type: string; amount?: number }>;
    }>;
    page: number;
  };
}

export default function NPCDisplay({ data }: NPCDisplayProps) {
  return (
    <Frame
      header={data.name}
      headerContent={
        <div className="ml-auto pb-6" style={{ overflow: "visible" }}>
          <StatList
            stats={[
              {
                label: "HP",
                value: data.hitPoints.toString(),
              },
            ]}
            up={false}
          />
        </div>
      }
      showSidebar={false}
    >
      {/* Description */}
      {data.description && (
        <div className="mb-4 p-3 border-2 border-[var(--color-su-black)] bg-[var(--color-su-white)]">
          <p className="text-[var(--color-su-black)]">{data.description}</p>
        </div>
      )}

      {/* Abilities */}
      {data.abilities && data.abilities.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[var(--color-su-black)] uppercase">
            Abilities
          </h3>
          {data.abilities.map((ability, index) => (
            <div
              key={index}
              className="border-2 border-[var(--color-su-black)] bg-[var(--color-su-white)]"
            >
              {/* Ability Header */}
              <div className="bg-[var(--color-su-brick)] text-[var(--color-su-white)] px-3 py-2 font-bold uppercase">
                {ability.name}
              </div>

              {/* Ability Details */}
              <div className="p-3 space-y-2">
                <ActionDisplay action={ability} />

                {/* Description */}
                {ability.description && (
                  <div className="pt-2 border-t-2 border-[var(--color-su-black)]">
                    <p className="text-[var(--color-su-black)]">
                      {ability.description}
                    </p>
                  </div>
                )}

                {/* Effect */}
                {ability.effect && (
                  <div className="pt-2 border-t-2 border-[var(--color-su-black)]">
                    <p className="text-[var(--color-su-black)] italic">
                      {ability.effect}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Page Reference */}
      <div className="mt-4 pt-3 border-t-2 border-[var(--color-su-black)] text-sm text-[var(--color-su-black)]">
        <span className="font-bold uppercase">{data.source}</span> • Page{" "}
        {data.page}
      </div>
    </Frame>
  );
}
