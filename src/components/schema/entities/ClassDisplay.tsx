import { VStack } from '@chakra-ui/react'
import { Heading } from '../../base/Heading'
import { SalvageUnionReference } from 'salvageunion-reference'
import type {
  SURefCoreClass,
  SURefAdvancedClass,
  SURefHybridClass,
  SURefAbility,
} from 'salvageunion-reference'
import { EntityDisplay } from '../../shared/EntityDisplay'
import { SheetDisplay } from '../../shared/SheetDisplay'
import { AbilityDisplay } from './AbilityDisplay'

interface ClassDisplayProps {
  data: SURefCoreClass | SURefAdvancedClass | SURefHybridClass
}

interface HydratedAbilities {
  [key: string]: SURefAbility[]
}

function AbilitySection({
  title,
  abilities,
  headerColor,
}: {
  title: string
  abilities: HydratedAbilities
  headerColor: string
}) {
  const abilityKeys = Object.keys(abilities)

  if (abilityKeys.length === 0) return null

  return (
    <VStack gap={3} alignItems="stretch">
      <Heading level="h3" textTransform="uppercase" textAlign="center" py={2}>
        {title}
      </Heading>
      <VStack gap={4} alignItems="stretch">
        {abilityKeys.map((key) => (
          <AbilityList
            key={key}
            treeKey={key}
            abilities={abilities[key]}
            headerColor={headerColor}
          />
        ))}
      </VStack>
    </VStack>
  )
}

function AbilityList({
  treeKey,
  abilities,
}: {
  treeKey: string
  abilities: SURefAbility[]
  headerColor: string
}) {
  if (abilities.length === 0) return null

  return (
    <SheetDisplay label={treeKey}>
      <VStack gap={3} alignItems="stretch">
        {abilities.map((ability, index) => {
          const data = SalvageUnionReference.findIn('abilities', (ref) => ref.id === ability.id)
          console.log('data', data)
          return (
            <AbilityDisplay
              key={index}
              data={SalvageUnionReference.findIn('abilities', (ref) => ref.id === ability.id)}
            />
          )
        })}
      </VStack>
    </SheetDisplay>
  )
}

export function ClassDisplay({ data }: ClassDisplayProps) {
  // Determine class type based on which fields are present
  const isCoreClass = 'coreTrees' in data
  const isHybridClass = !isCoreClass && !data.name.includes('Advanced')

  const coreAbilities: HydratedAbilities = {}

  // Core classes have coreTrees
  if (isCoreClass) {
    const coreClass = data as SURefCoreClass
    coreClass.coreTrees.forEach((tree) => {
      coreAbilities[tree] = SalvageUnionReference.findAllIn(
        'abilities',
        (a) => a.tree === tree
      ).sort((a, b) => Number(a.level) - Number(b.level))
    })
  }

  const advancedAbilities: HydratedAbilities = {}
  // Advanced and Hybrid classes have advancedTree
  if ('advancedTree' in data) {
    const classWithAdvanced = data as SURefAdvancedClass | SURefHybridClass
    advancedAbilities[classWithAdvanced.advancedTree] = SalvageUnionReference.findAllIn(
      'abilities',
      (a) => a.tree === classWithAdvanced.advancedTree
    ).sort((a, b) => Number(a.level) - Number(b.level))
  }

  const legendaryAbilities: HydratedAbilities = {}
  if ('legendaryTree' in data && data.legendaryTree) {
    const classWithLegendary = data as SURefAdvancedClass | SURefHybridClass
    legendaryAbilities[classWithLegendary.legendaryTree] = SalvageUnionReference.findAllIn(
      'abilities',
      (a) => a.tree === classWithLegendary.legendaryTree
    ).sort((a, b) => Number(a.level) - Number(b.level))
  }

  // Determine header color and schema name based on class type
  const headerColor = isCoreClass ? 'su.orange' : 'su.pink'
  const schemaName = isCoreClass
    ? 'classes.core'
    : isHybridClass
      ? 'classes.hybrid'
      : 'classes.advanced'

  const label = isCoreClass ? 'Core Class' : isHybridClass ? 'Hybrid Class' : 'Advanced Class'
  return (
    <EntityDisplay schemaName={schemaName} rightLabel={label} data={data} headerColor={headerColor}>
      <VStack gap={6} alignItems="stretch">
        {Object.keys(coreAbilities).length > 0 && (
          <AbilitySection title="Core Abilities" abilities={coreAbilities} headerColor="su.brick" />
        )}

        {Object.keys(advancedAbilities).length > 0 && (
          <AbilitySection
            title="Advanced Abilities"
            abilities={advancedAbilities}
            headerColor="su.orange"
          />
        )}

        {Object.keys(legendaryAbilities).length > 0 && (
          <AbilitySection
            title="Legendary Abilities"
            abilities={legendaryAbilities}
            headerColor="su.pink"
          />
        )}
      </VStack>
    </EntityDisplay>
  )
}
