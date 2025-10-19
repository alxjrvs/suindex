import { Link, useParams } from "react-router-dom";
import type { SchemaInfo } from "../types/schema";

interface NavigationProps {
  schemas: SchemaInfo[];
}

export default function Navigation({ schemas }: NavigationProps) {
  const { schemaId } = useParams<{ schemaId: string }>();

  return (
    <nav className="w-64 bg-[var(--color-su-white)] shadow-lg overflow-y-auto border-r border-[var(--color-su-light-blue)]">
      <Link
        to="/"
        className="block p-4 border-b border-[var(--color-su-light-blue)] hover:bg-[var(--color-su-light-orange)] transition-colors"
      >
        <h1 className="text-xl font-bold text-[var(--color-su-black)]">
          Salvage Union
        </h1>
        <p className="text-sm text-[var(--color-su-brick)]">Data Viewer</p>
      </Link>
      <ul className="py-2">
        {schemas.map((schema) => (
          <li key={schema.id}>
            <Link
              to={`/schema/${schema.id}`}
              className={`block px-4 py-3 hover:bg-[var(--color-su-light-orange)] transition-colors ${
                schemaId === schema.id
                  ? "bg-[var(--color-su-light-blue)] border-l-4 border-[var(--color-su-orange)] text-[var(--color-su-black)] font-medium"
                  : "text-[var(--color-su-black)]"
              }`}
            >
              <div>{schema.title.replace("Salvage Union ", "")}</div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
