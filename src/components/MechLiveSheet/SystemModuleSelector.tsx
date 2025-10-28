import type { SURefSchemaName } from 'salvageunion-reference'
import { EntitySelectionModal } from '../entity/EntitySelectionModal'

interface SystemModuleSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectSystem: (systemId: string) => void
  onSelectModule: (moduleId: string) => void
}

export function SystemModuleSelector({
  isOpen,
  onClose,
  onSelectSystem,
  onSelectModule,
}: SystemModuleSelectorProps) {
  const handleSelect = (entityId: string, schemaName: SURefSchemaName) => {
    if (schemaName === 'systems') {
      onSelectSystem(entityId)
    } else if (schemaName === 'modules') {
      onSelectModule(entityId)
    }
    onClose()
  }

  return (
    <EntitySelectionModal
      isOpen={isOpen}
      onClose={onClose}
      schemaNames={['systems', 'modules']}
      onSelect={handleSelect}
      title="Add System or Module"
    />
  )
}
