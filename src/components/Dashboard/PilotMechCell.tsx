import { VStack } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { PilotSmallDisplay } from './PilotSmallDisplay'
import { MechSmallDisplay } from './MechSmallDisplay'
import { useHydratedMech } from '../../hooks/mech'
import { supabase } from '../../lib/supabase'
import { SheetDisplay } from '../shared/SheetDisplay'
import { fetchCrawlerPilots } from '../../lib/api/pilots'
import { fetchPilotsMechs } from '../../lib/api/mechs'

interface PilotMechCellProps {
  crawlerId: string
  memberId?: string
  displayName?: string | null
}

/**
 * Component to render a pilot-mech pair for a game member
 * Fetches the member's active pilot and their mech from the crawler
 */
export function PilotMechCell({ crawlerId, memberId, displayName }: PilotMechCellProps) {
  // Fetch pilots for this crawler
  const { data: pilots = [], isLoading: pilotsLoading } = useQuery({
    queryKey: ['game-member-pilots', memberId, crawlerId],
    queryFn: () => fetchCrawlerPilots(crawlerId),
    enabled: !!crawlerId,
  })

  // Find this member's active pilot (or first active pilot if no memberId)
  const pilot = memberId
    ? pilots.find((p) => p.user_id === memberId && p.active)
    : pilots.find((p) => p.active)

  // Fetch mech for this pilot
  const { data: mechs = [] } = useQuery({
    queryKey: ['game-member-mechs', memberId, pilot?.id],
    queryFn: () => {
      if (!pilot) return []
      return fetchPilotsMechs([pilot.id])
    },
    enabled: !!pilot,
  })

  const mech = mechs.find((m) => m.pilot_id === pilot?.id)

  // Fetch pilot callsign and mech details for label
  const { mech: hydratedMech, selectedChassis } = useHydratedMech(mech?.id || '')
  const { data: pilotData } = useQuery({
    queryKey: ['pilot-callsign', pilot?.id],
    queryFn: async () => {
      const { data } = await supabase.from('pilots').select('callsign').eq('id', pilot!.id).single()
      return data
    },
    enabled: !!pilot,
  })

  const mechName = hydratedMech?.pattern || selectedChassis?.ref.name
  const defaultLabel = pilotsLoading
    ? 'Loading...'
    : `${pilotData?.callsign || ''}${mechName ? ` & ${mechName}` : ''}`

  // Use display name or default label
  const label = displayName || defaultLabel

  return (
    <SheetDisplay label={label}>
      <VStack gap={0} align="stretch">
        <PilotSmallDisplay waitForId id={pilot?.id} />
        <MechSmallDisplay reverse id={mech?.id} />
      </VStack>
    </SheetDisplay>
  )
}
