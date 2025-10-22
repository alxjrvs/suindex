import { Flex, Box } from '@chakra-ui/react'

interface ActivationCostBoxProps {
  cost: string | number
  currency?: string
}

/**
 * Reusable component for displaying activation costs in a "pointed box" style
 * Used in ActionDisplay, AbilityDisplay, and other components that show AP/EP costs
 * Features a black box with white text and a triangular pointer on the right
 */
export function ActivationCostBox({ cost, currency = 'AP' }: ActivationCostBoxProps) {
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
        fontSize="15px"
        px="6px"
        py="2px"
        h="20px"
        minW="50px"
        zIndex={2}
      >
        {`${displayCost} ${currency}`}
      </Flex>
      <Box
        w={0}
        h={0}
        borderTop="10px solid transparent"
        borderBottom="10px solid transparent"
        borderLeft="10px solid"
        borderLeftColor="su.black"
        ml={0}
        zIndex={1}
      />
    </Flex>
  )
}

