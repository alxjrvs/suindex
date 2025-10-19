import type { ReactElement } from "react";
import type { DataItem } from "../types/schema";

interface ItemDetailProps {
  item: DataItem;
  onClose: () => void;
}

export default function ItemDetail({ item, onClose }: ItemDetailProps) {
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

  return (
    <div
      className="fixed inset-0 bg-[var(--color-su-black)] bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-su-white)] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-[var(--color-su-light-blue)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[var(--color-su-light-blue)] px-6 py-4 border-b border-[var(--color-su-blue)] flex justify-between items-center">
          <h3 className="text-xl font-bold text-[var(--color-su-black)]">
            {(item.name as string) || "Item Details"}
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--color-su-brick)] hover:text-[var(--color-su-orange)] text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-4">
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
                  className="border-b border-[var(--color-su-light-blue)] pb-4 last:border-b-0"
                >
                  <div className="font-semibold text-[var(--color-su-black)] mb-2 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                  <div className="text-[var(--color-su-black)]">
                    {formatValue(value)}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-[var(--color-su-light-blue)] px-6 py-4 border-t border-[var(--color-su-blue)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[var(--color-su-orange)] text-[var(--color-su-white)] rounded-lg hover:bg-[var(--color-su-brick)] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
