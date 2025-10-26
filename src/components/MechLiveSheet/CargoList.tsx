import { Flex } from '@chakra-ui/react'
import { StatDisplay } from '../StatDisplay'
import { AddStatButton } from '../shared/AddStatButton'
import { RoundedBox } from '../shared/RoundedBox'
import { DynamicBay } from '../shared/DynamicBay'
import type { CargoItem } from '../../types/common'

interface CargoListProps {
  cargo: CargoItem[]
  totalCargo: number
  maxCargo: number
  canAddCargo: boolean
  onRemove: (id: string) => void
  onAddClick: () => void
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
        <Flex gap={2} alignItems="center">
          <AddStatButton onClick={onAddClick} disabled={disabled || !canAddCargo} />
          <StatDisplay label="Cargo" value={`${totalCargo}/${maxCargo}`} disabled={disabled} />
        </Flex>
      }
    >
      <DynamicBay items={cargo} maxCapacity={maxCargo} onRemove={onRemove} disabled={disabled} />
    </RoundedBox>
  )
}
