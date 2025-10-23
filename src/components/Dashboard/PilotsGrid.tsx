import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { Tables } from '../../types/database'
import { NewPilotModal } from './NewPilotModal'
import { SalvageUnionReference } from 'salvageunion-reference'
import { useEntityGrid } from '../../hooks/useEntityGrid'
import { PilotGridCard } from './PilotGridCard'
import { GridLayout } from './GridLayout'

type PilotRow = Tables<'pilots'>

export function PilotsGrid() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const handleCreatePilot = () => {
    setIsModalOpen(true)
  }

  const handlePilotClick = (pilotId: string) => {
    navigate(`/dashboard/pilots/${pilotId}`)
  }

  const handleModalSuccess = () => {
    reload()
  }

  return (
    <>
      <GridLayout
        title="Your Pilots"
        loading={loading}
        error={error}
        items={pilots}
        renderItem={(pilot) => {
          const className = pilot.class_id
            ? (SalvageUnionReference.Classes.all().find((c) => c.id === pilot.class_id)?.name ??
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
          accentColor: 'su.orange',
          bgColor: 'su.lightOrange',
        }}
        onRetry={reload}
      />

      <NewPilotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </>
  )
}
