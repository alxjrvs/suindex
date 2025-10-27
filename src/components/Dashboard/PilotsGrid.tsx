import { PilotGridCard } from './PilotGridCard'
import { EntityGrid } from './EntityGrid'
import { getClassNameById } from '../../utils/referenceDataHelpers'

export function PilotsGrid() {
  return (
    <EntityGrid<'pilots'>
      table="pilots"
      title="Your Pilots"
      createButtonLabel="New Pilot"
      createButtonBgColor="su.orange"
      createButtonColor="su.white"
      emptyStateMessage="No pilots yet"
      renderCard={(pilot, onClick) => {
        const className = pilot.class_id ? getClassNameById(pilot.class_id) : null
        const currentHP = pilot.current_damage ?? 0
        const maxHP = pilot.max_hp ?? 10
        const currentAP = pilot.current_ap ?? 0
        const maxAP = pilot.max_ap ?? 3

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
