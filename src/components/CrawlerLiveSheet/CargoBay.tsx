import { Box, Flex, Grid, Text } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import { RoundedBox } from '../shared/RoundedBox'
import { AddStatButton } from '../shared/AddStatButton'
import type { CargoItem } from '../../types/database'
import { useMemo } from 'react'
import { getTiltRotation } from '../../utils/tiltUtils'

interface CargoBayProps {
  cargo: CargoItem[]
  onAddCargo: () => void
  onRemoveCargo: (id: string) => void
  damaged?: boolean
}

export function CargoBay({ cargo, onAddCargo, onRemoveCargo, damaged = false }: CargoBayProps) {
  const titleRotation = useMemo(() => getTiltRotation(), [])
  const cargoRotation = useMemo(() => getTiltRotation(), [])

  return (
    <RoundedBox
      bg={damaged ? 'su.grey' : 'bg.builder.crawler'}
      borderColor="border.builder.crawler"
      matchBorder={false}
      borderWidth="4px"
      justifyContent="flex-start"
      borderRadius="2xl"
      title="Storage"
      titleRotation={damaged ? titleRotation : 0}
      rightContent={<AddStatButton onClick={onAddCargo} label="Add Cargo" />}
      padding={4}
    >
      <Box
        transform={damaged ? `rotate(${cargoRotation}deg)` : undefined}
        transition="transform 0.3s ease"
        opacity={damaged ? 0.5 : 1}
      >
        <Flex alignItems="center" justifyContent="space-between" mb={2}>
          <Heading level="h4" textTransform="uppercase">
            Cargo
          </Heading>
        </Flex>

        <Grid gridTemplateColumns="repeat(4, 1fr)" gap={2}>
          {cargo.map((item) => (
            <Box
              key={item.id}
              position="relative"
              bg="bg.input"
              borderWidth="2px"
              borderColor="fg.input"
              borderRadius="lg"
              p={1}
              aspectRatio="1"
              display="flex"
              flexDirection="column"
            >
              <Button
                onClick={() => onRemoveCargo(item.id)}
                position="absolute"
                top="0.5"
                right="0.5"
                bg="su.brick"
                color="su.white"
                w="4"
                h="4"
                borderRadius="md"
                fontWeight="bold"
                _hover={{ bg: 'su.black' }}
                fontSize="xs"
                display="flex"
                alignItems="center"
                justifyContent="center"
                lineHeight="none"
                aria-label="Remove"
              >
                ✕
              </Button>
              <Flex flex="1" flexDirection="column" alignItems="center" justifyContent="center">
                <Text fontSize="lg" fontWeight="bold" color="fg.input">
                  {item.amount}
                </Text>
                <Text fontSize="10px" color="fg.input" textAlign="center" lineClamp={1} px={0.5}>
                  {item.description}
                </Text>
              </Flex>
            </Box>
          ))}
        </Grid>
      </Box>
    </RoundedBox>
  )
}
