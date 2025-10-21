import { Box, Heading, VStack } from '@chakra-ui/react'
import { Frame } from './shared/Frame'
import { StatList } from './shared/StatList'
import { AbilityCard } from './shared/AbilityCard'
import { DescriptionBox } from './shared/DescriptionBox'
import { PageReferenceDisplay } from './shared/PageReferenceDisplay'
import type { NPC } from 'salvageunion-reference'

interface NPCDisplayProps {
  data: NPC
}

export function NPCDisplay({ data }: NPCDisplayProps) {
  return (
    <Frame
      header={data.name}
      headerContent={
        <Box ml="auto" pb={6} overflow="visible">
          <StatList
            stats={[
              {
                label: 'HP',
                value: data.hitPoints.toString(),
              },
            ]}
            up={false}
          />
        </Box>
      }
      showSidebar={false}
    >
      {data.description && <DescriptionBox description={data.description} />}

      {data.abilities && data.abilities.length > 0 && (
        <VStack gap={3} alignItems="stretch">
          <Heading
            as="h3"
            fontSize="lg"
            fontWeight="bold"
            color="su.black"
            textTransform="uppercase"
          >
            Abilities
          </Heading>
          {data.abilities.map((ability, index) => (
            <AbilityCard key={index} ability={ability} />
          ))}
        </VStack>
      )}

      <PageReferenceDisplay source={data.source} page={data.page} />
    </Frame>
  )
}
