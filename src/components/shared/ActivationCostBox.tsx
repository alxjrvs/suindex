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
    <Flex alignItems="center" overflow="visible">
      <Flex
        bg="su.black"
        color="su.white"
        fontWeight="bold"
        textTransform="uppercase"
        alignItems="center"
        justifyContent="center"
        whiteSpace="nowrap"
        fontSize={compact ? '12px' : '15px'}
        px={compact ? '4px' : '6px'}
        py={compact ? '1px' : '2px'}
        h={compact ? '16px' : '20px'}
        minW={compact ? '40px' : '50px'}
        zIndex={2}
      >
        {`${displayCost} ${currency}`}
      </Flex>
      <Box
        w={0}
        h={0}
        borderTop={compact ? '8px solid transparent' : '10px solid transparent'}
        borderBottom={compact ? '8px solid transparent' : '10px solid transparent'}
        borderLeft={compact ? '8px solid' : '10px solid'}
        borderLeftColor="su.black"
        ml={0}
        zIndex={1}
      />
    </Flex>
  )
}
