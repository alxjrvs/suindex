import { RoundedBox } from '../shared/RoundedBox'
import { DynamicBay } from '../shared/DynamicBay'
import type { HydratedCargo } from '../../types/hydrated'
import { useMemo } from 'react'
import { getTiltRotation } from '../../utils/tiltUtils'

interface CargoBayProps {
  cargo: HydratedCargo[]
  onAddCargo: (position: { row: number; col: number }) => void
  onRemoveCargo: (id: string) => void
  damaged?: boolean
  disabled?: boolean
}

export function StorageCargoBay({
  cargo,
  onAddCargo,
  onRemoveCargo,
  damaged = false,
  disabled = false,
}: CargoBayProps) {
  const titleRotation = useMemo(() => getTiltRotation(), [])

  return (
    <RoundedBox
      bg={damaged ? 'su.grey' : 'bg.builder.crawler'}
      w="full"
      justifyContent="flex-start"
      titleRotation={damaged ? titleRotation : 0}
      disabled={disabled}
    >
      <DynamicBay
        items={cargo}
        maxCapacity={25}
        onRemove={onRemoveCargo}
        onAddClick={onAddCargo}
        disabled={disabled}
        singleCellMode
      />
    </RoundedBox>
  )
}
