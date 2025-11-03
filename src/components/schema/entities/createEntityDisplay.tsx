import type { ComponentType } from 'react'
import type { SURefEntity, SURefMetaSchemaName } from 'salvageunion-reference'
import { EntityDisplay } from '../../entity/EntityDisplay'
import { ENTITY_DISPLAY_CONFIGS } from './entityDisplayConfig'

interface EntityDisplayProps {
  data: SURefEntity
  compact?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean
  onClick?: () => void
  hideActions?: boolean
}

/**
 * Factory function to create simple entity display components from configuration.
 * This eliminates the need for individual wrapper files for simple displays.
 *
 * @param schemaName - The schema name (e.g., 'npcs', 'creatures', etc.)
 * @returns A display component configured for the specified entity type
 */
export function createEntityDisplay(
  schemaName: SURefMetaSchemaName
): ComponentType<EntityDisplayProps> {
  const Component = ({
    data,
    compact = false,
    collapsible = false,
    defaultExpanded = true,
    onClick,
    hideActions = false,
  }: EntityDisplayProps) => {
    const config = ENTITY_DISPLAY_CONFIGS[schemaName] || {}
    return (
      <EntityDisplay
        schemaName={schemaName}
        data={data}
        compact={compact}
        collapsible={collapsible}
        defaultExpanded={defaultExpanded}
        onClick={onClick}
        hideActions={hideActions}
        {...config}
      />
    )
  }
  Component.displayName = `${schemaName}Display`
  return Component
}
