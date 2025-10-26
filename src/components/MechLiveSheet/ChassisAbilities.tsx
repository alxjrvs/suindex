import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import type { SURefChassis } from 'salvageunion-reference'
import { SheetDisplay } from '../shared/SheetDisplay'
import { RoundedBox } from '../shared/RoundedBox'
import { StatDisplay } from '../StatDisplay'

interface ChassisAbilitiesProps {
  chassis: SURefChassis | undefined
  stats: SURefChassis['stats'] | undefined
  disabled?: boolean
}

export function ChassisAbilities({ chassis, stats, disabled = false }: ChassisAbilitiesProps) {
  return (
    <RoundedBox
      leftContent={<StatDisplay label="TL" value={stats?.techLevel || 0} disabled={disabled} />}
      rightContent={
        <Flex flexDirection="row" justifyContent="space-between">
          <StatDisplay label="Sys. Slots" value={stats?.systemSlots || 0} disabled={disabled} />
          <StatDisplay label="Mod. Slots" value={stats?.moduleSlots || 0} disabled={disabled} />
          <StatDisplay label="Cargo Cap" value={stats?.cargoCap || 0} disabled={disabled} />
          <StatDisplay label="SV" value={stats?.salvageValue || 0} disabled={disabled} />
        </Flex>
      }
      bg="su.green"
      title="Chassis"
      disabled={!chassis}
    >
      <VStack gap={3} alignItems="stretch" w="full">
        {(
          chassis?.chassisAbilities || [
            {
              name: '',
              description: 'No chassis selected.',
              options: [{ label: '', value: '' }],
            },
          ]
        ).map((ability, idx) => (
          <SheetDisplay key={idx} label={ability.name || undefined} disabled={disabled}>
            <Text lineHeight="relaxed">{ability.description}</Text>
            {'options' in ability &&
              ability.options &&
              Array.isArray(ability.options) &&
              ability.options.length > 0 && (
                <VStack mt={3} ml={4} gap={1} alignItems="stretch">
                  {ability.options.map((option, optIndex) => (
                    <Box key={optIndex}>
                      <Text as="span" fontWeight="bold">
                        {option.label}
                        {option.label.includes('•') || option.label.length === 0 ? '' : ':'}
                      </Text>{' '}
                      {option.value}
                    </Box>
                  ))}
                </VStack>
              )}
          </SheetDisplay>
        ))}
      </VStack>
    </RoundedBox>
  )
}
