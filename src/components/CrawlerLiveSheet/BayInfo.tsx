import { useState } from 'react'
import { VStack, Text, HStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { SheetDisplay } from '../shared/SheetDisplay'
import type { SURefCrawlerBay } from 'salvageunion-reference'
import { SheetEntityChoiceDisplay } from './SheetEntityChoiceDisplay'
import { useManageEntityChoices } from '../../hooks/suentity'

interface BayInfoProps {
  bayRef: SURefCrawlerBay
  bayEntityId: string
}

export function BayInfo({ bayRef, bayEntityId }: BayInfoProps) {
  const [isFunctionExpanded, setIsFunctionExpanded] = useState(false)
  const [isAbilitiesExpanded, setIsAbilitiesExpanded] = useState(false)
  const handleUpdateChoice = useManageEntityChoices(bayEntityId)

  // Get crawler to access tech level (we need the crawler ID from the bay entity)
  // For now, we'll skip tech level filtering since we don't have easy access to it
  // TODO: Consider passing crawler ID or tech level as prop if needed

  // Don't render if there's no reference bay or no content to show
  if (!bayRef.description && (!bayRef.actions || bayRef.actions.length === 0)) {
    return null
  }

  const hasFunction = !!bayRef.description
  const hasAbilities =
    !!(bayRef.actions && bayRef.actions.length > 0) ||
    (!!bayRef.techLevelEffects && bayRef.techLevelEffects.length > 0)

  // For now, show all tech level effects (we don't have easy access to crawler tech level)
  const techLevelEffects = bayRef.techLevelEffects

  return (
    <VStack mt="2" gap={2} justifyContent="flex-start" alignItems="stretch" w="full">
      {bayRef.choices?.map((choice) => (
        <SheetEntityChoiceDisplay
          key={choice.id}
          choice={choice}
          onUpdateChoice={handleUpdateChoice}
          entityId={bayEntityId}
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
          <Text lineHeight="relaxed">{bayRef.description}</Text>
        </SheetDisplay>
      )}

      {/* Abilities Section */}
      {isAbilitiesExpanded && hasAbilities && (
        <VStack gap={3} alignItems="stretch" w="full">
          {bayRef.actions!.map((ability, idx) => (
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
