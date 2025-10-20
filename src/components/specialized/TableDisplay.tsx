import { Frame } from './shared/Frame'
import { RollTableDisplay } from './shared/RollTableDisplay'

interface TableData {
  name: string
  source: string
  section: string
  rollTable: Record<string, string>
  page: number
}

interface TableDisplayProps {
  data: TableData
}

export function TableDisplay({ data }: TableDisplayProps) {
  return (
    <Frame header={data.name} headerColor="var(--color-su-orange)" showSidebar={false}>
      <div className="space-y-4">
        {/* Section Info */}
        <div className="bg-[var(--color-su-white)] border border-[var(--color-su-black)] rounded p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--color-su-brick)]">Section:</span>
            <span className="text-[var(--color-su-black)] capitalize">{data.section}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--color-su-brick)]">Source:</span>
            <span className="text-[var(--color-su-black)] capitalize">{data.source}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--color-su-brick)]">Page:</span>
            <span className="text-[var(--color-su-black)]">{data.page}</span>
          </div>
        </div>

        {/* Roll Table */}
        <RollTableDisplay rollTable={data.rollTable} showCommand={true} />
      </div>
    </Frame>
  )
}
