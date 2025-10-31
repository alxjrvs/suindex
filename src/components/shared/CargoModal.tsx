import { useState, useCallback } from 'react'
import { Box, Button, Flex, Input, Text, VStack } from '@chakra-ui/react'
import Modal from '../Modal'
import { EntitySelectionModal } from '../entity/EntitySelectionModal'
import type { SURefEntity, SURefSchemaName } from 'salvageunion-reference'
import { SalvageUnionReference } from 'salvageunion-reference'

interface CargoModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (
    amount: number,
    description: string,
    color: string,
    ref?: string,
    position?: { row: number; col: number }
  ) => void
  maxCargo?: number // Optional - if provided, shows amount input and tracking
  currentCargo?: number // Optional - if provided, shows available cargo
  backgroundColor?: string // For different builder colors
  position?: { row: number; col: number } | null // Optional - grid position where item should be placed
}

export function CargoModal({
  isOpen,
  onClose,
  onAdd,
  maxCargo,
  currentCargo = 0,
  backgroundColor,
  position,
}: CargoModalProps) {
  const [amount, setAmount] = useState(0)
  const [description, setDescription] = useState('')
  const [isEntitySelectorOpen, setIsEntitySelectorOpen] = useState(false)

  const hasCargoTracking = maxCargo !== undefined
  const availableCargo = hasCargoTracking ? maxCargo - currentCargo : 0
  const isValid = hasCargoTracking
    ? amount > 0 && amount <= availableCargo && description.trim() !== ''
    : description.trim() !== ''

  // Function to determine if an entity should be disabled based on salvage value
  const shouldDisableEntity = useCallback(
    (entity: SURefEntity): boolean => {
      if (!hasCargoTracking) return false

      let salvageValue: number | undefined

      // Check for nested salvageValue (chassis has stats.salvageValue)
      if ('stats' in entity && typeof entity.stats === 'object' && entity.stats) {
        const stats = entity.stats as { salvageValue?: number }
        if ('salvageValue' in stats) {
          salvageValue = stats.salvageValue
        }
      }

      // Check for top-level salvageValue (systems, modules)
      if (salvageValue === undefined && 'salvageValue' in entity) {
        salvageValue = entity.salvageValue as number
      }

      if (salvageValue === undefined) return false
      return salvageValue > availableCargo
    },
    [hasCargoTracking, availableCargo]
  )

  // Handle entity selection from the modal
  const handleEntitySelect = (entityId: string, schemaName: SURefSchemaName) => {
    // Get the entity from reference data using the newer .get() method
    const entity = SalvageUnionReference.get(schemaName, entityId)
    if (entity && 'name' in entity) {
      const entityName = entity.name as string

      // Extract salvage value - check nested (chassis) first, then top-level
      let salvageValue = 1
      if ('stats' in entity && typeof entity.stats === 'object' && entity.stats) {
        const stats = entity.stats as { salvageValue?: number }
        if ('salvageValue' in stats) {
          salvageValue = stats.salvageValue || 1
        }
      }
      if (salvageValue === 1 && 'salvageValue' in entity) {
        salvageValue = (entity.salvageValue as number) || 1
      }

      // Compose reference string for database storage
      const ref = SalvageUnionReference.composeRef(schemaName, entityId)
      onAdd(
        salvageValue,
        entityName,
        '', // Color is ignored - determined by ref data at render time
        ref,
        position ?? undefined
      )
      setIsEntitySelectorOpen(false)
      onClose()
    }
  }

  const handleSubmit = () => {
    if (isValid) {
      // Color is ignored - not stored in database
      onAdd(hasCargoTracking ? amount : 1, description, '', undefined, position ?? undefined)
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
    <>
      <Modal
        isOpen={isOpen && !isEntitySelectorOpen}
        onClose={handleClose}
        title="Add Cargo"
        backgroundColor={backgroundColor}
      >
        <VStack direction="column" gap={3} alignItems="stretch">
          {/* Select System/Module/Chassis Button */}
          {hasCargoTracking && (
            <Button
              onClick={() => setIsEntitySelectorOpen(true)}
              w="full"
              bg="su.black"
              color="su.white"
              px={4}
              py={3}
              borderRadius="md"
              fontWeight="bold"
              textTransform="uppercase"
              fontSize="sm"
              _hover={{ bg: 'su.brick' }}
            >
              Select System, Module, or Chassis
            </Button>
          )}

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
                  borderRadius="md"
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
                  borderRadius="md"
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
                borderRadius="md"
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
              borderRadius="md"
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
              borderRadius="md"
              fontWeight="bold"
              _hover={{ bg: 'su.lightOrange' }}
              _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
              fontSize="sm"
            >
              {hasCargoTracking ? 'Add Cargo' : 'Add'}
            </Button>
          </Flex>
        </VStack>
      </Modal>

      {/* Entity Selection Modal for Systems/Modules/Chassis */}
      <EntitySelectionModal
        isOpen={isEntitySelectorOpen}
        onClose={() => setIsEntitySelectorOpen(false)}
        schemaNames={['systems', 'modules', 'chassis']}
        onSelect={handleEntitySelect}
        title="Select System, Module, or Chassis"
        selectButtonTextPrefix="Add"
        shouldDisableEntity={shouldDisableEntity}
      />
    </>
  )
}
