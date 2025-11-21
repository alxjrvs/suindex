import { useState } from 'react'
import { VStack, Box, Button } from '@chakra-ui/react'
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

  const hasFunction = !!description
  const hasChoices = bayRef.choices && bayRef.choices.length > 0

  if (!hasFunction && !hasChoices) {
    return null
  }

  return (
    <VStack mt="2" gap={2} justifyContent="flex-start" alignItems="stretch" w="full">
      {hasChoices &&
        bayRef.choices?.map((choice) => (
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
        <Box
          bg="su.white"
          border="2px solid"
          borderColor="su.black"
          overflow="hidden"
          textAlign="left"
          borderRadius="md"
        >
          {/* Function content */}
          <Box
            bg="su.white"
            color="su.black"
            fontWeight="medium"
            lineHeight="relaxed"
            fontSize="sm"
            px={2}
            py={2}
          >
            {parsedDescription}
          </Box>
        </Box>
      )}
    </VStack>
  )
}
