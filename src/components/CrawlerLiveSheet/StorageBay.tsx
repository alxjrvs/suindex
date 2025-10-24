import { Box, Flex, Grid, Text } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import { RoundedBox } from '../shared/RoundedBox'
import { AddStatButton } from '../shared/AddStatButton'
import type { CargoItem, CrawlerBay, CrawlerNPC } from './types'
import { NPCCard } from '../shared/NPCCard'
import { useMemo } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'

interface StorageBayProps {
  npc: CrawlerNPC
  cargo: CargoItem[]
  onUpdate: (updates: Partial<CrawlerBay>) => void
  onAddCargo: () => void
  onRemoveCargo: (id: string) => void
}

export function StorageBay({ cargo, npc, onUpdate, onAddCargo, onRemoveCargo }: StorageBayProps) {
  const referenceBay = useMemo(() => {
    const allBays = SalvageUnionReference.CrawlerBays.all()
    return allBays.find((b) => b.id === 'storage-bay')
  }, [])
  return (
    <RoundedBox
      bg="bg.builder.crawler"
      borderColor="border.builder.crawler"
      matchBorder={false}
      borderWidth="4px"
      justifyContent="flex-start"
      borderRadius="2xl"
      padding={4}
      title="Storage Bay"
      rightContent={<AddStatButton onClick={onAddCargo} label="Add Cargo" />}
    >
      <NPCCard
        npc={npc!}
        description={referenceBay?.npc.description || ''}
        maxHP={referenceBay?.npc.hitPoints || 0}
        onUpdateDamage={(value) => onUpdate({ npc: { ...npc!, damage: value } })}
        onUpdateName={(value) => onUpdate({ npc: { ...npc!, name: value } })}
        onUpdateNotes={(value) => onUpdate({ npc: { ...npc!, notes: value } })}
        position={referenceBay?.npc.position || 'NPC'}
      />

      <Box>
        <Heading level="h4" textTransform="uppercase" mb={2}>
          Cargo
        </Heading>

        <Grid gridTemplateColumns="repeat(4, 1fr)" gap={2}>
          {cargo.map((item) => (
            <Box
              key={item.id}
              position="relative"
              bg="bg.input"
              borderWidth="2px"
              borderColor="fg.input"
              borderRadius="lg"
              p={1}
              aspectRatio="1"
              display="flex"
              flexDirection="column"
            >
              <Button
                onClick={() => onRemoveCargo(item.id)}
                position="absolute"
                top="0.5"
                right="0.5"
                bg="su.brick"
                color="su.white"
                w="4"
                h="4"
                borderRadius="md"
                fontWeight="bold"
                _hover={{ bg: 'su.black' }}
                fontSize="xs"
                display="flex"
                alignItems="center"
                justifyContent="center"
                lineHeight="none"
                aria-label="Remove"
              >
                ✕
              </Button>
              <Flex flex="1" flexDirection="column" alignItems="center" justifyContent="center">
                <Text fontSize="lg" fontWeight="bold" color="fg.input">
                  {item.amount}
                </Text>
                <Text fontSize="10px" color="fg.input" textAlign="center" lineClamp={1} px={0.5}>
                  {item.description}
                </Text>
              </Flex>
            </Box>
          ))}
        </Grid>
      </Box>
    </RoundedBox>
  )
}
