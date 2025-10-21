import { Box, Flex, Text } from '@chakra-ui/react'
import { StatDisplay } from './StatDisplay'

interface CrawlerCardProps {
  name: string
  typeName: string
  maxSP: number
  currentDamage: number
}

export function CrawlerCard({ name, typeName, maxSP, currentDamage }: CrawlerCardProps) {
  const currentSP = maxSP - currentDamage
  const spDisplay = `${currentSP}/${maxSP}`

  return (
    <Flex
      bg="su.crawlerPink"
      borderWidth="4px"
      borderColor="su.crawlerPink"
      borderRadius="3xl"
      p={4}
      shadow="lg"
      alignItems="center"
      justifyContent="space-between"
      h="120px"
    >
      <Box flex="1" pr={4}>
        <Text fontSize="xl" fontWeight="bold" color="su.white" lineHeight="tight">
          {name}
        </Text>
        <Text fontSize="sm" color="su.white" opacity={0.9} mt={1}>
          <Text as="span" textTransform="capitalize">
            {typeName}
          </Text>{' '}
          Crawler
        </Text>
      </Box>
      <Box minW="80px">
        <StatDisplay label="SP" value={spDisplay} />
      </Box>
    </Flex>
  )
}

export default CrawlerCard
