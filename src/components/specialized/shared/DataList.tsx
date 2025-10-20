import type { DataValue } from "../../../types/common";

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
          {item.cost ? (
            <span
              className="inline-flex items-center"
              style={{ overflow: "visible" }}
            >
              {/* Black badge with white text */}
              <span
                style={{
                  backgroundColor: "var(--color-su-black)",
                  color: "var(--color-su-white)",
                  fontSize: "12px",
                  paddingLeft: "4px",
                  paddingRight: "4px",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  height: "16px",
                  fontWeight: "bold",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.value}
              </span>
              {/* Triangle arrow pointing right */}
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "8px solid transparent",
                  borderBottom: "8px solid transparent",
                  borderLeft: "8px solid var(--color-su-black)",
                  marginLeft: "0px",
                  zIndex: 1,
                }}
              />
            </span>
          ) : (
            <span
              style={{ color: textColor }}
              className={`${invert ? "opacity-90" : ""}`}
            >
              {item.value}
            </span>
          )}
        </span>
      ))}
    </span>
  );
}
