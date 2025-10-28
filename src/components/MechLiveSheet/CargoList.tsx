import { StatDisplay } from '../StatDisplay'
import { RoundedBox } from '../shared/RoundedBox'
import { DynamicBay } from '../shared/DynamicBay'
import type { CargoItem } from '../../types/common'

interface CargoListProps {
  cargo: CargoItem[]
  totalCargo: number
  maxCargo: number
  canAddCargo: boolean
  onRemove: (id: string) => void
  onAddClick: (position: { row: number; col: number }) => void
  disabled?: boolean
}

export function CargoList({
  cargo,
  totalCargo,
  maxCargo,
  canAddCargo,
  onRemove,
  onAddClick,
  disabled = false,
}: CargoListProps) {
  return (
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
        onRemove={onRemove}
        onAddClick={canAddCargo ? onAddClick : undefined}
        disabled={disabled}
      />
    </RoundedBox>
  )
}
