import type { ReactNode } from 'react'
import type { BoxProps } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { RoundedBox } from '../shared/RoundedBox'
import { ValueDisplay } from '../shared/ValueDisplay'

interface UserEntitySmallDisplayProps extends BoxProps {
  onClick: () => void
  /** Mouse enter handler for prefetching */
  onMouseEnter?: () => void
  /** Background color for the entire card */
  bgColor: string
  /** Left header content (entity name) - larger pseudoheader */
  leftHeader: string
  /** Right header content (note/category) - smaller pseudoheader or custom ReactNode */
  rightHeader?: string | ReactNode
  /** Detail content below header */
  detailContent?: ReactNode
  /** Label for detail content (e.g. "Role") */
  detailLabel?: string
  /** Value for detail content (e.g. "Mediator") */
  detailValue?: string | number
  /** Whether this entity is inactive (applies greyed out styling) */
  isInactive?: boolean
  /** Optional label displayed as pseudo-header above the box */
  label?: string
  reverse?: boolean
}

export function UserEntitySmallDisplay({
  onClick,
  onMouseEnter,
  reverse = false,
  label,
  bgColor,
  leftHeader,
  detailLabel,
  detailValue,
  rightHeader,
  isInactive = false,
}: UserEntitySmallDisplayProps) {
  const effectiveBgColor: string = isInactive ? 'gray.400' : bgColor

  const formattedRightHeader =
    typeof rightHeader === 'string' ? (
      <Text variant="pseudoheader" fontSize="sm" lineClamp={2} textAlign="right" flexShrink={0}>
        {rightHeader}
      </Text>
    ) : (
      rightHeader
    )

  return (
    <RoundedBox
      minH="90px"
      reverse={reverse}
      bg={effectiveBgColor}
      label={label}
      title={leftHeader}
      rightContent={formattedRightHeader}
      subTitleContent={
        detailLabel && <ValueDisplay label={detailLabel} value={detailValue} inline={false} />
      }
      _hover={{ borderColor: 'su.brick' }}
      cursor="pointer"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      w="full"
      opacity={isInactive ? 0.7 : 1}
    />
  )
}
