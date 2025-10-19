import { Frame } from "./shared/Frame";

interface TraitData {
  name: string;
  source: string;
  description: string;
  page: number;
}

interface TraitDisplayProps {
  data: TraitData;
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function TraitDisplay({ data }: TraitDisplayProps) {
  return (
    <Frame
      header={capitalizeFirstLetter(data.name)}
      headerColor="var(--color-su-orange)"
      description={data.description}
      showSidebar={false}
    >
      <div className="bg-[var(--color-su-white)] border border-[var(--color-su-black)] rounded p-3 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[var(--color-su-brick)]">Source:</span>
          <span className="text-[var(--color-su-black)] capitalize">
            {data.source}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-[var(--color-su-brick)]">Page:</span>
          <span className="text-[var(--color-su-black)]">{data.page}</span>
        </div>
      </div>
    </Frame>
  );
}

