import { StatDisplay } from '../../StatDisplay'

type SidebarStatsProps = {
  slotsRequired?: number
  salvageValue?: number
  compact: boolean
}

export function SidebarStats({ slotsRequired, salvageValue, compact }: SidebarStatsProps) {
  return (
    <>
      {slotsRequired && <StatDisplay label="Slots" value={slotsRequired} compact={compact} />}
      {salvageValue && (
        <StatDisplay label="Salvage" bottomLabel="Value" value={salvageValue} compact={compact} />
      )}
    </>
  )
}
