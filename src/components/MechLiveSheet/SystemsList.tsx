import type { SURefChassis } from 'salvageunion-reference'
import { useHydratedMech } from '../../hooks/mech'
import { useManageMechSystemsAndModules } from '../../hooks/mech/useManageMechSystemsAndModules'
import { MechEntityList } from './MechEntityList'

interface SystemsListProps {
  id: string
  /** Whether the component is disabled */
  disabled?: boolean
}

export function SystemsList({ id, disabled = false }: SystemsListProps) {
  const { systems, selectedChassis, usedSystemSlots } = useHydratedMech(id)
  const chassisRef = selectedChassis?.ref as SURefChassis | undefined
  const totalSystemSlots = chassisRef?.stats.systemSlots ?? 0
  const { handleRemoveSystem, handleAddSystem } = useManageMechSystemsAndModules(id)

  return (
    <MechEntityList
      title="Systems"
      schemaName="systems"
      entityIds={systems.map((s) => s.ref.id)}
      usedSlots={usedSystemSlots}
      totalSlots={totalSystemSlots}
      onRemove={handleRemoveSystem}
      onAdd={handleAddSystem}
      disabled={disabled}
    />
  )
}
