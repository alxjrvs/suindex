import type { SURefEquipment } from 'salvageunion-reference'
import { EntityDisplay } from '../../shared/EntityDisplay'
import { ENTITY_DISPLAY_CONFIGS } from './entityDisplayConfig'

interface EquipmentDisplayProps {
  data: SURefEquipment
}

/**
 * Equipment display component.
 * Uses the factory pattern configuration for consistent styling.
 */
export function EquipmentDisplay({ data }: EquipmentDisplayProps) {
  const config = ENTITY_DISPLAY_CONFIGS.Equipment || {}
  return <EntityDisplay entityName="Equipment" data={data} {...config} />
}
