import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Box, Flex, Grid, Text, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '.././base/Heading'
import type { Tables } from '../../types/database'
import { NewPilotModal } from './NewPilotModal'
import { SalvageUnionReference } from 'salvageunion-reference'
import { useEntityGrid } from '../../hooks/useEntityGrid'
import { GridTileButton, CreateTileButton } from './GridTile'

type PilotRow = Tables<'pilots'>

export function PilotsGrid() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    items: pilots,
    loading,
    error,
    reload,
  } = useEntityGrid<PilotRow>({
    table: 'pilots',
    orderBy: 'created_at',
    orderAscending: false,
  })

  const handleCreatePilot = () => {
    setIsModalOpen(true)
  }

  const handlePilotClick = (pilotId: string) => {
    navigate(`/dashboard/pilots/${pilotId}`)
  }

  const handleModalSuccess = () => {
    reload()
  }

  if (loading) {
    return (
      <Box p={8}>
        <Flex align="center" justify="center" minH="60vh">
          <Text fontSize="xl" color="su.brick">
            Loading pilots...
          </Text>
        </Flex>
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={8}>
        <VStack align="center" justify="center" minH="60vh" gap={4}>
          <Text fontSize="xl" color="red.600">
            {error}
          </Text>
          <Button
            onClick={reload}
            bg="su.brick"
            color="su.white"
            fontWeight="bold"
            py={2}
            px={6}
            _hover={{ opacity: 0.9 }}
          >
            Retry
          </Button>
        </VStack>
      </Box>
    )
  }

  // If no pilots, show the centered "Create Pilot" button
  if (pilots.length === 0) {
    return (
      <Box p={8}>
        <Flex align="center" justify="center" minH="60vh">
          <VStack textAlign="center" gap={8}>
            <Heading level="h2" color="su.black">
              Your Pilots
            </Heading>
            <Text fontSize="lg" color="su.brick">
              You don't have any pilots yet. Create your first pilot to get started!
            </Text>
            <Button
              onClick={handleCreatePilot}
              bg="su.orange"
              color="su.white"
              fontWeight="bold"
              py={4}
              px={8}
              fontSize="xl"
              _hover={{ opacity: 0.9 }}
              boxShadow="lg"
            >
              Create Pilot
            </Button>
          </VStack>
        </Flex>

        <NewPilotModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      </Box>
    )
  }

  // Show pilots grid
  return (
    <Box p={8}>
      <Box mb={8}>
        <Heading level="h1" color="su.black">
          Your Pilots
        </Heading>
      </Box>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
        {/* Existing pilots */}
        {pilots.map((pilot) => {
          const className = pilot.class_id
            ? (SalvageUnionReference.Classes.all().find((c) => c.id === pilot.class_id)?.name ??
              'Unknown')
            : null
          const currentHP = pilot.current_damage ?? 0
          const maxHP = pilot.max_hp ?? 10
          const currentAP = pilot.current_ap ?? 0
          const maxAP = pilot.max_ap ?? 3

          return (
            <GridTileButton key={pilot.id} onClick={() => handlePilotClick(pilot.id)} h="48" p={6}>
              <Heading level="h3" lineClamp={1}>
                {pilot.callsign}
              </Heading>
              {className && (
                <Text fontSize="sm" color="su.black" opacity={0.8} lineClamp={1}>
                  {className}
                </Text>
              )}
              <Flex justifyContent="space-between" fontSize="sm" color="su.black" opacity={0.8} mt="auto">
                <Text as="span">HP: {currentHP}/{maxHP}</Text>
                <Text as="span">AP: {currentAP}/{maxAP}</Text>
              </Flex>
            </GridTileButton>
          )
        })}

        {/* Create Pilot cell */}
        <CreateTileButton
          onClick={handleCreatePilot}
          label="New Pilot"
          accentColor="su.orange"
          bgColor="su.lightOrange"
          h="48"
          p={6}
        />
      </Grid>

      <NewPilotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </Box>
  )
}
