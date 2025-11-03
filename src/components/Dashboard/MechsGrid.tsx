import { MechSmallDisplay } from './MechSmallDisplay'
import { EntityGrid } from './EntityGrid'
import { useMechChassis } from '../../hooks/suentity'
import { useEntityGrid } from '../../hooks/useEntityGrid'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import type { Tables } from '../../types/database-generated.types'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export function MechsGrid() {
  const { userId: currentUserId } = useCurrentUser()

  // Fetch mechs to get IDs for singleton query
  const { items: mechs } = useEntityGrid<Tables<'mechs'>>({
    table: 'mechs',
    orderBy: 'created_at',
    orderAscending: false,
  })

  const mechIds = mechs.map((m) => m.id)
  const { data: mechChassisData } = useMechChassis(mechIds)

  // Fetch pilots for mechs that have pilot_id
  const { data: pilots } = useQuery({
    queryKey: ['pilots-for-mechs', mechIds],
    queryFn: async () => {
      const pilotIds = mechs.map((m) => m.pilot_id).filter((id): id is string => !!id)
      if (pilotIds.length === 0)
        return new Map<string, { name: string; crawler_id: string | null }>()

      const { data, error } = await supabase
        .from('pilots')
        .select('id, callsign, crawler_id')
        .in('id', pilotIds)

      if (error) throw error

      const map = new Map<string, { name: string; crawler_id: string | null }>()
      for (const pilot of data || []) {
        map.set(pilot.id, { name: pilot.callsign, crawler_id: pilot.crawler_id })
      }
      return map
    },
    enabled: mechs.length > 0,
  })

  // Fetch crawlers for pilots
  const { data: crawlers } = useQuery({
    queryKey: ['crawlers-for-mechs', mechIds],
    queryFn: async () => {
      const crawlerIds = Array.from(pilots?.values() || [])
        .map((p) => p.crawler_id)
        .filter((id): id is string => !!id)

      if (crawlerIds.length === 0) return new Map<string, string>()

      const { data, error } = await supabase
        .from('crawlers')
        .select('id, name')
        .in('id', crawlerIds)

      if (error) throw error

      const map = new Map<string, string>()
      for (const crawler of data || []) {
        map.set(crawler.id, crawler.name)
      }
      return map
    },
    enabled: (pilots?.size ?? 0) > 0,
  })

  return (
    <EntityGrid<'mechs'>
      table="mechs"
      title="Your Mechs"
      createButtonLabel="New Mech"
      createButtonBgColor="su.green"
      createButtonColor="su.white"
      emptyStateMessage="No mechs yet"
      renderCard={(mech, onClick, isInactive) => {
        const chassisData = mechChassisData?.get(mech.id)
        const chassisName = chassisData?.name || 'No Chassis'

        const pilotData = mech.pilot_id ? pilots?.get(mech.pilot_id) : null
        const pilotName = pilotData?.name || null
        const crawlerName = pilotData?.crawler_id
          ? crawlers?.get(pilotData.crawler_id) || null
          : null
        const isOwner = currentUserId === mech.user_id

        return (
          <MechSmallDisplay
            key={mech.id}
            pattern={mech.pattern}
            chassisName={chassisName}
            crawlerName={crawlerName}
            pilotName={pilotName}
            ownerUserId={mech.user_id}
            isOwner={isOwner}
            onClick={() => onClick(mech.id)}
            isInactive={isInactive}
          />
        )
      }}
    />
  )
}
