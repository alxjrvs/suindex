import { RoundedBox } from '../shared/RoundedBox'
import { DynamicBay } from '../shared/DynamicBay'
import type { CargoItem } from '../../types/common'
import { useMemo } from 'react'
import { getTiltRotation } from '../../utils/tiltUtils'

interface CargoBayProps {
  cargo: CargoItem[]
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
      title="Storage"
      titleRotation={damaged ? titleRotation : 0}
      disabled={disabled}
    >
      <DynamicBay
        items={cargo}
        maxCapacity={54}
        onRemove={onRemoveCargo}
        onAddClick={onAddCargo}
        disabled={disabled}
        singleCellMode
      />
    </RoundedBox>
  )
}
