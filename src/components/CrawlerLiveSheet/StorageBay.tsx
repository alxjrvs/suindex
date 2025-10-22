import { Box, Flex, Grid, Input, Text, Textarea, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
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
    <Box bg="bg.builder.crawler" borderWidth="builder.border.sm" borderColor="border.builder.crawler" borderRadius="2xl" p={4}>
      <Heading level="h2" textTransform="uppercase" mb={3}>
        Storage Bay
      </Heading>

      <VStack gap={3} mb={4} alignItems="stretch">
        <Box>
          <Text as="label" display="block" fontSize="xs" fontWeight="bold" color="fg.input.label" mb={1}>
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
            bg="bg.input"
            color="fg.input"
            fontWeight="semibold"
            fontSize="sm"
          />
        </Box>

        <Box>
          <Text as="label" display="block" fontSize="xs" fontWeight="bold" color="fg.input.label" mb={1}>
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
            bg="bg.input"
            color="fg.input"
            fontWeight="semibold"
            resize="none"
            h="20"
            fontSize="sm"
          />
        </Box>
      </VStack>

      {/* Cargo Grid */}
      <Box>
        <Heading level="h4" textTransform="uppercase" mb={2}>
          Cargo
        </Heading>

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
