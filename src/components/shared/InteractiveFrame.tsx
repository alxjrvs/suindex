import { Frame, type FrameProps } from './Frame'

interface InteractiveFrameProps
  extends Omit<
    FrameProps,
    | 'onClick'
    | 'dimmed'
    | 'showRemoveButton'
    | 'disableRemove'
    | 'onRemove'
    | 'collapsible'
    | 'defaultExpanded'
    | 'expanded'
    | 'onToggleExpanded'
    | 'showSelectButton'
    | 'selectButtonCost'
  > {
  // Interactive features
  onClick?: () => void
  dimmed?: boolean
  showRemoveButton?: boolean
  disableRemove?: boolean
  onRemove?: () => void
  collapsible?: boolean
  defaultExpanded?: boolean
  expanded?: boolean
  onToggleExpanded?: () => void
  showSelectButton?: boolean
  selectButtonCost?: number
}

/**
 * Interactive Frame component for use in selectors and lists
 * Extends Frame with interactive features like selection, removal, and expansion
 * Separates concerns: Frame handles display, InteractiveFrame adds interactivity
 */
export function InteractiveFrame({
  onClick,
  dimmed = false,
  showRemoveButton = false,
  disableRemove = false,
  onRemove,
  collapsible = false,
  defaultExpanded = false,
  expanded,
  onToggleExpanded,
  showSelectButton = false,
  selectButtonCost,
  ...frameProps
}: InteractiveFrameProps) {
  return (
    <Frame
      {...frameProps}
      onClick={onClick}
      dimmed={dimmed}
      showRemoveButton={showRemoveButton}
      disableRemove={disableRemove}
      onRemove={onRemove}
      collapsible={collapsible}
      defaultExpanded={defaultExpanded}
      expanded={expanded}
      onToggleExpanded={onToggleExpanded}
      showSelectButton={showSelectButton}
      selectButtonCost={selectButtonCost}
    />
  )
}
