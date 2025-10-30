import { Box, Text } from '@chakra-ui/react'

interface StatBonusDisplayProps {
  bonus: number
  stat: string
}

export function StatBonusDisplay({ bonus, stat }: StatBonusDisplayProps) {
  return (
    <Box bg="su.white" borderWidth="2px" borderColor="su.black" borderRadius="md" p={3}>
      <Text as="span" fontWeight="bold" color="su.brick">
        Stat Bonus:{' '}
      </Text>
      <Text as="span" color="su.black">
        +{bonus} {stat.replace(/_/g, ' ')}
      </Text>
    </Box>
  )
}
