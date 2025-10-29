import { MechEntityList } from './MechEntityList'

interface SystemsListProps {
  /** Array of System IDs */
  systems: string[]
  /** Number of used system slots */
  usedSystemSlots: number
  /** Total available system slots */
  totalSystemSlots: number
  /** Callback when a system is removed */
  onRemoveSystem: (id: string) => void
  /** Callback when a system is added */
  onAddSystem: (id: string) => void
  /** Whether the component is disabled */
  disabled?: boolean
}

export function SystemsList({
  systems,
  usedSystemSlots,
  totalSystemSlots,
  onRemoveSystem,
  onAddSystem,
  disabled = false,
}: SystemsListProps) {
  return (
    <MechEntityList
      title="Systems"
      schemaName="systems"
      entityIds={systems}
      usedSlots={usedSystemSlots}
      totalSlots={totalSystemSlots}
      onRemove={onRemoveSystem}
      onAdd={onAddSystem}
      disabled={disabled}
    />
  )
}
