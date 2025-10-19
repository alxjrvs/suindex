import { DataList } from "./DataList";

interface DataValue {
  value: string | number;
  cost?: boolean;
  type?: string;
}

interface ActionOption {
  label: string;
  value: string;
}

interface ActionData {
  name?: string;
  description?: string;
  activationCost?: number | string;
  range?: string;
  actionType?: string;
  options?: ActionOption[];
  notes?: string;
}

interface ActionDisplayProps {
  action: ActionData;
  activationCurrency?: string;
}

function generateDataListValues(action: ActionData): DataValue[] {
  const details: DataValue[] = [];

  // Activation cost is now shown in the badge, not in the data list

  if (action.range) {
    details.push({ value: action.range });
  }

  if (action.actionType) {
    details.push({ value: action.actionType });
  }

  return details;
}

export function ActionDisplay({
  action,
  activationCurrency = "AP",
}: ActionDisplayProps) {
  const dataListValues = generateDataListValues(action);
  const description = action.description?.replaceAll("•", "\n•");

  return (
    <div className="border-2 border-[var(--color-su-black)] bg-[var(--color-su-white)] p-3 space-y-2">
      {/* Action Header with Activation Cost Badge */}
      <div className="flex items-center gap-1">
        {action.activationCost && (
          <div className="flex items-center" style={{ overflow: "visible" }}>
            {/* Black badge with white text */}
            <div
              className="bg-[var(--color-su-black)] text-[var(--color-su-white)] font-bold uppercase flex items-center justify-center"
              style={{
                fontSize: "15px",
                paddingLeft: "4px",
                paddingRight: "4px",
                paddingTop: "2px",
                paddingBottom: "2px",
                height: "20px",
                zIndex: 2,
              }}
            >
              {action.activationCost === "Variable"
                ? "Variable"
                : `${action.activationCost} ${activationCurrency}`}
            </div>
            {/* Triangle arrow pointing right */}
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent",
                borderLeft: "10px solid var(--color-su-black)",
                marginLeft: "0px",
                zIndex: 1,
              }}
            />
          </div>
        )}
        {action.name && (
          <span className="font-bold text-[var(--color-su-black)] text-[17px]">
            {action.name}
          </span>
        )}
      </div>

      {/* Data List */}
      {dataListValues.length > 0 && (
        <div>
          <DataList values={dataListValues} />
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="text-[var(--color-su-black)] whitespace-pre-line">
          {description}
        </p>
      )}

      {action.options && action.options.length > 0 && (
        <div className="space-y-1 ml-4">
          {action.options.map((option, index) => {
            const label =
              typeof option === "string"
                ? ""
                : option.label || option.value || "";
            const value =
              typeof option === "string" ? option : option.value || "";

            return (
              <div key={index} className="text-[var(--color-su-black)]">
                {
                  <span className="font-bold">
                    {label}
                    {label.includes("•") ? "" : "-"}
                  </span>
                }
                {value && (
                  <>
                    {label && " "}
                    {value}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {action.notes && (
        <p className="text-sm text-[var(--color-su-black)] italic mt-2">
          {action.notes}
        </p>
      )}
    </div>
  );
}
