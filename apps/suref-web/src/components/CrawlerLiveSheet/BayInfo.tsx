import { useState } from 'react'
import { VStack, Box } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { SheetDisplay } from '@/components/shared/SheetDisplay'
import type { SURefCrawlerBay } from 'salvageunion-reference'

import { SheetEntityChoiceDisplay } from './SheetEntityChoiceDisplay'
import { useManageEntityChoices } from '@/hooks/suentity'
import { useParseTraitReferences } from '@/utils/parseTraitReferences'
import { getParagraphString } from '@/lib/contentBlockHelpers'

interface BayInfoProps {
  bayRef: SURefCrawlerBay
  bayEntityId: string
}

export function BayInfo({ bayRef, bayEntityId }: BayInfoProps) {
  const [isFunctionExpanded, setIsFunctionExpanded] = useState(false)
  const handleUpdateChoice = useManageEntityChoices(bayEntityId)

  const description = getParagraphString(bayRef.content)
  const parsedDescription = useParseTraitReferences(description || '')

  if (!description) {
    return null
  }

  const hasFunction = !!description

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
      {hasFunction && (
        <Button
          onClick={() => setIsFunctionExpanded(!isFunctionExpanded)}
          w="full"
          bg="su.black"
          color="su.white"
          _hover={{ bg: 'brand.srd' }}
          fontWeight="bold"
          py={2}
          borderRadius="md"
        >
          {isFunctionExpanded ? 'Hide Info' : 'Show Info'}
        </Button>
      )}

      {isFunctionExpanded && hasFunction && parsedDescription && (
        <SheetDisplay label="Function">
          <Box lineHeight="relaxed" color="su.black">
            {parsedDescription}
          </Box>
        </SheetDisplay>
      )}
    </VStack>
  )
}
