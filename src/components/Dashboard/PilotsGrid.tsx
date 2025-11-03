import { PilotSmallDisplay } from './PilotSmallDisplay'
import { EntityGrid } from './EntityGrid'
import { usePilotClasses } from '../../hooks/suentity'
import { useEntityGrid } from '../../hooks/useEntityGrid'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import type { Tables } from '../../types/database-generated.types'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'

export function PilotsGrid() {
  const { userId: currentUserId } = useCurrentUser()

  // Fetch pilots to get IDs for singleton query
  const { items: pilots } = useEntityGrid<Tables<'pilots'>>({
    table: 'pilots',
    orderBy: 'created_at',
    orderAscending: false,
  })

  const pilotIds = pilots.map((p) => p.id)
  const { data: pilotClassData } = usePilotClasses(pilotIds)

  // Fetch crawlers for pilots that have crawler_id
  const { data: crawlers } = useQuery({
    queryKey: ['crawlers-for-pilots', pilotIds],
    queryFn: async () => {
      const crawlerIds = pilots.map((p) => p.crawler_id).filter((id): id is string => !!id)
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
    enabled: pilots.length > 0,
  })

  // Fetch mechs for pilots
  const { data: mechs } = useQuery({
    queryKey: ['mechs-for-pilots', pilotIds],
    queryFn: async () => {
      if (pilotIds.length === 0) return new Map<string, string>()

      const { data, error } = await supabase
        .from('mechs')
        .select('id, pilot_id, pattern, active')
        .in('pilot_id', pilotIds)
        .eq('active', true)

      if (error) throw error

      const map = new Map<string, string>()
      for (const mech of data || []) {
        if (mech.pilot_id && mech.pattern) {
          map.set(mech.pilot_id, mech.pattern)
        }
      }
      return map
    },
    enabled: pilots.length > 0,
  })

  return (
    <EntityGrid<'pilots'>
      table="pilots"
      title="Your Pilots"
      createButtonLabel="New Pilot"
      createButtonBgColor="su.orange"
      createButtonColor="su.white"
      emptyStateMessage="No pilots yet"
      renderCard={(pilot, onClick, isInactive) => {
        const classData = pilotClassData?.classes.get(pilot.id)
        const className = classData?.name || null
        const crawlerName = pilot.crawler_id ? crawlers?.get(pilot.crawler_id) : null
        const mechChassisPattern = mechs?.get(pilot.id) || null
        const isOwner = currentUserId === pilot.user_id

        return (
          <PilotSmallDisplay
            key={pilot.id}
            callsign={pilot.callsign}
            className={className}
            crawlerName={crawlerName}
            mechChassisPattern={mechChassisPattern}
            ownerUserId={pilot.user_id}
            isOwner={isOwner}
            onClick={() => onClick(pilot.id)}
            isInactive={isInactive}
          />
        )
      }}
    />
  )
}
