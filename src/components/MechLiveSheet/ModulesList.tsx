import { useHydratedMech } from '../../hooks/mech'
import { useManageMechSystemsAndModules } from '../../hooks/mech/useManageMechSystemsAndModules'
import { MechEntityList } from './MechEntityList'

interface ModulesListProps {
  id: string
  /** Whether the component is disabled */
  disabled?: boolean
}

export function ModulesList({ id, disabled = false }: ModulesListProps) {
  const { modules, selectedChassis, usedModuleSlots } = useHydratedMech(id)
  const totalModuleSlots = selectedChassis?.stats.moduleSlots ?? 0
  const { handleRemoveModule, handleAddModule } = useManageMechSystemsAndModules(id)
  return (
    <MechEntityList
      title="Modules"
      schemaName="modules"
      entityIds={modules.map((m) => m.ref.id)}
      usedSlots={usedModuleSlots}
      totalSlots={totalModuleSlots}
      onRemove={handleRemoveModule}
      onAdd={handleAddModule}
      disabled={disabled}
    />
  )
}
