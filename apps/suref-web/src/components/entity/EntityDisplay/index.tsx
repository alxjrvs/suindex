import type { ButtonProps } from '@chakra-ui/react'
import { type ReactNode, memo } from 'react'
import type { SURefEntity, SURefEnumSchemaName } from 'salvageunion-reference'
import { EntityDisplayContent } from './components/EntityDisplayContent'
import { EntityDisplayProvider } from './EntityDisplayProvider'

type EntityDisplayProps = {
  /** Entity data to display - only accepts SURefEntity (not SURefMetaAction or SURefObjectSystemModule) */
  data: SURefEntity | undefined
  /** Schema name for the entity */
  schemaName: SURefEnumSchemaName
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
  /** Optional custom content displayed in the top-right corner */
  rightContent?: ReactNode
  /** Whether the entity is damaged (affects header color and tilts components) */
  damaged?: boolean
  /** Whether to use compact styling */
  compact?: boolean
  /** Whether to hide the level display */
  hideLevel?: boolean
  /** Whether or not to show the actions */
  hideActions?: boolean
  /** Whether to hide chassis patterns */
  hidePatterns?: boolean
  /** Whether to hide choices */
  hideChoices?: boolean
  /** Whether to show the footer (page reference). Defaults to !hideActions */
  showFooter?: boolean
  /** User choices object matching the format sent to the API: Record<choiceId, "schemaName||entityId"> */
  userChoices?: Record<string, string> | null
  /** Callback when a choice is selected - if undefined, we're in schema page mode (not a live sheet) */
  onChoiceSelection?: (choiceId: string, value: string | undefined) => void
  /** Whether to hide the image */
  hideImage?: boolean
  /** Custom width for the image (e.g., '40%') */
  imageWidth?: string
}

export const EntityDisplay = memo(function EntityDisplay({
  rightLabel,
  rightContent,
  damaged = false,
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
  hidePatterns = false,
  hideChoices = false,
  showFooter,
  schemaName,
  compact = false,
  userChoices,
  onChoiceSelection,
  hideImage,
  imageWidth,
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
      hidePatterns={hidePatterns}
      hideChoices={hideChoices}
      showFooter={showFooter}
      collapsible={collapsible}
      onClick={onClick}
      hideLevel={hideLevel}
      rightLabel={rightLabel}
      rightContent={rightContent}
      damaged={damaged}
      buttonConfig={buttonConfig}
      userChoices={userChoices}
      onChoiceSelection={onChoiceSelection}
      onToggleExpanded={onToggleExpanded}
      hideImage={hideImage}
      imageWidth={imageWidth}
    >
      <EntityDisplayContent>{children}</EntityDisplayContent>
    </EntityDisplayProvider>
  )
})
