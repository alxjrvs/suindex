import { useEffect, useState } from 'react'
import { Flex, Text, VStack } from '@chakra-ui/react'
import { RoundedBox } from '../shared/RoundedBox'
import { SheetSelect } from '../shared/SheetSelect'
import { LinkButton } from '../shared/LinkButton'
import { useEntityRelationships } from '../../hooks/useEntityRelationships'
import { fetchEntity } from '../../lib/api'
import { getClassNameById } from '../../utils/referenceDataHelpers'
import type { Tables } from '../../types/database-generated.types'
import { DiscordSignInButton } from '../DiscordSignInButton'

type PilotRow = Tables<'pilots'>

interface PilotInfoProps {
  mechId?: string
  pilotId?: string | null
  onPilotChange: (pilotId: string | null) => void
  disabled?: boolean
}

export function PilotInfo({ mechId, pilotId, onPilotChange, disabled = false }: PilotInfoProps) {
  const [pilot, setPilot] = useState<PilotRow | null>(null)
  const [loadingPilot, setLoadingPilot] = useState(false)

  // Fetch available pilots for the selector
  const { items: allPilots, loading: loadingPilots } = useEntityRelationships<{
    id: string
    callsign: string
    mech_id: string | null
  }>({
    table: 'pilots',
    selectFields: 'id, callsign, mech_id',
    orderBy: 'callsign',
  })

  // Filter out pilots that already have a mech assigned (except the currently assigned pilot)
  const pilots = allPilots.filter((p) => !p.mech_id || p.id === pilotId)

  // Fetch pilot details when pilotId changes
  useEffect(() => {
    if (!pilotId) {
      setPilot(null)
      return
    }

    const loadPilot = async () => {
      try {
        setLoadingPilot(true)
        const data = await fetchEntity<PilotRow>('pilots', pilotId)
        setPilot(data)
      } catch (err) {
        console.error('Error loading pilot:', err)
        setPilot(null)
      } finally {
        setLoadingPilot(false)
      }
    }

    loadPilot()
  }, [pilotId])

  // State 1: No mech ID (draft mode) - show disabled message
  if (!mechId) {
    return (
      <RoundedBox
        rightContent={<DiscordSignInButton disabled={disabled} />}
        flex="1"
        title="Pilot"
        disabled={true}
        bg="su.orange"
      />
    )
  }

  // State 2: Mech ID but no pilot ID - show selector
  if (!pilotId) {
    return (
      <RoundedBox flex="1" title="Pilot" disabled={disabled} bg="su.orange">
        <Flex justify="center" align="center" h="full" py={2}>
          <SheetSelect
            label="Pilot"
            value={pilotId ?? null}
            loading={loadingPilots}
            options={pilots.map((p) => ({ id: p.id, name: p.callsign }))}
            disabled={disabled}
            onChange={onPilotChange}
            placeholder="No Pilot"
          />
        </Flex>
      </RoundedBox>
    )
  }

  // State 3: Mech ID and pilot ID - show pilot info
  if (loadingPilot) {
    return (
      <RoundedBox flex="1" title="Pilot" disabled={disabled} bg="su.orange">
        <Flex justify="center" align="center" h="full" py={4}>
          <Text fontSize="sm" color="gray.500" fontFamily="mono">
            Loading...
          </Text>
        </Flex>
      </RoundedBox>
    )
  }

  if (!pilot) {
    return (
      <RoundedBox flex="1" title="Pilot" disabled={disabled} bg="su.orange">
        <Flex justify="center" align="center" h="full" py={4}>
          <Text fontSize="sm" color="red.500" fontFamily="mono">
            Pilot not found
          </Text>
        </Flex>
      </RoundedBox>
    )
  }

  // Determine class name: advanced_class_id takes priority over class_id
  const className = pilot.advanced_class_id
    ? getClassNameById(pilot.advanced_class_id)
    : getClassNameById(pilot.class_id)

  return (
    <RoundedBox flex="1" title="Pilot" disabled={disabled} bg="su.orange">
      <VStack gap={3} align="stretch" py={2} px={3}>
        <Text fontSize="lg" fontWeight="bold" fontFamily="mono" textAlign="center">
          {pilot.callsign} the {className}
        </Text>
        <Flex justify="center">
          <LinkButton to={`/dashboard/pilots/${pilot.id}`} label="→ Pilot Page" />
        </Flex>
      </VStack>
    </RoundedBox>
  )
}
