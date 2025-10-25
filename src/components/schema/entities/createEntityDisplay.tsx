import type { ComponentType } from 'react'
import type { SURefEntity, SURefEntityName } from 'salvageunion-reference'
import { EntityDisplay } from '../../shared/EntityDisplay'
import { ENTITY_DISPLAY_CONFIGS } from './entityDisplayConfig'

/**
 * Factory function to create simple entity display components from configuration.
 * This eliminates the need for individual wrapper files for simple displays.
 *
 * @param entityName - The entity type name (e.g., 'NPC', 'Creature', etc.)
 * @returns A display component configured for the specified entity type
 */
export function createEntityDisplay(
  entityName: SURefEntityName
): ComponentType<{ data: Record<string, unknown> }> {
  const Component = ({ data }: { data: SURefEntity }) => {
    const config = ENTITY_DISPLAY_CONFIGS[entityName] || {}
    return <EntityDisplay entityName={entityName} data={data} {...config} />
  }
  Component.displayName = `${entityName}Display`
  return Component as unknown as ComponentType<{ data: Record<string, unknown> }>
}
