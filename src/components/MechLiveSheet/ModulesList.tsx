import { MechEntityList } from './MechEntityList'

interface ModulesListProps {
  /** Array of Module IDs */
  modules: string[]
  /** Number of used module slots */
  usedModuleSlots: number
  /** Total available module slots */
  totalModuleSlots: number
  /** Callback when a module is removed */
  onRemoveModule: (id: string) => void
  /** Callback when a module is added */
  onAddModule: (id: string) => void
  /** Whether the component is disabled */
  disabled?: boolean
}

export function ModulesList({
  modules,
  usedModuleSlots,
  totalModuleSlots,
  onRemoveModule,
  onAddModule,
  disabled = false,
}: ModulesListProps) {
  return (
    <MechEntityList
      title="Modules"
      schemaName="modules"
      entityIds={modules}
      usedSlots={usedModuleSlots}
      totalSlots={totalModuleSlots}
      onRemove={onRemoveModule}
      onAdd={onAddModule}
      disabled={disabled}
    />
  )
}

