import { Flex, Box } from '@chakra-ui/react'

interface ActivationCostBoxProps {
  cost: string | number
  currency?: string
  compact?: boolean
}

/**
 * Reusable component for displaying activation costs in a "pointed box" style
 * Used in ActionCard, AbilityDisplay, and other components that show AP/EP costs
 * Features a black box with white text and a triangular pointer on the right
 */
export function ActivationCostBox({
  cost,
  currency = 'AP',
  compact = false,
}: ActivationCostBoxProps) {
  const displayCost = cost === 'Variable' ? 'X' : cost

  return (
    <Flex alignItems="center" overflow="visible" p={0}>
      <Flex
        bg="su.black"
        color="su.white"
        fontWeight="semibold"
        textTransform="uppercase"
        alignItems="center"
        justifyContent="center"
        whiteSpace="nowrap"
        fontSize={compact ? 'xs' : 'sm'}
        px={1}
        lineHeight="1.2"
        zIndex={2}
      >
        {`${displayCost} ${currency}`}
      </Flex>
      <Box
        w={0}
        h={0}
        borderTop={compact ? '6px solid transparent' : '7px solid transparent'}
        borderBottom={compact ? '6px solid transparent' : '7px solid transparent'}
        borderLeft={compact ? '6px solid' : '7px solid'}
        borderLeftColor="su.black"
        ml={0}
        zIndex={1}
      />
    </Flex>
  )
}
