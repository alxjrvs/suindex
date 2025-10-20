interface PageReferenceDisplayProps {
  source: string
  page: number
}

export function PageReferenceDisplay({ source, page }: PageReferenceDisplayProps) {
  return (
    <div className="mt-4 pt-3 border-t-2 border-[var(--color-su-black)] text-sm text-[var(--color-su-black)]">
      <span className="font-bold uppercase">{source}</span> • Page {page}
    </div>
  )
}
