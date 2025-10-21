import { Box, Text, VStack } from '@chakra-ui/react'
import { ActionDisplay } from './ActionDisplay'
import type { BioTitan, NPC } from 'salvageunion-reference'

type AbilityType = BioTitan['abilities'][number] | NPC['abilities'][number]

interface AbilityCardProps {
  ability: AbilityType
  headerColor?: string
}

export function AbilityCard({ ability, headerColor = 'var(--color-su-brick)' }: AbilityCardProps) {
  return (
    <Box borderWidth="2px" borderColor="su.black" bg="su.white">
      <Box
        color="su.white"
        px={3}
        py={2}
        fontWeight="bold"
        textTransform="uppercase"
        bg={headerColor}
      >
        {ability.name}
      </Box>

      <VStack gap={2} p={3} alignItems="stretch">
        <ActionDisplay action={ability} />

        {'description' in ability &&
        ability.description &&
        typeof ability.description === 'string' ? (
          <Box pt={2} borderTopWidth="2px" borderTopColor="su.black">
            <Text color="su.black">{ability.description}</Text>
          </Box>
        ) : null}

        {'effect' in ability && ability.effect && typeof ability.effect === 'string' ? (
          <Box pt={2} borderTopWidth="2px" borderTopColor="su.black">
            <Text color="su.black" fontStyle="italic">
              {ability.effect}
            </Text>
          </Box>
        ) : null}
      </VStack>
    </Box>
  )
}
