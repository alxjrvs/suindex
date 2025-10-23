import { Box, Flex, Grid, Text, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '../base/Heading'
import { RoundedBox } from '../shared/RoundedBox'
import { FormInput } from '../shared/FormInput'
import { FormTextarea } from '../shared/FormTextarea'
import { AddStatButton } from '../shared/AddStatButton'
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
    <RoundedBox
      bg="bg.builder.crawler"
      borderColor="border.builder.crawler"
      matchBorder={false}
      borderWidth="4px"
      borderRadius="2xl"
      padding={4}
      title="Storage Bay"
      rightContent={<AddStatButton onClick={onAddCargo} label="Add Cargo" />}
    >
      <VStack gap={3} mb={4} alignItems="stretch">
        <FormInput
          label="Bullwhacker"
          value={operator}
          onChange={onOperatorChange}
          placeholder="Enter Bullwhacker name..."
        />

        <FormTextarea
          label="Description"
          value={description}
          onChange={onDescriptionChange}
          placeholder="Enter bay description..."
          height="20"
        />
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
        </Grid>
      </Box>
    </RoundedBox>
  )
}
