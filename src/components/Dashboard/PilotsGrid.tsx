import { useNavigate } from 'react-router'
import type { Tables } from '../../types/database'
import { SalvageUnionReference } from 'salvageunion-reference'
import { useEntityGrid } from '../../hooks/useEntityGrid'
import { useCreateEntity } from '../../hooks/useCreateEntity'
import { PilotGridCard } from './PilotGridCard'
import { GridLayout } from './GridLayout'

type PilotRow = Tables<'pilots'>

export function PilotsGrid() {
  const navigate = useNavigate()

  const {
    items: pilots,
    loading,
    error,
    reload,
  } = useEntityGrid<PilotRow>({
    table: 'pilots',
    orderBy: 'created_at',
    orderAscending: false,
  })

  const { createEntity: createPilot, isLoading: isCreating } = useCreateEntity({
    table: 'pilots',
    navigationPath: (id) => `/dashboard/pilots/${id}`,
  })

  const handleCreatePilot = async () => {
    try {
      await createPilot()
    } catch (err) {
      console.error('Failed to create pilot:', err)
    }
  }

  const handlePilotClick = (pilotId: string) => {
    navigate(`/dashboard/pilots/${pilotId}`)
  }

  return (
    <GridLayout
      title="Your Pilots"
      loading={loading}
      error={error}
      items={pilots}
      renderItem={(pilot) => {
        const className = pilot.class_id
          ? (SalvageUnionReference.Classes.findById(pilot.class_id)?.name ??
            'Unknown')
          : null
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
            onClick={() => handlePilotClick(pilot.id)}
          />
        )
      }}
      createButton={{
        onClick: handleCreatePilot,
        label: 'New Pilot',
        bgColor: 'su.orange',
        color: 'su.white',
        isLoading: isCreating,
      }}
      onRetry={reload}
    />
  )
}
