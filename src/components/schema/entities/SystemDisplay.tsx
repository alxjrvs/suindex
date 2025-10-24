import type { SURefSystem } from 'salvageunion-reference'
import { EntityDisplay } from '../../shared/EntityDisplay'
import { ENTITY_DISPLAY_CONFIGS } from './entityDisplayConfig'

interface SystemDisplayProps {
  data: SURefSystem
}

/**
 * System display component.
 * Uses the factory pattern configuration for consistent styling.
 */
export function SystemDisplay({ data }: SystemDisplayProps) {
  const config = ENTITY_DISPLAY_CONFIGS.System || {}
  return <EntityDisplay entityName="System" data={data} {...config} />
}
