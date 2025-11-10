import { VStack, Box } from '@chakra-ui/react'
import { Text } from '../base/Text'
import { UserEntitySmallDisplay } from './UserEntitySmallDisplay'
import { useHydratedPilot } from '../../hooks/pilot'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { fetchUserDisplayName } from '../../lib/api/users'

interface PilotSmallDisplayProps {
  id?: string
  waitForId?: boolean
  label?: string
}

export function PilotSmallDisplay({ id, label, waitForId = false }: PilotSmallDisplayProps) {
  const navigate = useNavigate()
  const { userId: currentUserId } = useCurrentUser()
  const {
    pilot,
    selectedClass,
    selectedAdvancedClass,
    loading: pilotLoading,
  } = useHydratedPilot(id)
  const className = selectedClass?.ref.name
  const advancedClassName = selectedAdvancedClass?.ref.name

  // Fetch crawler name if pilot has crawler_id
  const { data: crawlerName, isLoading: crawlerLoading } = useQuery({
    queryKey: ['crawler-name', pilot?.crawler_id],
    queryFn: async () => {
      if (!pilot?.crawler_id) return null

      const { data, error } = await supabase
        .from('crawlers')
        .select('name')
        .eq('id', pilot.crawler_id)
        .single()

      if (error) {
        console.error('Error fetching crawler:', error)
        return null
      }
      return data.name
    },
    enabled: !!pilot?.crawler_id,
  })

  // Fetch mech pattern if pilot has a mech
  const { data: mechChassisPattern, isLoading: mechLoading } = useQuery({
    queryKey: ['mech-pattern', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mechs')
        .select('pattern')
        .eq('pilot_id', id!)
        .eq('active', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null // No mech found
        console.error('Error fetching mech:', error)
        return null
      }
      return data.pattern
    },
    enabled: !!id,
  })

  // Fetch owner's Discord username
  const { data: ownerData } = useQuery({
    queryKey: ['user-display-name', pilot?.user_id],
    queryFn: () => fetchUserDisplayName(pilot!.user_id),
    enabled: !!pilot?.user_id && currentUserId !== pilot?.user_id, // Only fetch if not the current user
  })
  if (!id && !waitForId) {
    return null
  }

  const isOwner = currentUserId === pilot?.user_id
  const ownerName = isOwner ? 'You' : ownerData || 'Owner'

  const onClick = () => {
    if (!id) return
    navigate({ to: '/dashboard/pilots/$id', params: { id } })
  }

  const isLoading = (!id && waitForId) || pilotLoading || crawlerLoading || mechLoading

  if (isLoading || !pilot) {
    return (
      <UserEntitySmallDisplay
        onClick={onClick}
        label={label}
        bgColor="su.orange"
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

      {/* Mech badge (green) */}
      {mechChassisPattern && (
        <Box bg="su.green" px={2} py={1} borderRadius="sm" borderWidth="2px" borderColor="black">
          <Text fontSize="xs" color="su.white" fontWeight="bold" textTransform="uppercase">
            {mechChassisPattern}
          </Text>
        </Box>
      )}
    </VStack>
  )

  const rightHeader = advancedClassName?.toUpperCase()
    ? advancedClassName.toUpperCase()
    : className?.toUpperCase()

  return (
    <UserEntitySmallDisplay
      onClick={onClick}
      label={label}
      bgColor="su.orange"
      detailLabel="Player"
      detailValue={ownerName}
      leftHeader={pilot.callsign}
      rightHeader={rightHeader}
      detailContent={crawlerName || mechChassisPattern ? detailContent : undefined}
      isInactive={pilot.active === false}
    />
  )
}
