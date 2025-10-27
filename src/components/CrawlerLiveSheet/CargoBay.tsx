import { RoundedBox } from '../shared/RoundedBox'
import { AddStatButton } from '../shared/AddStatButton'
import { DynamicBay } from '../shared/DynamicBay'
import type { CargoItem } from '../../types/common'
import { useMemo } from 'react'
import { getTiltRotation } from '../../utils/tiltUtils'

interface CargoBayProps {
  cargo: CargoItem[]
  onAddCargo: () => void
  onRemoveCargo: (id: string) => void
  damaged?: boolean
  disabled?: boolean
}

export function CargoBay({
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
      rightContent={<AddStatButton onClick={onAddCargo} label="Add Cargo" disabled={disabled} />}
      disabled={disabled}
    >
      <DynamicBay items={cargo} maxCapacity={54} onRemove={onRemoveCargo} disabled={disabled} />
    </RoundedBox>
  )
}
