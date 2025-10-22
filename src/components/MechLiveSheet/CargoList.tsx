import { Box, Flex, Grid, Text } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import { StatDisplay } from '../StatDisplay'
import type { CargoItem } from './types'

interface CargoListProps {
  cargo: CargoItem[]
  totalCargo: number
  maxCargo: number
  canAddCargo: boolean
  onRemove: (id: string) => void
  onAddClick: () => void
}

export function CargoList({
  cargo,
  totalCargo,
  maxCargo,
  canAddCargo,
  onRemove,
  onAddClick,
}: CargoListProps) {
  return (
    <Box bg="bg.builder.mech" borderWidth="builder.border" borderColor="border.builder" borderRadius="builder.radius" p="builder.padding" shadow="lg">
      <Flex alignItems="center" justifyContent="space-between" mb={4}>
        <Heading level="h2" textTransform="uppercase">
          Cargo
        </Heading>
        <StatDisplay label="Cargo" value={`${totalCargo}/${maxCargo}`} />
      </Flex>

      <Grid templateColumns="repeat(4, 1fr)" gap={3}>
        {cargo.map((item) => (
          <Box
            key={item.id}
            position="relative"
            bg="bg.input"
            borderWidth="2px"
            borderColor="fg.input"
            borderRadius="lg"
            p={2}
            aspectRatio="1"
            display="flex"
            flexDirection="column"
          >
            <Button
              onClick={() => onRemove(item.id)}
              position="absolute"
              top={1}
              right={1}
              bg="su.brick"
              color="su.white"
              w={5}
              h={5}
              borderRadius="md"
              fontWeight="bold"
              _hover={{ bg: 'su.black' }}
              fontSize="xs"
              display="flex"
              alignItems="center"
              justifyContent="center"
              lineHeight="none"
              aria-label="Remove"
              minW={5}
              p={0}
            >
              ✕
            </Button>
            <Flex flex="1" flexDirection="column" alignItems="center" justifyContent="center">
              <Text fontSize="3xl" fontWeight="bold" color="fg.input">
                {item.amount}
              </Text>
              <Text
                fontSize="xs"
                color="fg.input"
                textAlign="center"
                px={2}
                css={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {item.description}
              </Text>
            </Flex>
          </Box>
        ))}

        <Button
          onClick={onAddClick}
          disabled={!canAddCargo}
          bg="su.orange"
          color="su.white"
          px={3}
          py={2}
          borderRadius="lg"
          fontWeight="bold"
          _hover={{ bg: 'su.lightOrange' }}
          _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
          w="full"
          aspectRatio="1"
          fontSize="base"
        >
          + Add
        </Button>
      </Grid>
    </Box>
  )
}
