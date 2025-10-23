import { useMemo, useState } from 'react'
import { Box, VStack, Text, Flex } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { CrawlerBay } from '../../types/database'
import { RoundedBox } from '../shared/RoundedBox'
import { FormInput } from '../shared/FormInput'
import { FormTextarea } from '../shared/FormTextarea'
import { Text as StyledText } from '../base/Text'

interface BayCardProps {
  bay: CrawlerBay
  onUpdate: (updates: Partial<CrawlerBay>) => void
}

export function BayCard({ bay, onUpdate }: BayCardProps) {
  const [isFunctionExpanded, setIsFunctionExpanded] = useState(false)
  const [isAbilitiesExpanded, setIsAbilitiesExpanded] = useState(false)

  const referenceBay = useMemo(() => {
    const allBays = SalvageUnionReference.CrawlerBays.all()
    return allBays.find((b) => b.id === bay.bayId)
  }, [bay.bayId])

  return (
    <RoundedBox
      bg="su.crawlerPink"
      borderWidth="4px"
      borderRadius="2xl"
      justifyContent="flex-start"
      padding={4}
      title={bay.name}
    >
      <VStack justifyContent="flex-start" alignItems="space-between">
        <FormInput
          value={bay.operator}
          onChange={(value) => onUpdate({ operator: value })}
          placeholder={`Enter ${bay.operatorPosition} name...`}
          suffixText={`the ${bay.operatorPosition}`}
        />

        <FormTextarea
          label="Description"
          value={bay.description}
          onChange={(value) => onUpdate({ description: value })}
          placeholder="Enter bay description..."
          height="20"
        />

        {/* Function Section - Expandable */}
        {referenceBay && referenceBay.description && (
          <Box>
            <Flex alignItems="center" justifyContent="space-between" mb={2}>
              <Flex alignItems="center">
                <StyledText variant="pseudoheader" fontSize="sm" textTransform="uppercase">
                  Function
                </StyledText>
              </Flex>
              <Button
                onClick={() => setIsFunctionExpanded(!isFunctionExpanded)}
                size="sm"
                bg="su.black"
                color="su.white"
                _hover={{ bg: 'su.brick' }}
                fontSize="xs"
                px={3}
                py={1}
              >
                {isFunctionExpanded ? 'Hide' : 'Show'}
              </Button>
            </Flex>

            {isFunctionExpanded && (
              <Box bg="bg.input" borderWidth="3px" borderColor="su.black" borderRadius="2xl" p={3}>
                <Text color="fg.input">{referenceBay.description}</Text>
              </Box>
            )}
          </Box>
        )}

        {/* Abilities Section - Expandable */}
        {referenceBay && referenceBay.abilities && referenceBay.abilities.length > 0 && (
          <Box>
            <Flex alignItems="center" justifyContent="space-between" mb={2}>
              <Flex alignItems="center">
                <StyledText variant="pseudoheader" fontSize="sm" textTransform="uppercase">
                  Abilities
                </StyledText>
              </Flex>
              <Button
                onClick={() => setIsAbilitiesExpanded(!isAbilitiesExpanded)}
                size="sm"
                bg="su.black"
                color="su.white"
                _hover={{ bg: 'su.brick' }}
                fontSize="xs"
                px={3}
                py={1}
              >
                {isAbilitiesExpanded ? 'Hide' : 'Show'}
              </Button>
            </Flex>

            {isAbilitiesExpanded && (
              <VStack gap={2} alignItems="stretch">
                {referenceBay.abilities.map((ability, idx) => (
                  <Box
                    key={idx}
                    bg="bg.input"
                    borderWidth="3px"
                    borderColor="su.black"
                    borderRadius="2xl"
                    p={3}
                  >
                    <Text fontWeight="bold" color="fg.input" mb={1}>
                      {ability.name}
                    </Text>
                    <Text color="fg.input" fontSize="sm">
                      {ability.description}
                    </Text>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        )}
      </VStack>
    </RoundedBox>
  )
}
