import { useState } from 'react'
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react'
import Modal from '../Modal'
import { generateUniqueColor } from '../../utils/colorUtils'
import type { CargoItem } from '../../types/common'

interface CargoModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (amount: number, description: string, color: string) => void
  existingCargo?: CargoItem[] // Optional - existing cargo items to avoid color duplication
  maxCargo?: number // Optional - if provided, shows amount input and tracking
  currentCargo?: number // Optional - if provided, shows available cargo
  backgroundColor?: string // For different builder colors
}

export function CargoModal({
  isOpen,
  onClose,
  onAdd,
  existingCargo = [],
  maxCargo,
  currentCargo = 0,
  backgroundColor,
}: CargoModalProps) {
  const [amount, setAmount] = useState(0)
  const [description, setDescription] = useState('')

  const hasCargoTracking = maxCargo !== undefined
  const availableCargo = hasCargoTracking ? maxCargo - currentCargo : 0
  const isValid = hasCargoTracking
    ? amount > 0 && amount <= availableCargo && description.trim() !== ''
    : description.trim() !== ''

  const handleSubmit = () => {
    if (isValid) {
      // Get all currently used colors
      const usedColors = existingCargo.map((item) => item.color)
      // Generate a unique color that hasn't been used
      const color = generateUniqueColor(usedColors)
      onAdd(hasCargoTracking ? amount : 1, description, color)
      setAmount(0)
      setDescription('')
      onClose()
    }
  }

  const handleClose = () => {
    setAmount(0)
    setDescription('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Cargo"
      backgroundColor={backgroundColor}
    >
      <Flex direction="column" gap={2}>
        {hasCargoTracking ? (
          <Flex gap={2} alignItems="flex-end">
            <Box w="24">
              <Text
                as="label"
                display="block"
                fontSize="xs"
                fontWeight="bold"
                color="su.inputBg"
                mb={1}
              >
                Amount
              </Text>
              <Input
                type="number"
                min="0"
                max={availableCargo}
                value={amount}
                onChange={(e) =>
                  setAmount(Math.max(0, Math.min(availableCargo, parseInt(e.target.value) || 0)))
                }
                w="full"
                p={1.5}
                borderWidth={0}
                borderRadius="lg"
                bg="su.inputBg"
                color="su.inputText"
                fontWeight="semibold"
                textAlign="center"
              />
            </Box>
            <Box flex="1">
              <Text
                as="label"
                display="block"
                fontSize="xs"
                fontWeight="bold"
                color="su.inputBg"
                mb={1}
              >
                Description (Available: {availableCargo})
              </Text>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter cargo description..."
                w="full"
                p={1.5}
                borderWidth={0}
                borderRadius="lg"
                bg="su.inputBg"
                color="su.inputText"
                fontWeight="semibold"
              />
            </Box>
          </Flex>
        ) : (
          <Box>
            <Text
              as="label"
              display="block"
              fontSize="xs"
              fontWeight="bold"
              color="su.inputBg"
              mb={1}
            >
              Description
            </Text>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter cargo description..."
              w="full"
              p={1.5}
              borderWidth={0}
              borderRadius="lg"
              bg="su.inputBg"
              color="su.inputText"
              fontWeight="semibold"
            />
          </Box>
        )}

        <Flex gap={2} justifyContent="flex-end" pt={1}>
          <Button
            onClick={handleClose}
            bg="su.brick"
            color="su.white"
            px={3}
            py={1.5}
            borderRadius="lg"
            fontWeight="bold"
            _hover={{ bg: 'su.black' }}
            fontSize="sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            bg="su.orange"
            color="su.white"
            px={3}
            py={1.5}
            borderRadius="lg"
            fontWeight="bold"
            _hover={{ bg: 'su.lightOrange' }}
            _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
            fontSize="sm"
          >
            {hasCargoTracking ? 'Add Cargo' : 'Add'}
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}
