import type { ComponentType } from 'react'
import type { SURefEntity, SURefSchemaName } from 'salvageunion-reference'
import { EntityDisplay } from '../../shared/EntityDisplay'
import { ENTITY_DISPLAY_CONFIGS } from './entityDisplayConfig'

/**
 * Factory function to create simple entity display components from configuration.
 * This eliminates the need for individual wrapper files for simple displays.
 *
 * @param schemaName - The schema name (e.g., 'npcs', 'creatures', etc.)
 * @returns A display component configured for the specified entity type
 */
export function createEntityDisplay(
  schemaName: SURefSchemaName
): ComponentType<{ data: SURefEntity }> {
  const Component = ({ data }: { data: SURefEntity }) => {
    const config = ENTITY_DISPLAY_CONFIGS[schemaName] || {}
    return <EntityDisplay schemaName={schemaName} data={data} {...config} />
  }
  Component.displayName = `${schemaName}Display`
  return Component
}
