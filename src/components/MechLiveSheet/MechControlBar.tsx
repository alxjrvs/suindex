import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { AssignmentDropdown } from '../shared/AssignmentDropdown'
import { ControlBarContainer } from '../shared/ControlBarContainer'
import { LinkButton } from '../shared/LinkButton'

interface MechControlBarProps {
  pilotId?: string | null
  savedPilotId?: string | null
  onPilotChange: (pilotId: string | null) => void
  hasPendingChanges?: boolean
}

export function MechControlBar({
  pilotId,
  savedPilotId,
  onPilotChange,
  hasPendingChanges = false,
}: MechControlBarProps) {
  const [pilots, setPilots] = useState<{ id: string; name: string }[]>([])
  const [loadingPilots, setLoadingPilots] = useState(false)

  // Fetch pilots
  useEffect(() => {
    const fetchPilots = async () => {
      try {
        setLoadingPilots(true)
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) return

        const { data } = await supabase
          .from('pilots')
          .select('id, callsign')
          .eq('user_id', userData.user.id)
          .order('callsign')

        if (data) setPilots(data.map((p) => ({ id: p.id, name: p.callsign })))
      } finally {
        setLoadingPilots(false)
      }
    }
    fetchPilots()
  }, [])

  return (
    <ControlBarContainer
      backgroundColor="bg.builder.mech"
      hasPendingChanges={hasPendingChanges}
      leftContent={
        <AssignmentDropdown
          label="Pilot"
          value={pilotId ?? null}
          loading={loadingPilots}
          options={pilots}
          onChange={onPilotChange}
          placeholder="No Pilot"
        />
      }
      rightContent={
        savedPilotId && <LinkButton to={`/dashboard/pilots/${savedPilotId}`} label="→ Pilot" />
      }
    />
  )
}

