import { VStack, Box } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { UserEntitySmallDisplay } from './UserEntitySmallDisplay'
import { useNavigate } from 'react-router-dom'
import { useHydratedMech } from '../../hooks/mech'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useCurrentUser } from '../../hooks/useCurrentUser'

interface MechSmallDisplayProps {
  id: string
  reverse?: boolean
}

export function MechSmallDisplay({ id, reverse = false }: MechSmallDisplayProps) {
  const navigate = useNavigate()
  const { userId: currentUserId } = useCurrentUser()
  const { mech, selectedChassis } = useHydratedMech(id)

  const chassisName = selectedChassis?.ref.name || 'No Chassis'

  // Fetch pilot name and crawler_id if mech has pilot_id
  const { data: pilotData } = useQuery({
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
  const { data: crawlerName } = useQuery({
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

  const isOwner = currentUserId === mech?.user_id
  // For now, just show "Owner" for non-owned mechs
  // TODO: Add a public users table or profile system to show owner names
  const ownerName = isOwner ? 'You' : 'Owner'

  const onClick = () => navigate(`/dashboard/mechs/${id}`)

  if (!mech) return null
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
