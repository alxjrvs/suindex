import type { ReactNode } from 'react'
import type { SURefSchemaName } from 'salvageunion-reference'
import { HoverCard, Portal } from '@chakra-ui/react'
import { EntityDisplay } from './EntityDisplay'
import { lookupEntityByRef } from '../../utils/referenceUtils'

interface EntityDisplayTooltipProps {
  schemaName: SURefSchemaName
  entityId: string
  children: ReactNode
  /** Minimum width for the tooltip content (default: 340px) */
  minWidth?: string
  /** Maximum width for the tooltip content (default: 400px) */
  maxWidth?: string
  /** Whether to show an arrow pointing to the trigger (default: false) */
  showArrow?: boolean
  /** Delay before showing tooltip in ms (default: 200) */
  openDelay?: number
  /** Delay before hiding tooltip in ms (default: 100) */
  closeDelay?: number
}

/**
 * EntityDisplayTooltip - Shows EntityDisplay content in a hover card
 * Wraps children and displays entity details on hover
 *
 * @example
 * <EntityDisplayTooltip schemaName="systems" entityId="laser-cannon-id">
 *   <Text>Hover me to see details</Text>
 * </EntityDisplayTooltip>
 */
export function EntityDisplayTooltip({
  schemaName,
  entityId,
  children,
  showArrow = false,
  openDelay = 200,
  closeDelay = 100,
}: EntityDisplayTooltipProps) {
  const ref = `${schemaName}||${entityId}`
  const entity = lookupEntityByRef(ref)

  // If entity doesn't exist, just render children without tooltip
  if (!entity) {
    return <>{children}</>
  }

  return (
    <HoverCard.Root openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content
            minW="800px"
            maxH="80vh"
            overflowY="auto"
            bg="transparent"
            border="none"
            shadow="2xl"
            p={0}
          >
            {showArrow && <HoverCard.Arrow />}
            <EntityDisplay schemaName={schemaName} data={entity} collapsible={false} />
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  )
}
