import { useMemo, useState, useCallback, useEffect } from 'react'
import { Box, VStack, Button, Tabs } from '@chakra-ui/react'
import { Text } from '@/components/base/Text'
import { EntityDisplay } from '@/components/entity/EntityDisplay'
import { RoundedBox } from '@/components/shared/RoundedBox'
import { NPCCard } from '@/components/shared/NPCCard'
import { getParagraphString } from '@/lib/contentBlockHelpers'
import type { Tables } from '@/types/database-generated.types'
import type { UseCrawlerWizardStateReturn } from './useCrawlerWizardState'
import { getWorkshopManualCrawlers } from './utils'
import type { CrawlerNPCData } from './utils'

interface CrawlerTypeSelectionStepProps {
  wizardState: UseCrawlerWizardStateReturn
  onComplete: () => void
}

export function CrawlerTypeSelectionStep({
  wizardState,
  onComplete,
}: CrawlerTypeSelectionStepProps) {
  const { state, setSelectedCrawlerTypeId, setCrawlerNPC, setCrawlerNPCChoice } = wizardState
  const crawlerTypes = useMemo(() => getWorkshopManualCrawlers(), [])

  const [selectedTab, setSelectedTab] = useState<string>(() => {
    if (state.selectedCrawlerTypeId) return state.selectedCrawlerTypeId
    // Pre-select first crawler type
    return crawlerTypes.length > 0 && crawlerTypes[0] ? crawlerTypes[0].id : ''
  })

  const selectedCrawlerType = useMemo(() => {
    return crawlerTypes.find((c) => c.id === selectedTab) || null
  }, [crawlerTypes, selectedTab])

  const isCrawlerTypeSelected = useMemo(() => {
    return selectedCrawlerType?.id === state.selectedCrawlerTypeId
  }, [selectedCrawlerType?.id, state.selectedCrawlerTypeId])

  const handleCrawlerTypeSelect = useCallback(() => {
    if (selectedCrawlerType) {
      setSelectedCrawlerTypeId(selectedCrawlerType.id)
    }
  }, [selectedCrawlerType, setSelectedCrawlerTypeId])

  const handleNext = useCallback(() => {
    if (state.selectedCrawlerTypeId) {
      onComplete()
    }
  }, [state.selectedCrawlerTypeId, onComplete])

  const handleTabChange = useCallback((crawlerTypeId: string) => {
    setSelectedTab(crawlerTypeId)
  }, [])

  const crawlerNPC = useMemo(() => {
    if (!selectedCrawlerType?.npc) return null
    return (
      state.crawlerNPC || {
        name: '',
        notes: '',
        hitPoints: selectedCrawlerType.npc.hitPoints || null,
        damage: 0,
      }
    )
  }, [selectedCrawlerType, state.crawlerNPC])

  const handleNPCUpdate = useCallback(
    (updates: Partial<{ npc: CrawlerNPCData }>) => {
      if (!updates.npc || !crawlerNPC) return
      // Exclude damage from updates - HP is not editable in wizard
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { damage: _damage, ...npcWithoutDamage } = updates.npc
      setCrawlerNPC({ ...crawlerNPC, ...npcWithoutDamage })
    },
    [crawlerNPC, setCrawlerNPC]
  )

  const handleNPCChoiceUpdate = useCallback(
    (choiceId: string, value: string) => {
      setCrawlerNPCChoice(choiceId, value)
    },
    [setCrawlerNPCChoice]
  )

  // Initialize crawler NPC when crawler type is selected
  useEffect(() => {
    if (selectedCrawlerType?.npc && !state.crawlerNPC) {
      setCrawlerNPC({
        name: '',
        notes: '',
        hitPoints: selectedCrawlerType.npc.hitPoints || null,
        damage: 0,
      })
    }
  }, [selectedCrawlerType, state.crawlerNPC, setCrawlerNPC])

  // Convert choices map to array format for NPCCard
  const npcChoicesArray = useMemo((): Tables<'player_choices'>[] => {
    if (!selectedCrawlerType?.npc?.choices) return []
    return selectedCrawlerType.npc.choices.map((choice) => ({
      id: `temp-${choice.id}`,
      choice_ref_id: choice.id,
      value: state.crawlerNPCChoices[choice.id] || '',
      entity_id: null,
      player_choice_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
  }, [selectedCrawlerType?.npc?.choices, state.crawlerNPCChoices])

  return (
    <VStack gap={6} align="stretch" w="full">
      <VStack gap={2} align="stretch">
        <Text variant="pseudoheader" fontSize="2xl" textAlign="center" textTransform="uppercase">
          Choose your Crawler Type
        </Text>
        <Text textAlign="center" fontSize="md" color="fg.muted">
          Select a crawler type from the Workshop Manual. Each type has different abilities and
          characteristics.
        </Text>
      </VStack>

      {crawlerTypes.length > 0 && (
        <Tabs.Root value={selectedTab} onValueChange={(e) => handleTabChange(e.value)}>
          <Box>
            <Tabs.List
              borderBottom="3px solid"
              borderColor="border.default"
              justifyContent="center"
              flexWrap="wrap"
              gap={2}
              pb={4}
              mb={4}
            >
              {crawlerTypes.map((crawlerType) => (
                <Tabs.Trigger
                  key={crawlerType.id}
                  value={crawlerType.id}
                  fontSize="lg"
                  fontWeight="bold"
                  color="fg.default"
                  _selected={{
                    bg: 'su.orange',
                    color: 'su.white',
                    borderBottomColor: 'su.orange',
                  }}
                >
                  {crawlerType.name}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {selectedCrawlerType && (
              <EntityDisplay
                data={selectedCrawlerType}
                schemaName="crawlers"
                hideActions
                hideChoices
                imageWidth="40%"
                headerColor={isCrawlerTypeSelected ? 'su.brick' : undefined}
                buttonConfig={{
                  bg: isCrawlerTypeSelected ? 'su.brick' : 'su.orange',
                  color: 'su.white',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  _hover: { bg: isCrawlerTypeSelected ? 'su.black' : 'su.black' },
                  onClick: handleCrawlerTypeSelect,
                  children: isCrawlerTypeSelected ? 'Selected' : 'Select This Crawler Type',
                }}
              >
                {selectedCrawlerType.npc && crawlerNPC && (
                  <RoundedBox bg="bg.builder.crawler" title="NPC" disabled={false} w="full">
                    <NPCCard
                      npc={crawlerNPC}
                      choices={npcChoicesArray}
                      referenceBay={selectedCrawlerType}
                      description={getParagraphString(selectedCrawlerType.npc.content) || ''}
                      maxHP={selectedCrawlerType.npc.hitPoints || 0}
                      onUpdateBay={handleNPCUpdate}
                      onUpdateChoice={handleNPCChoiceUpdate}
                      position={selectedCrawlerType.npc.position || 'NPC'}
                      tilted={false}
                      disabled={false}
                      disableHPEditing={true}
                    />
                  </RoundedBox>
                )}
              </EntityDisplay>
            )}
          </Box>
        </Tabs.Root>
      )}

      <Button
        w="full"
        bg={state.selectedCrawlerTypeId ? 'su.orange' : 'gray.400'}
        color="su.white"
        borderWidth="3px"
        borderColor="su.black"
        borderRadius="md"
        fontSize="lg"
        fontWeight="bold"
        py={6}
        _hover={state.selectedCrawlerTypeId ? { bg: 'su.black' } : {}}
        disabled={!state.selectedCrawlerTypeId}
        _disabled={{ opacity: 0.6, cursor: 'not-allowed' }}
        onClick={handleNext}
      >
        CONFIGURE BAYS
      </Button>
    </VStack>
  )
}
