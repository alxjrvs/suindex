import { EntitySelectionModal } from '../shared/EntitySelectionModal'

interface EquipmentSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectEquipment: (equipmentId: string) => void
}

export function EquipmentSelector({ isOpen, onClose, onSelectEquipment }: EquipmentSelectorProps) {
  return (
    <EntitySelectionModal
      isOpen={isOpen}
      onClose={onClose}
      entityTypes={['Equipment']}
      onSelect={(equipmentId) => onSelectEquipment(equipmentId)}
      title="Add Equipment"
      showTechLevelFilter={true}
    />
  )
}
