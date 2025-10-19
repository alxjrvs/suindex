interface DataValue {
  value: string | number;
  cost?: boolean;
  type?: string;
}

interface DataListProps {
  values: DataValue[];
  textColor?: string;
  invert?: boolean;
}

export function DataList({
  values,
  textColor = "var(--color-su-black)",
  invert = false,
}: DataListProps) {
  if (values.length === 0) return null;

  return (
    <span className="inline-flex flex-wrap gap-2 items-center">
      {values.map((item, index) => (
        <span key={index} className="inline-flex items-center gap-1">
          {index > 0 && (
            <span style={{ color: textColor }} className="opacity-50">
              •
            </span>
          )}
          <span
            style={{ color: textColor }}
            className={`${item.cost ? "font-bold" : ""} ${
              invert ? "opacity-90" : ""
            }`}
          >
            {item.value}
          </span>
        </span>
      ))}
    </span>
  );
}
