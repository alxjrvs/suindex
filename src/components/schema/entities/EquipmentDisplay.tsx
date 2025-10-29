import type { ReactNode } from 'react'
import type { SURefEquipment } from 'salvageunion-reference'
import { EntityDisplay } from '../../entity/EntityDisplay'
import { ENTITY_DISPLAY_CONFIGS } from './entityDisplayConfig'

interface EquipmentDisplayProps {
  data: SURefEquipment
  onClick?: () => void
  showSelectButton?: boolean
  selectButtonText?: string
  children?: ReactNode
}

/**
 * Equipment display component.
 * Uses the factory pattern configuration for consistent styling.
 */
export function EquipmentDisplay({
  data,
  onClick,
  showSelectButton = false,
  selectButtonText,
  children,
}: EquipmentDisplayProps) {
  const config = ENTITY_DISPLAY_CONFIGS.equipment || {}
  return (
    <EntityDisplay
      schemaName="equipment"
      data={data}
      onClick={onClick}
      showSelectButton={showSelectButton}
      selectButtonText={selectButtonText}
      {...config}
    >
      {children}
    </EntityDisplay>
  )
}
