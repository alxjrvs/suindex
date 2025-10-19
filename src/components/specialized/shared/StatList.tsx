interface Stat {
  label: string;
  value: string | number | undefined;
}

interface StatListProps {
  stats: Stat[];
  notes?: string;
  up?: boolean;
}

export function StatList({ stats, notes, up = false }: StatListProps) {
  return (
    <div>
      {!up && notes && (
        <div className="text-sm font-bold text-[var(--color-su-black)] mb-2">
          {notes}
        </div>
      )}
      <div
        className={`flex flex-row overflow-visible ${up ? "pt-20" : ""}`}
        style={{ overflow: "visible" }}
      >
        {stats.map((stat, index) => (
          <StatItem key={index} label={stat.label} value={stat.value} up={up} />
        ))}
      </div>
      {up && notes && (
        <div className="text-sm font-bold text-[var(--color-su-black)] mt-2">
          {notes}
        </div>
      )}
    </div>
  );
}

function StatItem({
  label,
  value,
  up,
}: {
  label: string;
  value: string | number | undefined;
  up: boolean;
}) {
  return (
    <div className="flex flex-row relative" style={{ overflow: "visible" }}>
      <StatLabel up={up}>{label}</StatLabel>
      <StatValue>{value ?? "-"}</StatValue>
    </div>
  );
}

function StatValue({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-[var(--color-su-white)] border-2 border-[var(--color-su-black)] flex items-center justify-center font-bold text-[var(--color-su-black)]"
      style={{
        width: "30px",
        height: "30px",
        minWidth: "30px",
        minHeight: "30px",
        maxWidth: "30px",
        maxHeight: "30px",
        zIndex: 3,
        overflow: "visible",
      }}
    >
      {children}
    </div>
  );
}

function StatLabel({
  children,
  up,
}: {
  children: React.ReactNode;
  up: boolean;
}) {
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        transform: "rotate(-45deg)",
        transformOrigin: "left",
        minWidth: "140px",
        height: "14px",
        zIndex: 2,
        overflow: "visible",
        ...(up
          ? {
              top: "0",
              left: "9px",
              justifyContent: "flex-start",
            }
          : {
              bottom: "-95px",
              left: "-75px",
              justifyContent: "flex-end",
            }),
      }}
    >
      <div
        className="bg-[var(--color-su-black)] text-[var(--color-su-white)] font-black text-[11px] uppercase whitespace-nowrap"
        style={{
          paddingRight: up ? "5px" : "22px",
          paddingLeft: up ? "22px" : "5px",
          paddingTop: "1px",
          textAlign: "right",
        }}
      >
        {children}
      </div>
    </div>
  );
}
