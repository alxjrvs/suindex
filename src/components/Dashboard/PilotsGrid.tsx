import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Box, Flex, Grid, Text, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '.././base/Heading'
import type { Tables } from '../../types/database'
import { NewPilotModal } from './NewPilotModal'
import { SalvageUnionReference } from 'salvageunion-reference'
import { useEntityGrid } from '../../hooks/useEntityGrid'

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

          return (
            <Button
              key={pilot.id}
              onClick={() => handlePilotClick(pilot.id)}
              variant="plain"
              p={0}
              _hover={{ transform: 'scale(1.05)' }}
              transition="transform 0.2s"
            >
              <Box
                bg="su.orange"
                borderWidth="4px"
                borderColor="su.black"
                borderRadius="lg"
                p={6}
                h="120px"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                w="full"
              >
                <Box>
                  <Heading level="h3" color="su.white" mb={1}>
                    {pilot.callsign}
                  </Heading>
                  {className && (
                    <Text fontSize="sm" color="su.white" opacity={0.9}>
                      {className}
                    </Text>
                  )}
                </Box>
                <Flex justify="space-between" fontSize="xs" color="su.white" opacity={0.75}>
                  <Text>
                    HP: {pilot.current_damage ?? 0}/{pilot.max_hp ?? 10}
                  </Text>
                  <Text>
                    AP: {pilot.current_ap ?? 0}/{pilot.max_ap ?? 3}
                  </Text>
                </Flex>
              </Box>
            </Button>
          )
        })}

        {/* Create Pilot cell */}
        <Button
          onClick={handleCreatePilot}
          bg="su.lightOrange"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor="su.orange"
          borderRadius="lg"
          p={6}
          h="120px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          _hover={{ bg: 'su.orange', borderStyle: 'solid', '& > *': { color: 'su.white' } }}
        >
          <Text fontSize="5xl" color="su.orange" mb={2}>
            +
          </Text>
          <Text fontSize="lg" fontWeight="bold" color="su.orange">
            Create Pilot
          </Text>
        </Button>
      </Grid>

      <NewPilotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </Box>
  )
}
