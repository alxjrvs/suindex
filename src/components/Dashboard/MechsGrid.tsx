import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { Tables } from '../../types/database'
import { SalvageUnionReference } from 'salvageunion-reference'
import { NewMechModal } from './NewMechModal'
import { useEntityGrid } from '../../hooks/useEntityGrid'
import { MechGridCard } from './MechGridCard'
import { GridLayout } from './GridLayout'

type MechRow = Tables<'mechs'>

export function MechsGrid() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const handleCreateMech = () => {
    setIsModalOpen(true)
  }

  const handleMechClick = (mechId: string) => {
    navigate(`/dashboard/mechs/${mechId}`)
  }

  const handleModalSuccess = () => {
    reload()
  }

  return (
    <>
      <GridLayout
        title="Your Mechs"
        loading={loading}
        error={error}
        items={mechs}
        renderItem={(mech) => {
          const chassisName = mech.chassis_id
            ? (SalvageUnionReference.Chassis.all().find((c) => c.id === mech.chassis_id)?.name ??
              'Unknown')
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
          accentColor: 'su.green',
          bgColor: 'su.lightBlue',
        }}
        onRetry={reload}
      />

      <NewMechModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </>
  )
}
