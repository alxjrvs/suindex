import { useMemo } from 'react'
import { Flex, Grid } from '@chakra-ui/react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefSystem, SURefModule } from 'salvageunion-reference'
import { EntityDisplay } from '../entity/EntityDisplay'
import { StatDisplay } from '../StatDisplay'
import { AddStatButton } from '../shared/AddStatButton'
import { RoundedBox } from '../shared/RoundedBox'

interface SystemsModulesListProps {
  systems: string[] // Array of System IDs
  modules: string[] // Array of Module IDs
  usedSystemSlots: number
  usedModuleSlots: number
  totalSystemSlots: number
  totalModuleSlots: number
  canAddMore: boolean
  onRemoveSystem: (id: string) => void
  onRemoveModule: (id: string) => void
  onAddClick: () => void
  disabled?: boolean
}

export function SystemsModulesList({
  systems,
  modules,
  usedSystemSlots,
  usedModuleSlots,
  totalSystemSlots,
  totalModuleSlots,
  canAddMore,
  onRemoveSystem,
  onRemoveModule,
  onAddClick,
  disabled = false,
}: SystemsModulesListProps) {
  const allSystems = useMemo(() => SalvageUnionReference.findAllIn('systems', () => true), [])
  const allModules = useMemo(() => SalvageUnionReference.findAllIn('modules', () => true), [])

  const sortedSystems = useMemo(() => {
    return systems
      .map((id) => allSystems.find((s) => s.id === id))
      .filter((s): s is SURefSystem => s !== undefined)
      .sort((a, b) => {
        if (a.techLevel !== b.techLevel) {
          return a.techLevel - b.techLevel
        }
        return a.name.localeCompare(b.name)
      })
  }, [systems, allSystems])

  const sortedModules = useMemo(() => {
    return modules
      .map((id) => allModules.find((m) => m.id === id))
      .filter((m): m is SURefModule => m !== undefined)
      .sort((a, b) => {
        if (a.techLevel !== b.techLevel) {
          return a.techLevel - b.techLevel
        }
        return a.name.localeCompare(b.name)
      })
  }, [modules, allModules])

  // Combine systems and modules into a single sorted array
  const combinedItems = useMemo(() => {
    const systemItems = sortedSystems.map((item) => ({ type: 'system' as const, data: item }))
    const moduleItems = sortedModules.map((item) => ({ type: 'module' as const, data: item }))
    return [...systemItems, ...moduleItems]
  }, [sortedSystems, sortedModules])

  return (
    <>
      <RoundedBox
        bg="bg.builder.mech"
        title="Systems & Modules"
        disabled={disabled}
        rightContent={
          <Flex gap={3}>
            <AddStatButton
              onClick={onAddClick}
              disabled={disabled || !canAddMore}
              bottomLabel="System"
            />
            <StatDisplay
              label="Sys."
              bottomLabel="Slots"
              value={usedSystemSlots}
              outOfMax={totalSystemSlots}
              disabled={disabled}
            />
            <StatDisplay
              label="Mod."
              bottomLabel="Slots"
              value={usedModuleSlots}
              outOfMax={totalModuleSlots}
              disabled={disabled}
            />
          </Flex>
        }
      />
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
        {combinedItems.map((item) => {
          const handleRemove =
            item.type === 'system'
              ? () => onRemoveSystem(item.data.id)
              : () => onRemoveModule(item.data.id)

          return (
            <EntityDisplay
              key={`${item.type}-${item.data.id}`}
              schemaName={item.type === 'system' ? 'systems' : 'modules'}
              data={item.data}
              collapsible
              compact
              defaultExpanded={false}
              onRemove={handleRemove}
              removeConfirmMessage={`Are you sure you want to remove "${item.data.name}"?`}
              disabled={disabled}
            />
          )
        })}
      </Grid>
    </>
  )
}
