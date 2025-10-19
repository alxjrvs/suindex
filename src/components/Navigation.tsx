import { useParams, useNavigate } from "react-router-dom";
import type { SchemaInfo } from "../types/schema";

interface NavigationProps {
  schemas: SchemaInfo[];
}

export default function Navigation({ schemas }: NavigationProps) {
  const { schemaId } = useParams<{ schemaId: string }>();
  const navigate = useNavigate();

  return (
    <nav className="w-64 bg-[var(--color-su-white)] shadow-lg overflow-y-auto border-r border-[var(--color-su-light-blue)]">
      <button
        onClick={() => navigate("/")}
        className="w-full text-left block p-4 border-b border-[var(--color-su-light-blue)] hover:bg-[var(--color-su-light-orange)] transition-colors bg-transparent border-none cursor-pointer"
      >
        <h1 className="text-xl font-bold text-[var(--color-su-black)]">
          Salvage Union
        </h1>
        <p className="text-sm text-[var(--color-su-brick)]">Data Viewer</p>
      </button>
      <ul className="py-2">
        {schemas.map((schema) => (
          <li key={schema.id}>
            <button
              onClick={() => navigate(`/schema/${schema.id}`)}
              className={`w-full text-left block px-4 py-3 hover:bg-[var(--color-su-light-orange)] transition-colors bg-transparent border-none cursor-pointer ${
                schemaId === schema.id
                  ? "bg-[var(--color-su-light-blue)] border-l-4 border-[var(--color-su-orange)] text-[var(--color-su-black)] font-medium"
                  : "text-[var(--color-su-black)]"
              }`}
            >
              <div>{schema.title.replace("Salvage Union ", "")}</div>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
