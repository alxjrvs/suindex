import { useMemo, useCallback, useState } from 'react'
import { Box, VStack, Button, Grid } from '@chakra-ui/react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefCrawlerBay } from 'salvageunion-reference'
import { Text } from '@/components/base/Text'
import { RoundedBox } from '@/components/shared/RoundedBox'
import { NPCCard } from '@/components/shared/NPCCard'
import { EntitySelectionModal } from '@/components/entity/EntitySelectionModal'
import { getParagraphString } from '@/lib/contentBlockHelpers'
import type { UseCrawlerWizardStateReturn } from './useCrawlerWizardState'
import type { BayNPCData } from './utils'

interface CrawlerBaysStepProps {
  wizardState: UseCrawlerWizardStateReturn
  onComplete: () => void
}

const ARMAMENT_BAY_WEAPON_CHOICE_ID = '383de916-bbd6-4e34-9cfc-1b37e12178c8'

export function CrawlerBaysStep({ wizardState, onComplete }: CrawlerBaysStepProps) {
  const { state, setBayNPC, setArmamentBayWeaponId } = wizardState
  const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false)

  const allBays = useMemo(() => SalvageUnionReference.CrawlerBays.all(), [])

  const armamentBay = useMemo(() => {
    return allBays.find((bay) => bay.name === 'Armament Bay')
  }, [allBays])

  const otherBays = useMemo(() => {
    return allBays.filter((bay) => bay.name !== 'Armament Bay')
  }, [allBays])

  const handleNPCUpdate = useCallback(
    (bayId: string, updates: Partial<BayNPCData>) => {
      const currentNPC = state.bayNPCs[bayId] || {
        name: '',
        notes: '',
        hitPoints: null,
        damage: 0,
      }
      setBayNPC(bayId, { ...currentNPC, ...updates })
    },
    [state.bayNPCs, setBayNPC]
  )

  const handleWeaponSelect = useCallback(
    (entityId: string) => {
      setArmamentBayWeaponId(entityId)
      setIsWeaponModalOpen(false)
    },
    [setArmamentBayWeaponId]
  )

  const handleWeaponRemove = useCallback(() => {
    setArmamentBayWeaponId(null)
  }, [setArmamentBayWeaponId])

  const handleNext = useCallback(() => {
    if (state.armamentBayWeaponId) {
      onComplete()
    }
  }, [state.armamentBayWeaponId, onComplete])

  const renderBayCard = (bay: SURefCrawlerBay) => {
    const bayNPC = state.bayNPCs[bay.id] || {
      name: '',
      notes: '',
      hitPoints: bay.npc.hitPoints || null,
      damage: 0,
    }

    // For wizard, we use empty choices array since choices will be created later
    const emptyChoices: never[] = []

    return (
      <RoundedBox
        key={bay.id}
        bg="su.crawlerPink"
        justifyContent="flex-start"
        title={bay.name}
        disabled={false}
      >
        <VStack gap={2} alignItems="stretch" w="full">
          <NPCCard
            npc={bayNPC}
            choices={emptyChoices}
            referenceBay={bay}
            description={getParagraphString(bay.npc.content) || ''}
            maxHP={bay.npc.hitPoints || 0}
            onUpdateChoice={(choiceId, value) => {
              // Handle name choice updates
              if (choiceId && value) {
                handleNPCUpdate(bay.id, { name: value })
              }
            }}
            onUpdateBay={(updates) => {
              if (updates.npc) {
                // Exclude damage from updates - HP is not editable in wizard
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { damage: _damage, ...npcWithoutDamage } = updates.npc
                handleNPCUpdate(bay.id, npcWithoutDamage)
              }
            }}
            position={bay.npc.position || 'NPC'}
            tilted={false}
            disabled={false}
            disableHPEditing={true}
          />
        </VStack>
      </RoundedBox>
    )
  }

  return (
    <VStack gap={6} align="stretch" w="full">
      <VStack gap={2} align="stretch">
        <Text variant="pseudoheader" fontSize="2xl" textAlign="center" textTransform="uppercase">
          Configure Crawler Bays
        </Text>
        <Text textAlign="center" fontSize="md" color="fg.muted">
          Fill out NPC information for each bay. The Armament Bay weapon system is required to
          proceed.
        </Text>
      </VStack>

      {otherBays.length > 0 && (
        <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4}>
          {otherBays.map((bay) => renderBayCard(bay))}
        </Grid>
      )}

      {armamentBay && (
        <VStack gap={4} align="stretch">
          <RoundedBox
            bg="su.crawlerPink"
            justifyContent="flex-start"
            title={armamentBay.name}
            disabled={false}
          >
            <VStack gap={4} alignItems="stretch" w="full">
              <NPCCard
                npc={
                  state.bayNPCs[armamentBay.id] || {
                    name: '',
                    notes: '',
                    hitPoints: armamentBay.npc.hitPoints || null,
                    damage: 0,
                  }
                }
                choices={[]}
                referenceBay={armamentBay}
                description={getParagraphString(armamentBay.npc.content) || ''}
                maxHP={armamentBay.npc.hitPoints || 0}
                onUpdateChoice={(choiceId, value) => {
                  if (choiceId && value) {
                    handleNPCUpdate(armamentBay.id, { name: value })
                  }
                }}
                onUpdateBay={(updates) => {
                  if (updates.npc) {
                    // Exclude damage from updates - HP is not editable in wizard
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { damage: _damage, ...npcWithoutDamage } = updates.npc
                    handleNPCUpdate(armamentBay.id, npcWithoutDamage)
                  }
                }}
                position={armamentBay.npc.position || 'NPC'}
                tilted={false}
                disabled={false}
                disableHPEditing={true}
              />

              {armamentBay.choices?.map((choice) => {
                if (choice.id === ARMAMENT_BAY_WEAPON_CHOICE_ID) {
                  const selectedWeapon = state.armamentBayWeaponId
                    ? SalvageUnionReference.get('systems', state.armamentBayWeaponId)
                    : null

                  return (
                    <Box key={choice.id}>
                      <Text variant="pseudoheader" fontSize="md" mb={2} textTransform="uppercase">
                        {choice.name}
                      </Text>
                      {selectedWeapon ? (
                        <VStack gap={2} alignItems="stretch">
                          <Box p={3} bg="su.lightBlue" borderRadius="md">
                            <Text fontSize="sm" fontWeight="bold" mb={1}>
                              Selected Weapon:
                            </Text>
                            <Text fontSize="md">{selectedWeapon.name}</Text>
                          </Box>
                          <Button
                            bg="brand.srd"
                            color="su.white"
                            onClick={handleWeaponRemove}
                            size="sm"
                          >
                            Change Weapon
                          </Button>
                        </VStack>
                      ) : (
                        <Button
                          bg="su.orange"
                          color="su.white"
                          w="full"
                          onClick={() => setIsWeaponModalOpen(true)}
                        >
                          Select Weapon System
                        </Button>
                      )}
                      <EntitySelectionModal
                        isOpen={isWeaponModalOpen}
                        onClose={() => setIsWeaponModalOpen(false)}
                        schemaNames={['systems']}
                        onSelect={(entityId) => handleWeaponSelect(entityId)}
                        title="Select Armament Bay Weapon System"
                        selectButtonTextPrefix="Select"
                        selectedEntityId={state.armamentBayWeaponId}
                        selectedEntitySchemaName="systems"
                      />
                    </Box>
                  )
                }
                return null
              })}
            </VStack>
          </RoundedBox>
        </VStack>
      )}

      <Button
        w="full"
        bg={state.armamentBayWeaponId ? 'su.orange' : 'gray.400'}
        color="su.white"
        borderWidth="3px"
        borderColor="su.black"
        borderRadius="md"
        fontSize="lg"
        fontWeight="bold"
        py={6}
        _hover={state.armamentBayWeaponId ? { bg: 'su.black' } : {}}
        disabled={!state.armamentBayWeaponId}
        _disabled={{ opacity: 0.6, cursor: 'not-allowed' }}
        onClick={handleNext}
      >
        ENTER CRAWLER NAME
      </Button>
    </VStack>
  )
}
