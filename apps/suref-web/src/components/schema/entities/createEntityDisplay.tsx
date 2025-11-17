import type { ComponentType } from 'react'
import type { SURefEntity, SURefSchemaName } from 'salvageunion-reference'
import { EntityDisplay } from '../../entity/EntityDisplay'

interface EntityDisplayProps {
  data: SURefEntity
  compact?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean
  onClick?: () => void
  hideActions?: boolean
}

/**
 * Factory function to create simple entity display components.
 * EntityDisplay now handles all schema-specific logic internally.
 *
 * @param schemaName - The schema name (e.g., 'npcs', 'creatures', etc.)
 * @returns A display component configured for the specified entity type
 */
export function createEntityDisplay(
  schemaName: SURefSchemaName
): ComponentType<EntityDisplayProps> {
  const Component = ({
    data,
    compact = false,
    collapsible = false,
    defaultExpanded = true,
    onClick,
    hideActions = false,
  }: EntityDisplayProps) => {
    return (
      <EntityDisplay
        schemaName={schemaName}
        data={data}
        compact={compact}
        collapsible={collapsible}
        defaultExpanded={defaultExpanded}
        onClick={onClick}
        hideActions={hideActions}
      />
    )
  }
  Component.displayName = `${schemaName}Display`
  return Component
}
