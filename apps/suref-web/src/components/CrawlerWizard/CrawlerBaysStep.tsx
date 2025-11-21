import { useMemo, useCallback, useState } from 'react'
import { Box, VStack, Button, Grid } from '@chakra-ui/react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type {
  SURefCrawlerBay,
  SURefEnumSchemaName,
  SURefEntity,
  SURefObjectChoice,
} from 'salvageunion-reference'
import { Text } from '@/components/base/Text'
import { RoundedBox } from '@/components/shared/RoundedBox'
import { NPCCard } from '@/components/shared/NPCCard'
import { EntityDisplay } from '@/components/entity/EntityDisplay'
import { EntitySelectionModal } from '@/components/entity/EntitySelectionModal'
import { getParagraphString } from '@/lib/contentBlockHelpers'
import { getTiltRotation } from '@/utils/tiltUtils'
import { useParseTraitReferences } from '@/utils/parseTraitReferences'
import type { UseCrawlerWizardStateReturn } from './useCrawlerWizardState'
import type { BayNPCData } from './utils'

interface CrawlerBaysStepProps {
  wizardState: UseCrawlerWizardStateReturn
  onComplete: () => void
}

const ARMAMENT_BAY_WEAPON_CHOICE_ID = '383de916-bbd6-4e34-9cfc-1b37e12178c8'

