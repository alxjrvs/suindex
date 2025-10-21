import { Box, Button, Flex, Grid, Heading, Input, Text, Textarea, VStack } from '@chakra-ui/react'
import type { CargoItem } from './types'

interface StorageBayProps {
  operator: string
  description: string
  cargo: CargoItem[]
  onOperatorChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onAddCargo: () => void
  onRemoveCargo: (id: string) => void
}

export function StorageBay({
  operator,
  description,
  cargo,
  onOperatorChange,
  onDescriptionChange,
  onAddCargo,
  onRemoveCargo,
}: StorageBayProps) {
  return (
    <Box bg="#c97d9e" borderWidth="4px" borderColor="#c97d9e" borderRadius="2xl" p={4}>
      <Heading
        as="h3"
        fontSize="lg"
        fontWeight="bold"
        color="#e8e5d8"
        textTransform="uppercase"
        mb={3}
      >
        Storage Bay
      </Heading>

      <VStack gap={3} mb={4} alignItems="stretch">
        <Box>
          <Text as="label" display="block" fontSize="xs" fontWeight="bold" color="#e8e5d8" mb={1}>
            Bullwhacker
          </Text>
          <Input
            type="text"
            value={operator}
            onChange={(e) => onOperatorChange(e.target.value)}
            placeholder="Enter Bullwhacker name..."
            w="full"
            p={1.5}
            borderWidth={0}
            borderRadius="lg"
            bg="#e8e5d8"
            color="#2d3e36"
            fontWeight="semibold"
            fontSize="sm"
          />
        </Box>

        <Box>
          <Text as="label" display="block" fontSize="xs" fontWeight="bold" color="#e8e5d8" mb={1}>
            Description
          </Text>
          <Textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Enter bay description..."
            w="full"
            p={1.5}
            borderWidth={0}
            borderRadius="lg"
            bg="#e8e5d8"
            color="#2d3e36"
            fontWeight="semibold"
            resize="none"
            h="20"
            fontSize="sm"
          />
        </Box>
      </VStack>

      {/* Cargo Grid */}
      <Box>
        <Heading
          as="h4"
          fontSize="sm"
          fontWeight="bold"
          color="#e8e5d8"
          textTransform="uppercase"
          mb={2}
        >
          Cargo
        </Heading>

        <Grid gridTemplateColumns="repeat(4, 1fr)" gap={2}>
          {cargo.map((item) => (
            <Box
              key={item.id}
              position="relative"
              bg="#e8e5d8"
              borderWidth="2px"
              borderColor="#2d3e36"
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
                <Text fontSize="lg" fontWeight="bold" color="#2d3e36">
                  {item.amount}
                </Text>
                <Text fontSize="10px" color="#2d3e36" textAlign="center" lineClamp={1} px={0.5}>
                  {item.description}
                </Text>
              </Flex>
            </Box>
          ))}

          <Button
            onClick={onAddCargo}
            bg="su.orange"
            color="su.white"
            px={1}
            py={1}
            borderRadius="lg"
            fontWeight="bold"
            _hover={{ bg: 'su.lightOrange' }}
            w="full"
            aspectRatio="1"
            fontSize="xs"
          >
            + Add
          </Button>
        </Grid>
      </Box>
    </Box>
  )
}
