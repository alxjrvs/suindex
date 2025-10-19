import { Frame } from "./shared/Frame";

interface AbilityTreeRequirementData {
  tree: string;
  requirement: string[];
  page: number;
}

interface AbilityTreeRequirementDisplayProps {
  data: AbilityTreeRequirementData;
}

export function AbilityTreeRequirementDisplay({
  data,
}: AbilityTreeRequirementDisplayProps) {
  // Determine header color based on tree type
  const getHeaderColor = () => {
    if (data.tree.toLowerCase().includes("legendary")) {
      return "var(--color-su-pink)";
    } else if (
      data.tree.toLowerCase().includes("advanced") ||
      data.tree.toLowerCase().includes("hybrid")
    ) {
      return "var(--color-su-brick)";
    }
    return "var(--color-su-orange)";
  };

  return (
    <Frame
      header={`${data.tree} Tree`}
      headerColor={getHeaderColor()}
      showSidebar={false}
    >
      {/* Requirements */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-[var(--color-su-brick)]">
          Requirements
        </h3>
        <div className="bg-[var(--color-su-white)] border border-[var(--color-su-black)] rounded p-3">
          <div className="text-[var(--color-su-black)]">
            <span className="font-bold text-[var(--color-su-brick)]">
              Must have all abilities from:{" "}
            </span>
            {data.requirement.map((req, index) => (
              <span key={index}>
                {index > 0 && ", "}
                <span className="font-bold">{req}</span>
              </span>
            ))}
            {" tree"}
            {data.requirement.length > 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Page Reference */}
      <div className="bg-[var(--color-su-white)] border border-[var(--color-su-black)] rounded p-3">
        <span className="font-bold text-[var(--color-su-brick)]">Page:</span>
        <span className="text-[var(--color-su-black)] ml-2">{data.page}</span>
      </div>
    </Frame>
  );
}

