import { useMemo } from 'react'
import { SheetSelect } from '../shared/SheetSelect'
import type { SURefChassis } from 'salvageunion-reference'

interface ChassisSelectorProps {
  chassisId: string | null
  allChassis: SURefChassis[]
  onChange: (chassisId: string | null) => void
}

export function ChassisSelector({ chassisId, allChassis, onChange }: ChassisSelectorProps) {
  const groupedChassis = useMemo(() => {
    const groups = new Map<number, SURefChassis[]>()

    allChassis.forEach((chassis) => {
      const techLevel = chassis.stats.techLevel
      if (!groups.has(techLevel)) {
        groups.set(techLevel, [])
      }
      groups.get(techLevel)!.push(chassis)
    })

    const sortedGroups = Array.from(groups.entries())
      .sort(([a], [b]) => a - b)
      .map(([techLevel, chassis]) => ({
        techLevel,
        chassis: chassis.sort((a, b) => a.name.localeCompare(b.name)),
      }))

    return sortedGroups
  }, [allChassis])

  return (
    <SheetSelect label="Chassis" value={chassisId} onChange={onChange}>
      <option value="">Select a chassis...</option>
      {groupedChassis.map(({ techLevel, chassis }) => (
        <optgroup key={techLevel} label={`Tech Level ${techLevel}`}>
          {chassis.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </optgroup>
      ))}
    </SheetSelect>
  )
}
