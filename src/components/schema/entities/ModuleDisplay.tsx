import type { SURefModule } from 'salvageunion-reference'
import { EntityDisplay } from '../../shared/EntityDisplay'
import { ENTITY_DISPLAY_CONFIGS } from './entityDisplayConfig'

interface ModuleDisplayProps {
  data: SURefModule
}

/**
 * Module display component.
 * Uses the factory pattern configuration for consistent styling.
 */
export function ModuleDisplay({ data }: ModuleDisplayProps) {
  const config = ENTITY_DISPLAY_CONFIGS.Module || {}
  return <EntityDisplay entityName="Module" data={data} {...config} />
}
