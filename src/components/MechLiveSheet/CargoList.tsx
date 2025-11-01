import { StatDisplay } from '../StatDisplay'
import { RoundedBox } from '../shared/RoundedBox'
import { DynamicBay } from '../shared/DynamicBay'
import { CargoModal } from '../shared/CargoModal'
import { useState } from 'react'
import { useManageMechCargo } from '../../hooks/mech/useManageMechCargo'
import { useHydratedMech } from '../../hooks/mech'

interface CargoListProps {
  disabled?: boolean
  id: string
}

export function CargoList({ id, disabled = false }: CargoListProps) {
  const { cargo, selectedChassis, totalCargo } = useHydratedMech(id)
  const maxCargo = selectedChassis?.stats?.cargoCap || 0
  const canAddCargo = !!selectedChassis
  const [isCargoModalOpen, setIsCargoModalOpen] = useState(false)
  const [cargoPosition, setCargoPosition] = useState<{ row: number; col: number } | null>(null)
  const { handleAddCargo, handleRemoveCargo } = useManageMechCargo(id)
  const onAddClick = (position: { row: number; col: number }) => {
    setCargoPosition(position)
    setIsCargoModalOpen(true)
  }
  return (
    <>
      <RoundedBox
        bg="bg.builder.mech"
        title="Cargo"
        disabled={disabled}
        rightContent={
          <StatDisplay label="Cargo" value={totalCargo} outOfMax={maxCargo} disabled={disabled} />
        }
      >
        <DynamicBay
          items={cargo}
          maxCapacity={maxCargo}
          onRemove={handleRemoveCargo}
          onAddClick={canAddCargo ? onAddClick : undefined}
          disabled={disabled}
        />
      </RoundedBox>
      <CargoModal
        isOpen={isCargoModalOpen}
        onClose={() => {
          setIsCargoModalOpen(false)
          setCargoPosition(null)
        }}
        onAdd={handleAddCargo}
        maxCargo={maxCargo}
        currentCargo={totalCargo}
        position={cargoPosition}
      />
    </>
  )
}
