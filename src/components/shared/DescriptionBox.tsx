interface DescriptionBoxProps {
  description: string
}

export function DescriptionBox({ description }: DescriptionBoxProps) {
  return (
    <div className="mb-4 p-3 border-2 border-[var(--color-su-black)] bg-[var(--color-su-white)]">
      <p className="text-[var(--color-su-black)]">{description}</p>
    </div>
  )
}
