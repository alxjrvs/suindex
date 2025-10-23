import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Box, Flex, Grid, Text, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '.././base/Heading'
import type { Tables } from '../../types/database'
import { SalvageUnionReference } from 'salvageunion-reference'
import { NewMechModal } from './NewMechModal'
import { useEntityGrid } from '../../hooks/useEntityGrid'
import { GridTileButton, CreateTileButton } from './GridTile'

type MechRow = Tables<'mechs'>

export function MechsGrid() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    items: mechs,
    loading,
    error,
    reload,
  } = useEntityGrid<MechRow>({
    table: 'mechs',
    orderBy: 'created_at',
    orderAscending: false,
  })

  const handleCreateMech = () => {
    setIsModalOpen(true)
  }

  const handleMechClick = (mechId: string) => {
    navigate(`/dashboard/mechs/${mechId}`)
  }

  const handleModalSuccess = () => {
    reload()
  }

  if (loading) {
    return (
      <Box p={8}>
        <Flex align="center" justify="center" minH="60vh">
          <Text fontSize="xl" color="su.brick">
            Loading mechs...
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

  // If no mechs, show the centered "Create Mech" button
  if (mechs.length === 0) {
    return (
      <Box p={8}>
        <Flex align="center" justify="center" minH="60vh">
          <VStack textAlign="center" gap={8}>
            <Heading level="h2" color="su.black">
              Your Mechs
            </Heading>
            <Text fontSize="lg" color="su.brick">
              You don't have any mechs yet. Create your first mech to get started!
            </Text>
            <Button
              onClick={handleCreateMech}
              bg="su.green"
              color="su.white"
              fontWeight="bold"
              py={4}
              px={8}
              fontSize="xl"
              _hover={{ opacity: 0.9 }}
              boxShadow="lg"
            >
              Create Mech
            </Button>
          </VStack>
        </Flex>

        <NewMechModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      </Box>
    )
  }

  // Show mechs grid
  return (
    <Box p={8}>
      <Box mb={8}>
        <Heading level="h1" color="su.black">
          Your Mechs
        </Heading>
      </Box>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
        {/* Existing mechs */}
        {mechs.map((mech) => {
          const chassisName = mech.chassis_id
            ? (SalvageUnionReference.Chassis.all().find((c) => c.id === mech.chassis_id)?.name ??
              'Unknown')
            : 'No Chassis'

          return (
            <GridTileButton key={mech.id} onClick={() => handleMechClick(mech.id)} h="48" p={6}>
              <Heading level="h3" lineClamp={1}>
                {mech.pattern || chassisName}
              </Heading>
              {mech.pattern ? (
                <Text fontSize="sm" color="su.black" opacity={0.8} lineClamp={1}>
                  {chassisName}
                </Text>
              ) : null}
              <Flex justifyContent="space-between" fontSize="sm" color="su.black" opacity={0.8} mt="auto">
                <Text as="span">Damage: {mech.current_damage ?? 0}</Text>
                <Text as="span">Heat: {mech.current_heat ?? 0}</Text>
              </Flex>
            </GridTileButton>
          )
        })}

        {/* Create Mech cell */}
        <CreateTileButton
          onClick={handleCreateMech}
          label="New Mech"
          accentColor="su.green"
          bgColor="su.lightBlue"
          h="48"
          p={6}
        />
      </Grid>

      <NewMechModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </Box>
  )
}
