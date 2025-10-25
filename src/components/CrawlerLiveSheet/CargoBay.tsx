import { RoundedBox } from '../shared/RoundedBox'
import { AddStatButton } from '../shared/AddStatButton'
import { DynamicBay } from '../shared/DynamicBay'
import type { CargoItem } from '../../types/database'
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
      borderColor="border.builder.crawler"
      matchBorder={false}
      borderWidth="4px"
      justifyContent="flex-start"
      borderRadius="2xl"
      title="Storage"
      titleRotation={damaged ? titleRotation : 0}
      rightContent={<AddStatButton onClick={onAddCargo} label="Add Cargo" disabled={disabled} />}
      padding={4}
      disabled={disabled}
    >
      <DynamicBay items={cargo} maxCapacity={54} onRemove={onRemoveCargo} disabled={disabled} />
    </RoundedBox>
  )
}
