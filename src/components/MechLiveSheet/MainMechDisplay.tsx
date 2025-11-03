import { VStack, Flex } from '@chakra-ui/react'
import {
  getTechLevel,
  getSystemSlots,
  getModuleSlots,
  getCargoCapacity,
  getSalvageValue,
  type SURefChassis,
} from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'
import { StatDisplay } from '../StatDisplay'
import { ChassisInputs } from './ChassisInputs'
import { useHydratedMech } from '../../hooks/mech'
import { Text } from '../base/Text'

export function MainMechDisplay({ id }: { id: string }) {
  const { mech, selectedChassis } = useHydratedMech(id)
  const chassisRef = selectedChassis?.ref as SURefChassis | undefined
  const title =
    chassisRef?.name && mech?.pattern ? `"${mech.pattern}"` : chassisRef?.name || 'Mech Chassis'

  const subtitle = mech?.pattern ? `${chassisRef?.name} Chassis` : ''

  return (
    <VStack flex="1" gap={2} alignItems="stretch">
      <RoundedBox
        leftContent={
          <StatDisplay
            inverse
            label="tech"
            bottomLabel="Level"
            value={chassisRef ? (getTechLevel(chassisRef) ?? 0) : 0}
            disabled={!selectedChassis}
          />
        }
        rightContent={
          <Flex flexDirection="row" justifyContent="flex-end" gap={4}>
            <StatDisplay
              label="Sys."
              bottomLabel="Slots"
              value={chassisRef ? (getSystemSlots(chassisRef) ?? 0) : 0}
              disabled={!selectedChassis}
            />
            <StatDisplay
              label="Mod."
              bottomLabel="Slots"
              value={chassisRef ? (getModuleSlots(chassisRef) ?? 0) : 0}
              disabled={!selectedChassis}
            />
            <StatDisplay
              label="Cargo"
              bottomLabel="Cap"
              value={chassisRef ? (getCargoCapacity(chassisRef) ?? 0) : 0}
              disabled={!selectedChassis}
            />
            <StatDisplay
              label="Salvage"
              bottomLabel="Value"
              value={chassisRef ? (getSalvageValue(chassisRef) ?? 0) : 0}
              disabled={!selectedChassis}
            />
          </Flex>
        }
        title={title}
        subTitleContent={<Text variant="pseudoheader">{subtitle}</Text>}
        bg="su.green"
        w="full"
        h="full"
        disabled={!selectedChassis}
      >
        <ChassisInputs id={id} />
      </RoundedBox>
    </VStack>
  )
}
