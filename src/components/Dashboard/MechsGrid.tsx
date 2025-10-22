import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Box, Button, Flex, Grid, Text, VStack } from '@chakra-ui/react'
import { Heading } from '../shared/StyledHeading'
import { supabase } from '../../lib/supabase'
import type { Tables } from '../../types/database'
import { SalvageUnionReference } from 'salvageunion-reference'
import { NewMechModal } from './NewMechModal'

type MechRow = Tables<'mechs'>

export function MechsGrid() {
  const navigate = useNavigate()
  const [mechs, setMechs] = useState<MechRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadMechs()
  }, [])

  const loadMechs = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Fetch mechs owned by the user
      const { data: mechsData, error: mechsError } = await supabase
        .from('mechs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (mechsError) throw mechsError

      setMechs((mechsData || []) as MechRow[])
    } catch (err) {
      console.error('Error loading mechs:', err)
      setError(err instanceof Error ? err.message : 'Failed to load mechs')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMech = () => {
    setIsModalOpen(true)
  }

  const handleMechClick = (mechId: string) => {
    navigate(`/dashboard/mechs/${mechId}`)
  }

  const handleModalSuccess = () => {
    loadMechs()
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
            onClick={loadMechs}
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
            <Heading as="h2" size="2xl" color="su.black">
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
        <Heading as="h1" size="2xl" color="su.black">
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
            <Button
              key={mech.id}
              onClick={() => handleMechClick(mech.id)}
              variant="plain"
              p={0}
              _hover={{ transform: 'scale(1.05)' }}
              transition="transform 0.2s"
            >
              <Box
                bg="su.green"
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
                  <Heading as="h3" size="lg" color="su.white" mb={1}>
                    {mech.pattern || chassisName}
                  </Heading>
                  {mech.pattern && (
                    <Text fontSize="sm" color="su.white" opacity={0.9}>
                      {chassisName}
                    </Text>
                  )}
                </Box>
                <Flex justify="space-between" fontSize="xs" color="su.white" opacity={0.75}>
                  <Text>Damage: {mech.current_damage ?? 0}</Text>
                  <Text>Heat: {mech.current_heat ?? 0}</Text>
                </Flex>
              </Box>
            </Button>
          )
        })}

        {/* Create Mech cell */}
        <Button
          onClick={handleCreateMech}
          bg="su.lightBlue"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor="su.green"
          borderRadius="lg"
          p={6}
          h="120px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          _hover={{ bg: 'su.green', borderStyle: 'solid', '& > *': { color: 'su.white' } }}
        >
          <Text fontSize="5xl" color="su.green" mb={2}>
            +
          </Text>
          <Text fontSize="lg" fontWeight="bold" color="su.green">
            Create Mech
          </Text>
        </Button>
      </Grid>

      <NewMechModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </Box>
  )
}
