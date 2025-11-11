import type { ButtonProps } from '@chakra-ui/react'
import { type ReactNode, memo } from 'react'
import type { SURefEntity, SURefMetaSchemaName } from 'salvageunion-reference'
import { EntityDisplayContent } from './components/EntityDisplayContent'
import { EntityDisplayProvider } from './EntityDisplayProvider'

type EntityDisplayProps = {
  /** Entity data to display - only accepts SURefEntity (not SURefMetaAction or SURefMetaSystemModule) */
  data: SURefEntity | undefined
  /** Schema name for the entity */
  schemaName: SURefMetaSchemaName
  /** Optional header background color override */
  headerColor?: string
  /** Whether the ability is trained (affects header opacity for abilities) */
  dimHeader?: boolean
  /** Optional children to render in the content area */
  children?: ReactNode
  /** Optional click handler for the entity */
  onClick?: () => void
  /** Whether the entity is disabled (affects opacity and click behavior) */
  disabled?: boolean
  /** Whether the entity can be collapsed/expanded */
  collapsible?: boolean
  /** Default expanded state (only used if expanded is not controlled) */
  defaultExpanded?: boolean
  /** Controlled expanded state */
  expanded?: boolean
  /** Callback when expanded state changes */
  onToggleExpanded?: () => void
  /** Optional button configuration - if provided, renders a button at the bottom of the entity */
  buttonConfig?: ButtonProps & { children: ReactNode }
  /** Optional label displayed in the top-right corner */
  rightLabel?: string
  /** Whether to use compact styling */
  compact?: boolean
  /** Whether to hide the level display */
  hideLevel?: boolean
  /** Whether or not to show the actions */
  hideActions?: boolean
  /** User choices object matching the format sent to the API: Record<choiceId, "schemaName||entityId"> */
  userChoices?: Record<string, string> | null
  /** Callback when a choice is selected - if undefined, we're in schema page mode (not a live sheet) */
  onChoiceSelection?: (choiceId: string, value: string | undefined) => void
}

export const EntityDisplay = memo(function EntityDisplay({
  rightLabel,
  data,
  hideLevel = false,
  headerColor,
  dimHeader = false,
  children,
  onClick,
  disabled = false,
  collapsible = false,
  defaultExpanded = true,
  expanded,
  onToggleExpanded,
  buttonConfig,
  hideActions = false,
  schemaName,
  compact = false,
  userChoices,
  onChoiceSelection,
}: EntityDisplayProps) {
  if (!data) return null

  return (
    <EntityDisplayProvider
      data={data}
      defaultExpanded={defaultExpanded}
      expanded={expanded}
      schemaName={schemaName}
      compact={compact}
      headerColor={headerColor}
      dimHeader={dimHeader}
      disabled={disabled}
      hideActions={hideActions}
      collapsible={collapsible}
      onClick={onClick}
      hideLevel={hideLevel}
      rightLabel={rightLabel}
      buttonConfig={buttonConfig}
      userChoices={userChoices}
      onChoiceSelection={onChoiceSelection}
      onToggleExpanded={onToggleExpanded}
    >
      <EntityDisplayContent>{children}</EntityDisplayContent>
    </EntityDisplayProvider>
  )
})
