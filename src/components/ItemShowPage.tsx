import { useEffect, useState, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { ReactElement } from "react";
import { SalvageUnionReference } from "salvageunion-reference";
import type { SchemaInfo, DataItem } from "../types/schema";
import { getDisplayComponent } from "./specialized/componentRegistry";

// Map schema IDs to their models
const modelMap: Record<string, { all: () => unknown[] }> = {
  abilities: SalvageUnionReference.Abilities,
  "ability-tree-requirements": SalvageUnionReference.AbilityTreeRequirements,
  "bio-titans": SalvageUnionReference.BioTitans,
  chassis: SalvageUnionReference.Chassis,
  classes: SalvageUnionReference.Classes,
  crawlers: SalvageUnionReference.Crawlers,
  creatures: SalvageUnionReference.Creatures,
  drones: SalvageUnionReference.Drones,
  equipment: SalvageUnionReference.Equipment,
  keywords: SalvageUnionReference.Keywords,
  meld: SalvageUnionReference.Meld,
  modules: SalvageUnionReference.Modules,
  npcs: SalvageUnionReference.NPCs,
  squads: SalvageUnionReference.Squads,
  systems: SalvageUnionReference.Systems,
  tables: SalvageUnionReference.Tables,
  traits: SalvageUnionReference.Traits,
  vehicles: SalvageUnionReference.Vehicles,
};

interface ItemShowPageProps {
  schemas: SchemaInfo[];
}

export default function ItemShowPage({ schemas }: ItemShowPageProps) {
  const { schemaId, itemId } = useParams<{
    schemaId: string;
    itemId: string;
  }>();
  const navigate = useNavigate();
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentSchema = schemas.find((s) => s.id === schemaId);
  const item = data.find((d) => d.id === itemId);

  useEffect(() => {
    if (!currentSchema) {
      setError("Schema not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const model = modelMap[currentSchema.id];
      if (!model) {
        throw new Error(`Unknown schema: ${currentSchema.id}`);
      }
      const jsonData = model.all();
      setData(jsonData as DataItem[]);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      setLoading(false);
    }
  }, [currentSchema]);

  const formatValue = (value: unknown): ReactElement => {
    if (value === undefined || value === null) {
      return <span className="text-[var(--color-su-brick)] opacity-50">-</span>;
    }

    if (Array.isArray(value)) {
      return (
        <ul className="list-square ml-6 space-y-2">
          {value.map((v, i) => (
            <li key={i} className="pl-2">
              {formatValue(v)}
            </li>
          ))}
        </ul>
      );
    }

    if (typeof value === "object") {
      return (
        <div className="ml-6 space-y-2 border-l-2 border-[var(--color-su-light-blue)] pl-4">
          {Object.entries(value).map(([k, v]) => (
            <div key={k}>
              <span className="font-medium text-[var(--color-su-black)]">
                {k}:{" "}
              </span>
              {formatValue(v)}
            </div>
          ))}
        </div>
      );
    }

    if (typeof value === "boolean") {
      return (
        <span
          className={
            value
              ? "text-[var(--color-su-military-green)]"
              : "text-[var(--color-su-brick)]"
          }
        >
          {value ? "Yes" : "No"}
        </span>
      );
    }

    return <span>{String(value)}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !currentSchema || !item) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-red-600">
          Error: {error || "Item not found"}
        </div>
      </div>
    );
  }

  // Render specialized component based on schema type
  const renderSpecializedContent = () => {
    if (!schemaId) return null;
    const DisplayComponent = getDisplayComponent(schemaId);
    if (!DisplayComponent) return null;
    return (
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-xl">Loading component...</div>
          </div>
        }
      >
        <DisplayComponent data={item} />
      </Suspense>
    );
  };

  const specializedContent = renderSpecializedContent();

  return (
    <div className="h-full flex flex-col bg-[var(--color-su-white)]">
      <div className="bg-[var(--color-su-white)] shadow-sm border-b border-[var(--color-su-light-blue)] p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(`/schema/${schemaId}`)}
            className="text-[var(--color-su-orange)] hover:text-[var(--color-su-brick)] font-medium"
          >
            ← Back to {currentSchema.title}
          </button>
        </div>
        <h2 className="text-3xl font-bold text-[var(--color-su-black)]">
          {(item.name as string) || "Item Details"}
        </h2>
        <p className="text-[var(--color-su-brick)] mt-2">
          {currentSchema.description}
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          {specializedContent ? (
            // Render specialized component
            specializedContent
          ) : (
            // Render generic fallback
            <div className="bg-[var(--color-su-white)] rounded-lg shadow-lg p-8 border border-[var(--color-su-light-blue)]">
              <div className="space-y-6">
                {Object.entries(item)
                  .sort(([a], [b]) => {
                    // Sort: name first, then other fields alphabetically
                    if (a === "name") return -1;
                    if (b === "name") return 1;
                    return a.localeCompare(b);
                  })
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="border-b border-[var(--color-su-light-blue)] pb-6 last:border-b-0"
                    >
                      <div className="font-semibold text-[var(--color-su-black)] mb-3 text-lg capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                      <div className="text-[var(--color-su-black)] text-base">
                        {formatValue(value)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
