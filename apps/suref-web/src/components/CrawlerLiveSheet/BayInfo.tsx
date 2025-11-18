import { useState } from 'react'
import { VStack, HStack, Box } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { SheetDisplay } from '../shared/SheetDisplay'
import type { SURefCrawlerBay } from 'salvageunion-reference'

import { SheetEntityChoiceDisplay } from './SheetEntityChoiceDisplay'
import { useManageEntityChoices } from '../../hooks/suentity'
import { useParseTraitReferences } from '../../utils/parseTraitReferences'
import { getParagraphString } from '../../lib/contentBlockHelpers'

interface BayInfoProps {
  bayRef: SURefCrawlerBay
  bayEntityId: string
}

function AbilityDisplay({ name, description }: { name: string; description?: string }) {
  const parsed = useParseTraitReferences(description)
  return (
    <SheetDisplay label={name}>
      <Box lineHeight="relaxed" color="su.black">
        {parsed}
      </Box>
    </SheetDisplay>
  )
}

function EffectDisplay({ label, value }: { label: string; value: string }) {
  const parsed = useParseTraitReferences(value)
  return (
    <SheetDisplay label={label}>
      <Box lineHeight="relaxed" color="su.black">
        {parsed}
      </Box>
    </SheetDisplay>
  )
}

export function BayInfo({ bayRef, bayEntityId }: BayInfoProps) {
  const [isFunctionExpanded, setIsFunctionExpanded] = useState(false)
  const [isAbilitiesExpanded, setIsAbilitiesExpanded] = useState(false)
  const handleUpdateChoice = useManageEntityChoices(bayEntityId)

  const description = getParagraphString(bayRef.content)
  const parsedDescription = useParseTraitReferences(description || '')

  if (!description && (!bayRef.actions || bayRef.actions.length === 0)) {
    return null
  }

  const hasFunction = !!description
  const hasAbilities = !!(bayRef.actions && bayRef.actions.length > 0)

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

      {isFunctionExpanded && hasFunction && parsedDescription && (
        <SheetDisplay label="Function">
          <Box lineHeight="relaxed" color="su.black">
            {parsedDescription}
          </Box>
        </SheetDisplay>
      )}

      {isAbilitiesExpanded && hasAbilities && (
        <VStack gap={3} alignItems="stretch" w="full">
          {bayRef.actions!.map((ability, idx) => (
            <AbilityDisplay
              key={idx}
              name={ability.name}
              description={getParagraphString(ability.content)}
            />
          ))}
        </VStack>
      )}
    </VStack>
  )
}
