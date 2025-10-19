import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import type { SchemaInfo, DataItem } from "../types/schema";

interface DataTableProps {
  data: DataItem[];
  schema: SchemaInfo;
}

export default function DataTable({ data, schema }: DataTableProps) {
  const { schemaId } = useParams<{ schemaId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Get all unique fields from the data
  const allFields = useMemo(() => {
    if (data.length === 0) return [];
    const fieldSet = new Set<string>();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => fieldSet.add(key));
    });
    return Array.from(fieldSet).sort();
  }, [data]);

  // Get unique values for each field (for filter dropdowns)
  const fieldValues = useMemo(() => {
    const values: Record<string, Set<unknown>> = {};
    allFields.forEach((field) => {
      values[field] = new Set();
      data.forEach((item) => {
        const value = item[field];
        if (value !== undefined && value !== null && value !== "") {
          // For arrays, add each element
          if (Array.isArray(value)) {
            value.forEach((v) => {
              if (
                typeof v === "string" ||
                typeof v === "number" ||
                typeof v === "boolean"
              ) {
                values[field].add(v);
              }
            });
          } else if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
          ) {
            values[field].add(value);
          }
        }
      });
    });
    return values;
  }, [data, allFields]);

  // Filter and search data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = item.name
          ?.toString()
          .toLowerCase()
          .includes(searchLower);
        const descMatch = item.description
          ?.toString()
          .toLowerCase()
          .includes(searchLower);
        if (!nameMatch && !descMatch) return false;
      }

      // Field filters
      for (const [field, filterValue] of Object.entries(filters)) {
        if (!filterValue) continue;

        const itemValue = item[field];
        if (itemValue === undefined || itemValue === null) return false;

        // Handle arrays
        if (Array.isArray(itemValue)) {
          if (!itemValue.some((v) => v?.toString() === filterValue))
            return false;
        } else if (itemValue.toString() !== filterValue) {
          return false;
        }
      }

      return true;
    });
  }, [data, searchTerm, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      let comparison = 0;
      if (typeof aVal === "string" && typeof bVal === "string") {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === "number" && typeof bVal === "number") {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatValue = (value: unknown): string => {
    if (value === undefined || value === null) return "-";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  // Determine which fields to show as columns (prioritize required fields)
  const displayFields = useMemo(() => {
    const fields = [
      "name",
      ...schema.requiredFields.filter((f) => f !== "name" && f !== "id"),
    ];
    // Add a few more common fields if they exist
    ["description", "effect", "type", "category"].forEach((f) => {
      if (allFields.includes(f) && !fields.includes(f)) {
        fields.push(f);
      }
    });
    return fields
      .filter((f) => allFields.includes(f) && f !== "id") // Exclude id field
      .slice(0, 6); // Limit to 6 columns
  }, [allFields, schema.requiredFields]);

  return (
    <div className="p-6">
      {/* Search and Filters */}
      <div className="mb-6 bg-[var(--color-su-white)] p-4 rounded-lg shadow border border-[var(--color-su-light-blue)]">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-[var(--color-su-light-blue)] rounded-lg focus:ring-2 focus:ring-[var(--color-su-orange)] focus:border-transparent bg-[var(--color-su-white)] text-[var(--color-su-black)]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allFields
            .filter((field) => {
              // Only show techLevel and class filters
              const allowedFields = ["techLevel", "class"];
              return (
                allowedFields.includes(field) && fieldValues[field].size > 1
              );
            })
            .map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-[var(--color-su-black)] mb-1 capitalize">
                  {field === "techLevel"
                    ? "Tech Level"
                    : field.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <select
                  value={filters[field] || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, [field]: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[var(--color-su-light-blue)] rounded-lg focus:ring-2 focus:ring-[var(--color-su-orange)] focus:border-transparent text-sm bg-[var(--color-su-white)] text-[var(--color-su-black)]"
                >
                  <option value="">All</option>
                  {Array.from(fieldValues[field])
                    .sort()
                    .map((value) => (
                      <option key={String(value)} value={String(value)}>
                        {String(value)}
                      </option>
                    ))}
                </select>
              </div>
            ))}
        </div>

        <div className="mt-4 text-sm text-[var(--color-su-brick)]">
          Showing {sortedData.length} of {data.length} items
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[var(--color-su-white)] rounded-lg shadow overflow-hidden border border-[var(--color-su-light-blue)]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--color-su-light-blue)]">
            <thead className="bg-[var(--color-su-light-blue)]">
              <tr>
                {displayFields.map((field) => (
                  <th
                    key={field}
                    onClick={() => handleSort(field)}
                    className="px-6 py-3 text-left text-xs font-medium text-[var(--color-su-black)] uppercase tracking-wider cursor-pointer hover:bg-[var(--color-su-blue)]"
                  >
                    <div className="flex items-center gap-1">
                      {field.replace(/([A-Z])/g, " $1").trim()}
                      {sortField === field && (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-[var(--color-su-white)] divide-y divide-[var(--color-su-light-blue)]">
              {sortedData.map((item, index) => {
                return (
                  <tr
                    key={item.id || index}
                    className="hover:bg-[var(--color-su-light-orange)] cursor-pointer transition-colors"
                    onClick={() => {
                      window.location.href = `/schema/${schemaId}/item/${item.id}`;
                    }}
                  >
                    {displayFields.map((field) => (
                      <td
                        key={field}
                        className="px-6 py-6 text-sm text-[var(--color-su-black)]"
                      >
                        <div
                          className="max-w-xs truncate"
                          title={formatValue(item[field])}
                        >
                          {formatValue(item[field])}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
