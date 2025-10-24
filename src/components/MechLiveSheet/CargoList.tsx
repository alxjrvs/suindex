import { Box, Flex, Grid, Text } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { StatDisplay } from '../StatDisplay'
import { AddStatButton } from '../shared/AddStatButton'
import { RoundedBox } from '../shared/RoundedBox'
import type { CargoItem } from '../../types/database'

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
    <RoundedBox
      bg="bg.builder.mech"
      borderColor="border.builder"
      matchBorder={false}
      borderWidth="8px"
      borderRadius="3xl"
      padding={6}
      title="Cargo"
      rightContent={
        <Flex gap={2} alignItems="center">
          <AddStatButton onClick={onAddClick} disabled={!canAddCargo} />
          <StatDisplay label="Cargo" value={`${totalCargo}/${maxCargo}`} />
        </Flex>
      }
    >
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
      </Grid>
    </RoundedBox>
  )
}
