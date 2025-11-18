import type { ReactNode } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefSchemaName } from 'salvageunion-reference'
import { HoverCard, Portal } from '@chakra-ui/react'
import { EntityDisplay } from './EntityDisplay'

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
  const entity = SalvageUnionReference.get(schemaName, entityId)

  if (!entity) {
    return <>{children}</>
  }

  return (
    <HoverCard.Root openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCard.Trigger asChild>
        <span
          style={{
            margin: 0,
            lineHeight: 1,
            cursor: 'help',
            display: 'inline-flex',
            flexShrink: 0,
            flexGrow: 0,
          }}
        >
          {children}
        </span>
      </HoverCard.Trigger>
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
