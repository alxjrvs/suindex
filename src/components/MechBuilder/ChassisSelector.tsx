import { useMemo } from 'react'
import type { Chassis } from 'salvageunion-reference'

interface ChassisSelectorProps {
  chassisId: string | null
  allChassis: Chassis[]
  onChange: (chassisId: string) => void
}

export function ChassisSelector({ chassisId, allChassis, onChange }: ChassisSelectorProps) {
  const groupedChassis = useMemo(() => {
    const groups = new Map<number, Chassis[]>()

    allChassis.forEach((chassis) => {
      const techLevel = chassis.stats.tech_level
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
    <div>
      <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase">Chassis</label>
      <select
        value={chassisId || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold"
      >
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
      </select>
    </div>
  )
}
