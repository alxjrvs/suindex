import { useState, useRef, useEffect } from 'react'
import { Box, Flex, Text, Textarea, VStack } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import { SalvageUnionReference } from 'salvageunion-reference'
import { PilotInfoInputs } from './PilotInfoInputs'
import { PilotResourceSteppers } from './PilotResourceSteppers'
import { AbilitiesList } from './AbilitiesList'
import { AbilitySelector } from './AbilitySelector'
import { PilotInventory } from './PilotInventory'
import { EquipmentSelector } from './EquipmentSelector'
import { BuilderLayout } from '../shared/BuilderLayout'
import { BuilderControlBar } from '../shared/BuilderControlBar'
import { usePilotState } from './usePilotState'

interface PilotBuilderProps {
  id?: string
}

export default function PilotBuilder({ id }: PilotBuilderProps = {}) {
  const [isAbilitySelectorOpen, setIsAbilitySelectorOpen] = useState(false)
  const [isEquipmentSelectorOpen, setIsEquipmentSelectorOpen] = useState(false)

  const allClasses = SalvageUnionReference.Classes.all()
  const allAbilities = SalvageUnionReference.Abilities.all()
  const allEquipment = SalvageUnionReference.Equipment.all()

  const {
    pilot,
    selectedClass,
    selectedAdvancedClass,
    availableAdvancedClasses,
    handleClassChange,
    handleAddAbility,
    handleRemoveAbility,
    handleAddLegendaryAbility,
    handleRemoveLegendaryAbility,
    handleAddEquipment,
    handleRemoveEquipment,
    updatePilot,
    save,
    resetChanges,
    loading,
    error,
  } = usePilotState(id)

  // Track initial state for detecting changes
  const initialStateRef = useRef<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savedCrawlerId, setSavedCrawlerId] = useState<string | null>(null)

  // Set initial state after loading completes
  useEffect(() => {
    if (!id || loading) return
    if (initialStateRef.current === null) {
      initialStateRef.current = JSON.stringify(pilot)
      setSavedCrawlerId(pilot.crawler_id ?? null)
    }
  }, [id, loading, pilot])

  // Detect changes
  useEffect(() => {
    if (!id || initialStateRef.current === null) return
    const currentState = JSON.stringify(pilot)
    setHasUnsavedChanges(currentState !== initialStateRef.current)
  }, [pilot, id])

  // Update initial state ref after save or reset
  const handleSave = async () => {
    await save()
    initialStateRef.current = JSON.stringify(pilot)
    setSavedCrawlerId(pilot.crawler_id ?? null)
    setHasUnsavedChanges(false)
  }

  const handleResetChanges = async () => {
    await resetChanges()
    initialStateRef.current = JSON.stringify(pilot)
    setHasUnsavedChanges(false)
  }

  if (loading) {
    return (
      <BuilderLayout>
        <Flex alignItems="center" justifyContent="center" h="64">
          <Text fontSize="xl" fontFamily="mono">
            Loading pilot...
          </Text>
        </Flex>
      </BuilderLayout>
    )
  }

  if (error) {
    return (
      <BuilderLayout>
        <Flex alignItems="center" justifyContent="center" h="64">
          <VStack textAlign="center">
            <Text fontSize="xl" fontFamily="mono" color="red.600" mb={4}>
              Error loading pilot
            </Text>
            <Text fontSize="sm" fontFamily="mono" color="gray.600">
              {error}
            </Text>
          </VStack>
        </Flex>
      </BuilderLayout>
    )
  }

  return (
    <BuilderLayout>
      {id && (
        <BuilderControlBar
          backgroundColor="var(--color-su-orange)"
          entityType="pilot"
          crawlerId={pilot.crawler_id}
          savedCrawlerId={savedCrawlerId}
          onCrawlerChange={(crawlerId) => updatePilot({ crawler_id: crawlerId })}
          onSave={handleSave}
          onResetChanges={handleResetChanges}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      )}
      {/* Top Section: Pilot Info and Resources */}
      <Flex gap={6}>
        {/* Middle: Pilot Info */}
        <Box flex="1">
          <PilotInfoInputs
            callsign={pilot.callsign}
            motto={pilot.motto ?? ''}
            mottoUsed={pilot.motto_used ?? false}
            keepsake={pilot.keepsake ?? ''}
            keepsakeUsed={pilot.keepsake_used ?? false}
            background={pilot.background ?? ''}
            backgroundUsed={pilot.background_used ?? false}
            appearance={pilot.appearance ?? ''}
            classId={pilot.class_id ?? null}
            advancedClassId={pilot.advanced_class_id ?? null}
            allClasses={allClasses}
            availableAdvancedClasses={availableAdvancedClasses}
            disabled={false}
            onCallsignChange={(value) => updatePilot({ callsign: value })}
            onMottoChange={(value) => updatePilot({ motto: value })}
            onMottoUsedChange={(value) => updatePilot({ motto_used: value })}
            onKeepsakeChange={(value) => updatePilot({ keepsake: value })}
            onKeepsakeUsedChange={(value) => updatePilot({ keepsake_used: value })}
            onBackgroundChange={(value) => updatePilot({ background: value })}
            onBackgroundUsedChange={(value) => updatePilot({ background_used: value })}
            onAppearanceChange={(value) => updatePilot({ appearance: value })}
            onClassChange={handleClassChange}
            onAdvancedClassChange={(value) => updatePilot({ advanced_class_id: value })}
          />
        </Box>

        {/* Right: Resource Steppers */}
        <Box w="40">
          <PilotResourceSteppers
            maxHP={pilot.max_hp ?? 10}
            currentDamage={pilot.current_damage ?? 0}
            maxAP={pilot.max_ap ?? 5}
            currentAP={pilot.current_ap ?? 5}
            currentTP={pilot.current_tp ?? 0}
            onDamageChange={(value) => updatePilot({ current_damage: value })}
            onAPChange={(value) => updatePilot({ current_ap: value })}
            onTPChange={(value) => updatePilot({ current_tp: value })}
            disabled={!selectedClass}
          />
        </Box>
      </Flex>

      {/* Abilities Section */}
      <AbilitiesList
        abilities={pilot.abilities ?? []}
        legendaryAbility={
          pilot.legendary_ability_id
            ? allAbilities.find((a) => a.id === pilot.legendary_ability_id) || null
            : null
        }
        onRemove={handleRemoveAbility}
        onRemoveLegendary={handleRemoveLegendaryAbility}
        onAddClick={() => setIsAbilitySelectorOpen(true)}
        currentTP={pilot.current_tp ?? 0}
        disabled={!selectedClass}
        coreTreeNames={selectedClass?.coreAbilities || []}
      />

      {/* Equipment Section */}
      <PilotInventory
        equipment={pilot.equipment ?? []}
        onAddClick={() => setIsEquipmentSelectorOpen(true)}
        onRemove={handleRemoveEquipment}
      />

      {/* Notes Section */}
      <Box
        bg="var(--color-su-orange)"
        borderWidth="8px"
        borderColor="var(--color-su-orange)"
        borderRadius="3xl"
        p={6}
        shadow="lg"
      >
        <Heading level="h2" textTransform="uppercase" mb={4}>
          Notes
        </Heading>
        <Textarea
          value={pilot.notes ?? ''}
          onChange={(e) => updatePilot({ notes: e.target.value })}
          disabled={false}
          placeholder="Add notes about your pilot..."
          w="full"
          h={96}
          p={4}
          borderWidth={0}
          borderRadius="2xl"
          bg="#e8e5d8"
          color="#2d3e36"
          fontWeight="semibold"
          resize="none"
          _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
        />
      </Box>

      {/* Ability Selector Modal */}
      <AbilitySelector
        isOpen={isAbilitySelectorOpen}
        onClose={() => setIsAbilitySelectorOpen(false)}
        abilities={allAbilities}
        onSelectAbility={handleAddAbility}
        onSelectLegendaryAbility={handleAddLegendaryAbility}
        selectedAbilityIds={pilot.abilities ?? []}
        selectedLegendaryAbilityId={pilot.legendary_ability_id ?? null}
        selectedClass={selectedClass}
        selectedAdvancedClass={selectedAdvancedClass}
        currentTP={pilot.current_tp ?? 0}
      />

      {/* Equipment Selector Modal */}
      <EquipmentSelector
        isOpen={isEquipmentSelectorOpen}
        onClose={() => setIsEquipmentSelectorOpen(false)}
        equipment={allEquipment}
        onSelectEquipment={handleAddEquipment}
      />
    </BuilderLayout>
  )
}
