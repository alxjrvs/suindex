import { HStack } from '@chakra-ui/react'
import { ControlBarContainer } from '../shared/ControlBarContainer'
import { ActiveToggle } from '../shared/ActiveToggle'
import { PrivateToggle } from '../shared/PrivateToggle'

interface CrawlerControlBarProps {
  hasPendingChanges?: boolean
  active?: boolean
  onActiveChange?: (active: boolean) => void
  isPrivate?: boolean
  onPrivateChange?: (isPrivate: boolean) => void
  disabled?: boolean
}

export function CrawlerControlBar({
  hasPendingChanges = false,
  active,
  onActiveChange,
  isPrivate,
  onPrivateChange,
  disabled = false,
}: CrawlerControlBarProps) {
  return (
    <ControlBarContainer
      backgroundColor="su.pink"
      hasPendingChanges={hasPendingChanges}
      leftContent={
        <HStack gap={4}>
          {active !== undefined && onActiveChange && (
            <ActiveToggle active={active} onChange={onActiveChange} disabled={disabled} />
          )}
          {isPrivate !== undefined && onPrivateChange && (
            <PrivateToggle isPrivate={isPrivate} onChange={onPrivateChange} disabled={disabled} />
          )}
        </HStack>
      }
    />
  )
}
