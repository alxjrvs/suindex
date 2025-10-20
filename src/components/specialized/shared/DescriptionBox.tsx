interface DescriptionBoxProps {
  description: string;
}

/**
 * Reusable component for displaying description in a consistent box style
 */
export function DescriptionBox({ description }: DescriptionBoxProps) {
  return (
    <div className="mb-4 p-3 border-2 border-[var(--color-su-black)] bg-[var(--color-su-white)]">
      <p className="text-[var(--color-su-black)]">{description}</p>
    </div>
  );
}

