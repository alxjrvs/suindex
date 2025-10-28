import { useState } from 'react'
import { VStack, Text, HStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { SheetDisplay } from '../shared/SheetDisplay'
import type { SURefCrawlerBay } from 'salvageunion-reference'
import type { CrawlerLiveSheetState } from './types'
import { SheetEntityChoiceDisplay } from './SheetEntityChoiceDisplay'

interface BayInfoProps {
  referenceBay: SURefCrawlerBay | undefined
  onUpdateChoice: (id: string, value: string | undefined) => void
  crawler: CrawlerLiveSheetState
}

export function BayInfo({
  referenceBay,
  crawler: { crawler_type_id, tech_level, choices },
  onUpdateChoice,
}: BayInfoProps) {
  const [isFunctionExpanded, setIsFunctionExpanded] = useState(false)
  const [isAbilitiesExpanded, setIsAbilitiesExpanded] = useState(false)

  // Don't render if there's no reference bay or no content to show
  if (
    !referenceBay ||
    (!referenceBay.description && (!referenceBay.abilities || referenceBay.abilities.length === 0))
  ) {
    return null
  }

  const hasFunction = !!referenceBay.description
  const hasAbilities =
    !!(referenceBay.abilities && referenceBay.abilities.length > 0) ||
    (!!referenceBay.techLevelEffects && referenceBay.techLevelEffects.length > 0)

  const techLevelEffects =
    crawler_type_id && tech_level
      ? referenceBay.techLevelEffects?.filter(
          (effect) => effect.techLevelMin <= tech_level && effect.techLevelMax >= tech_level
        )
      : referenceBay.techLevelEffects

  return (
    <VStack mt="2" gap={2} justifyContent="flex-start" alignItems="stretch" w="full">
      {referenceBay.choices?.map((choice) => (
        <SheetEntityChoiceDisplay
          key={choice.id}
          choice={choice}
          onUpdateChoice={onUpdateChoice}
          selectedValue={(choices || {})[choice.id]}
        />
      ))}
      <HStack gap={2} w="full">
        {hasFunction && (
          <Button
            onClick={() => setIsFunctionExpanded(!isFunctionExpanded)}
            flex={hasAbilities ? 1 : undefined}
            w={hasAbilities ? undefined : 'full'}
            bg="su.black"
            color="su.white"
            _hover={{ bg: 'su.brick' }}
            fontWeight="bold"
            py={2}
            borderRadius="md"
          >
            {isFunctionExpanded ? 'Hide Info' : 'Show Info'}
          </Button>
        )}

        {hasAbilities && (
          <Button
            onClick={() => setIsAbilitiesExpanded(!isAbilitiesExpanded)}
            flex={hasFunction ? 1 : undefined}
            w={hasFunction ? undefined : 'full'}
            bg="su.black"
            color="su.white"
            _hover={{ bg: 'su.brick' }}
            fontWeight="bold"
            py={2}
            borderRadius="md"
          >
            {isAbilitiesExpanded ? 'Hide Abilities' : 'Show Abilities'}
          </Button>
        )}
      </HStack>

      {/* Function Section */}
      {isFunctionExpanded && hasFunction && (
        <SheetDisplay label="Function">
          <Text lineHeight="relaxed">{referenceBay.description}</Text>
        </SheetDisplay>
      )}

      {/* Abilities Section */}
      {isAbilitiesExpanded && hasAbilities && (
        <VStack gap={3} alignItems="stretch" w="full">
          {referenceBay.abilities!.map((ability, idx) => (
            <SheetDisplay key={idx} label={ability.name}>
              <Text lineHeight="relaxed">{ability.description}</Text>
            </SheetDisplay>
          ))}
          {techLevelEffects?.map((effect, idx) => (
            <SheetDisplay key={idx} label={`Tech Level ${effect.techLevelMin}`}>
              <Text lineHeight="relaxed">{effect.effect}</Text>
            </SheetDisplay>
          ))}
        </VStack>
      )}
    </VStack>
  )
}