export function CrawlerBaysStep({ wizardState, onComplete }: CrawlerBaysStepProps) {
  const { state, setBayNPC, setBayNPCChoice, setArmamentBayWeaponId } = wizardState

  const allBays = useMemo(() => SalvageUnionReference.CrawlerBays.all(), [])

  // All bays including Armament Bay - all rendered in the grid
  const regularBays = useMemo(() => {
    return allBays
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

  // Handle bay-level choice updates (for Armament Bay weapon, etc.)
  const handleBayChoiceUpdate = useCallback(
    (_bayId: string, choiceId: string, value: string | undefined) => {
      // Handle Armament Bay weapon choice
      if (choiceId === ARMAMENT_BAY_WEAPON_CHOICE_ID) {
        if (value) {
          // Extract entity ID from the ref value (format: "systems::entity-id")
          const parsed = SalvageUnionReference.parseRef(value)
          if (parsed) {
            setArmamentBayWeaponId(parsed.id)
          }
        } else {
          setArmamentBayWeaponId(null)
        }
      }
    },
    [setArmamentBayWeaponId]
  )

  // Get the selected weapon value for Armament Bay
  const getArmamentBayWeaponValue = useCallback(
    (bayId: string): string | undefined => {
      // Check if this bay has the armament bay weapon choice
      const bay = allBays.find((b) => b.id === bayId)
      const isArmamentBay = bay?.choices?.some(
        (choice) => choice.id === ARMAMENT_BAY_WEAPON_CHOICE_ID
      )
      if (isArmamentBay && state.armamentBayWeaponId) {
        return SalvageUnionReference.composeRef('systems', state.armamentBayWeaponId)
      }
      return undefined
    },
    [allBays, state.armamentBayWeaponId]
  )

  const handleNext = useCallback(() => {
    if (state.armamentBayWeaponId) {
      onComplete()
    }
  }, [state.armamentBayWeaponId, onComplete])

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

      {regularBays.length > 0 && (
        <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4}>
          {regularBays.map((bay) => (
            <WizardBayCard
              key={bay.id}
              bay={bay}
              bayNPC={state.bayNPCs[bay.id]}
              onNPCUpdate={handleNPCUpdate}
              onBayChoiceUpdate={handleBayChoiceUpdate}
              selectedWeaponValue={getArmamentBayWeaponValue(bay.id)}
              bayNPCChoices={state.bayNPCChoices}
              setBayNPCChoice={setBayNPCChoice}
            />
          ))}
        </Grid>
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

// Wizard-specific BayCard component that works with wizard state
function WizardBayCard({
  bay,
  bayNPC,
  onNPCUpdate,
  onBayChoiceUpdate,
  selectedWeaponValue,
  bayNPCChoices,
  setBayNPCChoice,
}: {
  bay: SURefCrawlerBay
  bayNPC?: BayNPCData
  onNPCUpdate: (bayId: string, updates: Partial<BayNPCData>) => void
  onBayChoiceUpdate: (bayId: string, choiceId: string, value: string | undefined) => void
  selectedWeaponValue?: string
  bayNPCChoices: Record<string, Record<string, string>>
  setBayNPCChoice: (bayId: string, choiceId: string, value: string) => void
}) {
  const npc = bayNPC || {
    name: '',
    notes: '',
    hitPoints: bay.npc.hitPoints || null,
    damage: 0,
  }

  const metadata = {
    damaged: false,
    npc,
  }

  // Get NPC choice definitions from the bay reference
  const npcChoiceDefinitions = useMemo(() => {
    if ('npc' in bay && bay.npc && 'choices' in bay.npc) {
      return bay.npc.choices || []
    }
    return []
  }, [bay])

  // Build choices array from wizard state for NPCCard
  // NPCCard expects Tables<'player_choices'>[] format
  const choicesForNPCCard = useMemo(() => {
    const bayChoices = bayNPCChoices[bay.id] || {}
    return npcChoiceDefinitions
      .filter((choice) => {
        // Include choices that have values in wizard state
        return bayChoices[choice.id] !== undefined && bayChoices[choice.id] !== ''
      })
      .map((choice) => ({
        id: `wizard-${bay.id}-${choice.id}`,
        entity_id: `wizard-${bay.id}`,
        choice_ref_id: choice.id,
        value: bayChoices[choice.id] || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        player_choice_id: null,
      })) as Array<{
      id: string
      entity_id: string | null
      choice_ref_id: string
      value: string
      created_at: string
      updated_at: string
      player_choice_id: string | null
    }>
  }, [bayNPCChoices, bay.id, npcChoiceDefinitions])

  // Only calculate rotation on client to avoid hydration mismatch
  const [titleRotation] = useState(() => getTiltRotation())
  const [bayInfoRotation] = useState(() => getTiltRotation())

  // Handle NPC choice updates (for name, etc.)
  // NPCCard passes (choiceId: string, value: string), so we update both wizard state and NPC data
  const handleBayChoiceUpdate = useCallback(
    (choiceId: string, value: string) => {
      // Store choice value in wizard state
      if (choiceId && value !== undefined) {
        setBayNPCChoice(bay.id, choiceId, value)
        // Also update NPC name in bayNPCs for backward compatibility
        // (Name choice updates the NPC name)
        const choice = npcChoiceDefinitions.find((c) => c.id === choiceId)
        if (choice?.name === 'Name') {
          onNPCUpdate(bay.id, { name: value })
        }
      }
    },
    [bay.id, npcChoiceDefinitions, setBayNPCChoice, onNPCUpdate]
  )

  // Handle NPC updates (notes, etc.)
  const handleBayNPCUpdate = useCallback(
    (updates: Partial<{ npc: typeof npc }>) => {
      if (!updates.npc) return
      // Exclude damage from updates - HP is not editable in wizard
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { damage: _damage, ...npcWithoutDamage } = updates.npc
      onNPCUpdate(bay.id, npcWithoutDamage)
    },
    [bay.id, onNPCUpdate]
  )

  return (
    <RoundedBox
      bg={metadata.damaged ? 'su.grey' : 'su.crawlerPink'}
      justifyContent="flex-start"
      title={bay.name}
      titleRotation={metadata.damaged ? titleRotation : 0}
      disabled={false}
    >
      <Box position="relative" w="full">
        {metadata.damaged && bay.damagedEffect && (
          <Box
            position="absolute"
            top="50%"
            left={0}
            right={0}
            transform="translateY(-50%)"
            zIndex={1}
            px={2}
            filter="drop-shadow(0 0 4px rgba(0, 0, 0, 0.8))"
          >
            <Box
              bg="white"
              border="2px solid"
              borderColor="su.black"
              overflow="hidden"
              textAlign="left"
              borderRadius="md"
            >
              <Box
                bg="white"
                color="su.black"
                fontWeight="medium"
                lineHeight="relaxed"
                fontSize="sm"
                px={2}
                py={2}
              >
                <Text
                  fontSize="sm"
                  textTransform="uppercase"
                  fontWeight="bold"
                  color="su.black"
                  mb={1}
                >
                  Damaged Effect
                </Text>
                {bay.damagedEffect}
              </Box>
            </Box>
          </Box>
        )}

        <VStack gap={2} alignItems="stretch" w="full">
          <Box opacity={metadata.damaged ? 0.5 : 1} transition="opacity 0.3s ease">
            <NPCCard
              npc={metadata.npc}
              choices={choicesForNPCCard}
              referenceBay={bay}
              description={getParagraphString(bay.npc.content) || ''}
              maxHP={bay.npc.hitPoints || 0}
              onUpdateChoice={handleBayChoiceUpdate}
              onUpdateBay={handleBayNPCUpdate}
              position={bay.npc.position || 'NPC'}
              tilted={metadata.damaged}
              disabled={false}
            />
          </Box>

          <Box
            transform={metadata.damaged ? `rotate(${bayInfoRotation}deg)` : undefined}
            transition="transform 0.3s ease"
            opacity={metadata.damaged ? 0.5 : 1}
          >
            <WizardBayInfo
              bayRef={bay}
              onUpdateChoice={(choiceId, value) => onBayChoiceUpdate(bay.id, choiceId, value)}
              selectedWeaponValue={selectedWeaponValue}
            />
          </Box>
        </VStack>
      </Box>
    </RoundedBox>
  )
}

// Wizard-specific BayInfo that works without entity IDs
function WizardBayInfo({
  bayRef,
  onUpdateChoice,
  selectedWeaponValue,
}: {
  bayRef: SURefCrawlerBay
  onUpdateChoice: (choiceId: string, value: string | undefined) => void
  selectedWeaponValue?: string
}) {
  const [isFunctionExpanded, setIsFunctionExpanded] = useState(false)

  const description = getParagraphString(bayRef.content)
  const parsedDescription = useParseTraitReferences(description || '')

  if (!description && (!bayRef.choices || bayRef.choices.length === 0)) {
    return null
  }

  const hasFunction = !!description

  return (
    <VStack mt="2" gap={2} justifyContent="flex-start" alignItems="stretch" w="full">
      {/* Render bay-level choices (like Armament Bay weapon) using SheetEntityChoiceDisplay */}
      {bayRef.choices?.map((choice) => {
        // For wizard, we need to handle the choice update and provide the selected value
        const selectedValue =
          choice.id === ARMAMENT_BAY_WEAPON_CHOICE_ID ? selectedWeaponValue : undefined

        return (
          <WizardSheetEntityChoiceDisplay
            key={choice.id}
            choice={choice}
            onUpdateChoice={onUpdateChoice}
            selectedValue={selectedValue}
          />
        )
      })}
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

// Wizard-specific choice display that mimics SheetEntityChoiceDisplay
// but works with wizard state instead of entity IDs
function WizardSheetEntityChoiceDisplay({
  choice,
  onUpdateChoice,
  selectedValue,
}: {
  choice: SURefObjectChoice
  onUpdateChoice?: (choiceId: string, value: string | undefined) => void
  selectedValue?: string
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const hasChoiceOptions = 'choiceOptions' in choice && choice.choiceOptions

  const schemaNames = useMemo(() => {
    const { schema } = choice
    if (!schema) return []

    const pluralToSchemaName: Record<string, SURefEnumSchemaName> = {
      Systems: 'systems',
      Modules: 'modules',
      Abilities: 'abilities',
      Crawlers: 'crawlers',
      CrawlerBays: 'crawler-bays',
      Creatures: 'creatures',
      Drones: 'drones',
      Vehicles: 'vehicles',
      BioTitans: 'bio-titans',
      NPCs: 'npcs',
      Squads: 'squads',
      Keywords: 'keywords',
      Traits: 'traits',
      RollTables: 'roll-tables',
      CrawlerTechLevels: 'crawler-tech-levels',
    }

    return schema
      .map((s) => {
        if (s in pluralToSchemaName) {
          return pluralToSchemaName[s as keyof typeof pluralToSchemaName]
        }
        return s as SURefEnumSchemaName
      })
      .filter((name): name is SURefEnumSchemaName => name !== undefined)
  }, [choice])

  const selectedEntity = useMemo(() => {
    if (!selectedValue) return null

    const entity = SalvageUnionReference.getByRef(selectedValue)
    if (!entity) return null

    const parsed = SalvageUnionReference.parseRef(selectedValue)
    if (!parsed) return null

    return {
      entity: entity as SURefEntity,
      schemaName: parsed.schemaName.toLowerCase() as SURefEnumSchemaName,
    }
  }, [selectedValue])

  const handleSelect = useCallback(
    (entityId: string, schemaName: SURefEnumSchemaName) => {
      const value = SalvageUnionReference.composeRef(schemaName, entityId)
      onUpdateChoice?.(choice.id, value)
      setIsModalOpen(false)
    },
    [choice.id, onUpdateChoice]
  )

  const handleSelectOption = useCallback(
    (value: string) => {
      onUpdateChoice?.(choice.id, value)
    },
    [choice.id, onUpdateChoice]
  )

  const handleRemove = useCallback(() => {
    onUpdateChoice?.(choice.id, undefined)
  }, [choice.id, onUpdateChoice])

  const entityName =
    selectedEntity?.entity && 'name' in selectedEntity.entity
      ? selectedEntity.entity.name
      : choice.name

  // Handle choiceOptions (like Custom Sniper Rifle modifications)
  if (hasChoiceOptions && 'choiceOptions' in choice && choice.choiceOptions) {
    type ChoiceOption = { label: string; value: string; description?: string }
    const availableOptions = Array.isArray(choice.choiceOptions)
      ? (choice.choiceOptions as ChoiceOption[])
      : []
    const isSelected =
      selectedValue && availableOptions.some((opt: ChoiceOption) => opt.value === selectedValue)

    return (
      <VStack gap={2} alignItems="stretch" mt={2}>
        {isSelected && (
          <Box p={3} bg="su.lightBlue" borderRadius="md">
            <Text fontSize="md" fontWeight="bold" mb={1}>
              {availableOptions.find((opt: ChoiceOption) => opt.value === selectedValue)?.label}
            </Text>
            {onUpdateChoice && (
              <Button
                bg="brand.srd"
                color="su.white"
                size="sm"
                onClick={() => handleRemove()}
                mt={2}
              >
                Remove
              </Button>
            )}
          </Box>
        )}
        {onUpdateChoice && !isSelected && (
          <VStack gap={2} alignItems="stretch" mt={2}>
            {availableOptions.map((option: ChoiceOption) => (
              <Box
                key={option.value}
                p={3}
                bg="su.white"
                borderWidth="2px"
                borderColor="su.black"
                borderRadius="md"
              >
                <Text fontSize="md" fontWeight="bold" mb={option.description ? 1 : 0}>
                  {option.label}
                </Text>
                {option.description && (
                  <Text fontSize="sm" color="su.black" opacity={0.8} mb={2}>
                    {option.description}
                  </Text>
                )}
                <Button
                  bg="su.orange"
                  color="su.white"
                  size="sm"
                  onClick={() => handleSelectOption(option.value)}
                  mt={2}
                >
                  Add
                </Button>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    )
  }

  // Handle single-select (existing behavior)
  return (
    <>
      {!selectedEntity ? (
        onUpdateChoice && (
          <Button onClick={() => setIsModalOpen(true)} w="full" mt={2}>
            Select {choice.name}
          </Button>
        )
      ) : (
        <EntityDisplay
          schemaName={selectedEntity.schemaName}
          data={selectedEntity.entity}
          compact
          collapsible
          defaultExpanded={false}
          buttonConfig={
            onUpdateChoice
              ? {
                  bg: 'brand.srd',
                  color: 'su.white',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  _hover: { bg: 'su.black' },
                  onClick: (e) => {
                    e.stopPropagation()
                    const confirmed = window.confirm(
                      `Are you sure you want to remove "${entityName}"?`
                    )
                    if (confirmed) {
                      handleRemove()
                    }
                  },
                  children: `Remove ${choice.name}`,
                }
              : undefined
          }
        />
      )}

      {onUpdateChoice && (
        <EntitySelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          schemaNames={schemaNames}
          onSelect={handleSelect}
          title={`Select ${choice.name}`}
        />
      )}
    </>
  )
}
