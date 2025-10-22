import { Box, VStack } from '@chakra-ui/react'
import { Heading } from './base/Heading'
import { Frame } from './shared/Frame'
import { StatList } from './shared/StatList'
import { DescriptionBox } from './shared/DescriptionBox'
import { PageReferenceDisplay } from './shared/PageReferenceDisplay'
import type { BioTitan } from 'salvageunion-reference'
import { ActionDisplay } from './shared/ActionDisplay'

interface BioTitanDisplayProps {
  data: BioTitan
}

export function BioTitanDisplay({ data }: BioTitanDisplayProps) {
  return (
    <Frame
      header={data.name}
      headerContent={
        <Box ml="auto" pb={6} overflow="visible">
          <StatList
            stats={[
              {
                label: 'SP',
                value: data.structurePoints.toString(),
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
            level="h3"
            fontSize="lg"
            fontWeight="bold"
            color="su.black"
            textTransform="uppercase"
          >
            Abilities
          </Heading>
          {data.abilities.map((ability, index) => (
            <ActionDisplay
              key={index}
              action={ability}
              headerBgColor="su.orange"
              headerTextColor="su.white"
            />
          ))}
        </VStack>
      )}

      <PageReferenceDisplay source={data.source} page={data.page} />
    </Frame>
  )
}
