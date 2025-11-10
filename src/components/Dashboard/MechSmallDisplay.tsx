import { VStack, Box } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { UserEntitySmallDisplay } from './UserEntitySmallDisplay'
import { useNavigate } from '@tanstack/react-router'
import { useHydratedMech } from '../../hooks/mech'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { fetchUserDisplayName } from '../../lib/api/users'

interface MechSmallDisplayProps {
  id?: string
  reverse?: boolean
}

export function MechSmallDisplay({ id, reverse = false }: MechSmallDisplayProps) {
  const navigate = useNavigate()
  const { userId: currentUserId } = useCurrentUser()
  const { mech, selectedChassis, loading: mechLoading } = useHydratedMech(id)

  const chassisName = selectedChassis?.ref.name || 'No Chassis'

  // Fetch pilot name and crawler_id if mech has pilot_id
  const { data: pilotData, isLoading: pilotLoading } = useQuery({
    queryKey: ['pilot-data', mech?.pilot_id],
    queryFn: async () => {
      if (!mech?.pilot_id) return null

      const { data, error } = await supabase
        .from('pilots')
        .select('callsign, crawler_id')
        .eq('id', mech.pilot_id)
        .single()

      if (error) {
        console.error('Error fetching pilot:', error)
        return null
      }
      return data
    },
    enabled: !!mech?.pilot_id,
  })

  // Fetch crawler name if pilot has crawler_id
  const { data: crawlerName, isLoading: crawlerLoading } = useQuery({
    queryKey: ['crawler-name', pilotData?.crawler_id],
    queryFn: async () => {
      if (!pilotData?.crawler_id) return null

      const { data, error } = await supabase
        .from('crawlers')
        .select('name')
        .eq('id', pilotData.crawler_id)
        .single()

      if (error) {
        console.error('Error fetching crawler:', error)
        return null
      }
      return data.name
    },
    enabled: !!pilotData?.crawler_id,
  })

  // Fetch owner's Discord username
  const { data: ownerData } = useQuery({
    queryKey: ['user-display-name', mech?.user_id],
    queryFn: () => fetchUserDisplayName(mech!.user_id),
    enabled: !!mech?.user_id && currentUserId !== mech?.user_id, // Only fetch if not the current user
  })

  const isOwner = currentUserId === mech?.user_id
  const ownerName = isOwner ? 'You' : ownerData || 'Owner'

  const onClick = () => {
    if (!id) return
    navigate({ to: '/dashboard/mechs/$id', params: { id } })
  }

  const isLoading = !id || mechLoading || pilotLoading || crawlerLoading

  if (isLoading || !mech) {
    return (
      <UserEntitySmallDisplay
        reverse={reverse}
        onClick={onClick}
        bgColor="su.green"
        leftHeader="Loading..."
        rightHeader="..."
      />
    )
  }
  const detailContent = (
    <VStack gap={1} alignItems="stretch">
      {/* Crawler badge (pink) */}
      {crawlerName && (
        <Box bg="su.pink" px={2} py={1} borderRadius="sm" borderWidth="2px" borderColor="black">
          <Text fontSize="xs" color="su.white" fontWeight="bold" textTransform="uppercase">
            {crawlerName}
          </Text>
        </Box>
      )}

      {/* Pilot badge (orange) */}
      {pilotData?.callsign && (
        <Box bg="su.orange" px={2} py={1} borderRadius="sm" borderWidth="2px" borderColor="black">
          <Text fontSize="xs" color="su.white" fontWeight="bold" textTransform="uppercase">
            {pilotData.callsign}
          </Text>
        </Box>
      )}
    </VStack>
  )

  return (
    <UserEntitySmallDisplay
      reverse={reverse}
      onClick={onClick}
      bgColor="su.green"
      detailLabel="Player"
      detailValue={ownerName}
      leftHeader={`"${mech.pattern ?? chassisName}"`}
      rightHeader={chassisName.toUpperCase()}
      detailContent={crawlerName || pilotData?.callsign ? detailContent : undefined}
      isInactive={mech.active === false}
    />
  )
}
