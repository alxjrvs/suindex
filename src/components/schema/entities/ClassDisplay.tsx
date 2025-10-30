import { SalvageUnionReference } from 'salvageunion-reference'
import type {
  SURefCoreClass,
  SURefAdvancedClass,
  SURefHybridClass,
  SURefAbility,
} from 'salvageunion-reference'
import { EntityDisplay } from '../../entity/EntityDisplay'
import { ClassAbilitiesList } from '../../PilotLiveSheet/ClassAbilitiesList'

interface ClassDisplayProps {
  data: SURefCoreClass | SURefAdvancedClass | SURefHybridClass
  compact?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean
  onClick?: () => void
  hideActions?: boolean
}

interface HydratedAbilities {
  [key: string]: SURefAbility[]
}

export function ClassDisplay({
  data,
  compact = false,
  collapsible = false,
  defaultExpanded = true,
  onClick,
  hideActions = false,
}: ClassDisplayProps) {
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
    <EntityDisplay
      schemaName={schemaName}
      rightLabel={label}
      data={data}
      headerColor={headerColor}
      compact={compact}
      collapsible={collapsible}
      defaultExpanded={defaultExpanded}
      onClick={onClick}
      hideActions={hideActions}
    >
      {!hideActions && (
        <ClassAbilitiesList
          selectedClass={isCoreClass ? (data as SURefCoreClass) : undefined}
          selectedAdvancedClass={
            !isCoreClass ? (data as SURefAdvancedClass | SURefHybridClass) : undefined
          }
        />
      )}
    </EntityDisplay>
  )
}
