import { Box, VStack } from '@chakra-ui/react'
import { Heading } from './base/Heading'
import { Frame } from './shared/Frame'
import { StatList } from './shared/StatList'
import { ActionDisplay } from './shared/ActionDisplay'
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
          />
        </Box>
      }
      showSidebar={false}
    >
      {data.description && <DescriptionBox description={data.description} />}

      {data.abilities && data.abilities.length > 0 && (
        <VStack gap={3} alignItems="stretch">
          <Heading level="h3" textTransform="uppercase">
            Abilities
          </Heading>
          {data.abilities.map((ability, index) => (
            <ActionDisplay key={index} action={ability} />
          ))}
        </VStack>
      )}

      <PageReferenceDisplay source={data.source} page={data.page} />
    </Frame>
  )
}
