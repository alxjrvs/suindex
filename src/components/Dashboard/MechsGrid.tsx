import { MechGridCard } from './MechGridCard'
import { EntityGrid } from './EntityGrid'
import { useMechChassis } from '../../hooks/suentity'
import { useEntityGrid } from '../../hooks/useEntityGrid'
import type { Tables } from '../../types/database-generated.types'

export function MechsGrid() {
  // Fetch mechs to get IDs for singleton query
  const { items: mechs } = useEntityGrid<Tables<'mechs'>>({
    table: 'mechs',
    orderBy: 'created_at',
    orderAscending: false,
  })

  const mechIds = mechs.map((m) => m.id)
  const { data: mechChassisData } = useMechChassis(mechIds)

  return (
    <EntityGrid<'mechs'>
      table="mechs"
      title="Your Mechs"
      createButtonLabel="New Mech"
      createButtonBgColor="su.green"
      createButtonColor="su.white"
      emptyStateMessage="No mechs yet"
      renderCard={(mech, onClick) => {
        const chassisData = mechChassisData?.get(mech.id)
        const chassisName = chassisData?.name || 'No Chassis'

        return (
          <MechGridCard
            key={mech.id}
            pattern={mech.pattern}
            chassisName={chassisName}
            currentDamage={mech.current_damage ?? 0}
            currentHeat={mech.current_heat ?? 0}
            onClick={() => onClick(mech.id)}
          />
        )
      }}
    />
  )
}
