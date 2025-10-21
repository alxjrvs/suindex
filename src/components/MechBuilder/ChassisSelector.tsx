import { useMemo } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { NativeSelectRoot, NativeSelectField } from '@chakra-ui/react'
import type { Chassis } from 'salvageunion-reference'

interface ChassisSelectorProps {
  chassisId: string | null
  allChassis: Chassis[]
  onChange: (chassisId: string) => void
}

export function ChassisSelector({ chassisId, allChassis, onChange }: ChassisSelectorProps) {
  const groupedChassis = useMemo(() => {
    const groups = new Map<number, Chassis[]>()

    allChassis.forEach((chassis) => {
      const techLevel = chassis.stats.tech_level
      if (!groups.has(techLevel)) {
        groups.set(techLevel, [])
      }
      groups.get(techLevel)!.push(chassis)
    })

    const sortedGroups = Array.from(groups.entries())
      .sort(([a], [b]) => a - b)
      .map(([techLevel, chassis]) => ({
        techLevel,
        chassis: chassis.sort((a, b) => a.name.localeCompare(b.name)),
      }))

    return sortedGroups
  }, [allChassis])

  return (
    <Box>
      <Text
        as="label"
        display="block"
        fontSize="sm"
        fontWeight="bold"
        color="#e8e5d8"
        mb={2}
        textTransform="uppercase"
      >
        Chassis
      </Text>
      <NativeSelectRoot>
        <NativeSelectField
          value={chassisId || ''}
          onChange={(e) => onChange(e.target.value)}
          w="full"
          p={3}
          borderWidth={0}
          borderRadius="2xl"
          bg="#e8e5d8"
          color="#2d3e36"
          fontWeight="semibold"
        >
          <option value="">Select a chassis...</option>
          {groupedChassis.map(({ techLevel, chassis }) => (
            <optgroup key={techLevel} label={`Tech Level ${techLevel}`}>
              {chassis.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </optgroup>
          ))}
        </NativeSelectField>
      </NativeSelectRoot>
    </Box>
  )
}
