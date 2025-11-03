import { Box, VStack } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { Text } from '../base/Text'
import { PilotSmallDisplay } from './PilotSmallDisplay'
import { MechSmallDisplay } from './MechSmallDisplay'
import { useHydratedMech } from '../../hooks/mech'
import { supabase } from '../../lib/supabase'
import { SheetDisplay } from '../shared/SheetDisplay'

interface PilotMechCellProps {
  pilotId: string
  mechId: string | null
}

/**
 * Component to render a pilot-mech pair with label
 * Shows the pilot's callsign and mech name in the label
 */
export function PilotMechCell({ pilotId, mechId }: PilotMechCellProps) {
  const { mech, selectedChassis } = useHydratedMech(mechId || '')
  const { data: pilot } = useQuery({
    queryKey: ['pilot-callsign', pilotId],
    queryFn: async () => {
      const { data } = await supabase.from('pilots').select('callsign').eq('id', pilotId).single()
      return data
    },
    enabled: !!pilotId,
  })

  const mechName = mech?.pattern || selectedChassis?.ref.name
  const label = `${pilot?.callsign || ''}${mechName ? ` & ${mechName}` : ''}`

  return (
    <SheetDisplay label={label}>
      <VStack gap={0} align="stretch">
        <PilotSmallDisplay id={pilotId} />
        {mechId ? (
          <MechSmallDisplay reverse id={mechId} />
        ) : (
          <Box bg="su.lightBlue" p={4} borderRadius="md" borderWidth="2px" borderColor="black">
            <Text
              fontSize="sm"
              color="su.brick"
              fontWeight="bold"
              textAlign="center"
              textTransform="uppercase"
            >
              No Mech
            </Text>
          </Box>
        )}
      </VStack>
    </SheetDisplay>
  )
}
