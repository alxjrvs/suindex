import { MechGridCard } from './MechGridCard'
import { EntityGrid } from './EntityGrid'
import { getChassisNameById } from '../../utils/referenceDataHelpers'

export function MechsGrid() {
  return (
    <EntityGrid<'mechs'>
      table="mechs"
      title="Your Mechs"
      createButtonLabel="New Mech"
      createButtonBgColor="su.green"
      createButtonColor="su.white"
      renderCard={(mech, onClick) => {
        const chassisName = mech.chassis_id ? getChassisNameById(mech.chassis_id) : 'No Chassis'

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
