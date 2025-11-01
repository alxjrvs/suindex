import { PilotGridCard } from './PilotGridCard'
import { EntityGrid } from './EntityGrid'
import { usePilotClasses } from '../../hooks/suentity'
import { useEntityGrid } from '../../hooks/useEntityGrid'
import type { Tables } from '../../types/database-generated.types'

export function PilotsGrid() {
  // Fetch pilots to get IDs for singleton query
  const { items: pilots } = useEntityGrid<Tables<'pilots'>>({
    table: 'pilots',
    orderBy: 'created_at',
    orderAscending: false,
  })

  const pilotIds = pilots.map((p) => p.id)
  const { data: pilotClassData } = usePilotClasses(pilotIds)

  return (
    <EntityGrid<'pilots'>
      table="pilots"
      title="Your Pilots"
      createButtonLabel="New Pilot"
      createButtonBgColor="su.orange"
      createButtonColor="su.white"
      emptyStateMessage="No pilots yet"
      renderCard={(pilot, onClick) => {
        const classData = pilotClassData?.classes.get(pilot.id)
        const className = classData?.name || null
        const currentHP = pilot.current_damage ?? 0
        const maxHP = pilot.max_hp ?? 10
        const currentAP = pilot.current_ap ?? 0
        const maxAP = pilot.max_ap ?? 5

        return (
          <PilotGridCard
            key={pilot.id}
            callsign={pilot.callsign}
            className={className}
            currentHP={currentHP}
            maxHP={maxHP}
            currentAP={currentAP}
            maxAP={maxAP}
            onClick={() => onClick(pilot.id)}
          />
        )
      }}
    />
  )
}
