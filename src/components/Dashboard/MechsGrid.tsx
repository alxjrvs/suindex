import { useNavigate } from 'react-router'
import type { Tables } from '../../types/database'
import { SalvageUnionReference } from 'salvageunion-reference'
import { useEntityGrid } from '../../hooks/useEntityGrid'
import { useCreateEntity } from '../../hooks/useCreateEntity'
import { MechGridCard } from './MechGridCard'
import { GridLayout } from './GridLayout'

type MechRow = Tables<'mechs'>

export function MechsGrid() {
  const navigate = useNavigate()

  const {
    items: mechs,
    loading,
    error,
    reload,
  } = useEntityGrid<MechRow>({
    table: 'mechs',
    orderBy: 'created_at',
    orderAscending: false,
  })

  const { createEntity: createMech, isLoading: isCreating } = useCreateEntity({
    table: 'mechs',
    navigationPath: (id) => `/dashboard/mechs/${id}`,
  })

  const handleCreateMech = async () => {
    try {
      await createMech()
    } catch (err) {
      console.error('Failed to create mech:', err)
    }
  }

  const handleMechClick = (mechId: string) => {
    navigate(`/dashboard/mechs/${mechId}`)
  }

  return (
    <GridLayout
      title="Your Mechs"
      loading={loading}
      error={error}
      items={mechs}
      renderItem={(mech) => {
        const chassisName = mech.chassis_id
          ? (SalvageUnionReference.Chassis.findById(mech.chassis_id)?.name ?? 'Unknown')
          : 'No Chassis'

        return (
          <MechGridCard
            key={mech.id}
            pattern={mech.pattern}
            chassisName={chassisName}
            currentDamage={mech.current_damage ?? 0}
            currentHeat={mech.current_heat ?? 0}
            onClick={() => handleMechClick(mech.id)}
          />
        )
      }}
      createButton={{
        onClick: handleCreateMech,
        label: 'New Mech',
        bgColor: 'su.green',
        color: 'su.white',
        isLoading: isCreating,
      }}
      onRetry={reload}
    />
  )
}
