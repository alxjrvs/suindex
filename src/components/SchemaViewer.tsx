import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SalvageUnionReference } from "salvageunion-reference";
import type { SchemaInfo, DataItem } from "../types/schema";
import DataTable from "./DataTable";

interface SchemaViewerProps {
  schemas: SchemaInfo[];
}

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

export default function SchemaViewer({ schemas }: SchemaViewerProps) {
  const { schemaId } = useParams<{ schemaId: string }>();
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentSchema = schemas.find((s) => s.id === schemaId);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Loading data...</div>
      </div>
    );
  }

  if (error || !currentSchema) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-red-600">
          Error: {error || "Schema not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-[var(--color-su-white)] shadow-sm border-b border-[var(--color-su-light-blue)] p-6">
        <h2 className="text-2xl font-bold text-[var(--color-su-black)]">
          {currentSchema.title}
        </h2>
        <p className="text-[var(--color-su-brick)] mt-1">
          {currentSchema.description}
        </p>
      </div>
      <div className="flex-1 overflow-auto">
        <DataTable data={data} schema={currentSchema} />
      </div>
    </div>
  );
}
