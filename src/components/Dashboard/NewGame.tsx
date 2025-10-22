import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { Box, Flex, Input, Text, Textarea, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '.././base/Heading'
import { supabase } from '../../lib/supabase'
import type { TablesInsert } from '../../types/database'

interface GameFormData {
  name: string
  description: string
}

export function NewGame() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GameFormData>()

  const onSubmit = async (data: GameFormData) => {
    try {
      setIsSubmitting(true)
      setError(null)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create the game
      const gameData: TablesInsert<'games'> = {
        name: data.name,
        description: data.description || null,
        created_by: user.id,
      }

      const { data: game, error: gameError } = await supabase
        .from('games')
        .insert(gameData)
        .select()
        .single()

      if (gameError) throw gameError

      // The trigger will automatically add the creator as a mediator
      // No need to manually create the game_member relationship

      // Navigate to the game show page
      navigate(`/dashboard/games/${game.id}`)
    } catch (err) {
      console.error('Error creating game:', err)
      setError(err instanceof Error ? err.message : 'Failed to create game')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box p={8} maxW="2xl" mx="auto">
      <Box mb={8}>
        <Heading level="h1" size="2xl" color="su.black" mb={2}>
          Create New Game
        </Heading>
        <Text color="su.brick">Start a new Salvage Union game session</Text>
      </Box>

      {error && (
        <Box
          mb={6}
          p={4}
          bg="red.100"
          borderWidth="1px"
          borderColor="red.400"
          color="red.700"
          borderRadius="md"
        >
          {error}
        </Box>
      )}

      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={6} align="stretch">
          <Box>
            <Box
              as="label"
              display="block"
              fontSize="sm"
              fontWeight="medium"
              color="su.black"
              mb={2}
            >
              Game Name *
            </Box>
            <Input
              id="name"
              type="text"
              {...register('name', { required: 'Game name is required' })}
              placeholder="Enter game name"
              borderColor="su.lightBlue"
              focusRingColor="su.brick"
            />
            {errors.name && (
              <Text mt={1} fontSize="sm" color="red.600">
                {errors.name.message}
              </Text>
            )}
          </Box>

          <Box>
            <Box
              as="label"
              display="block"
              fontSize="sm"
              fontWeight="medium"
              color="su.black"
              mb={2}
            >
              Description
            </Box>
            <Textarea
              id="description"
              {...register('description')}
              rows={6}
              placeholder="Enter game description (optional)"
              borderColor="su.lightBlue"
              focusRingColor="su.brick"
            />
            {errors.description && (
              <Text mt={1} fontSize="sm" color="red.600">
                {errors.description.message}
              </Text>
            )}
          </Box>

          <Flex gap={4}>
            <Button
              type="submit"
              disabled={isSubmitting}
              flex={1}
              bg="su.brick"
              color="su.white"
              fontWeight="bold"
              py={3}
              px={6}
              _hover={{ opacity: 0.9 }}
              _disabled={{ opacity: 0.5 }}
            >
              {isSubmitting ? 'Creating...' : 'Create Game'}
            </Button>
            <Button
              type="button"
              onClick={() => navigate('/dashboard')}
              disabled={isSubmitting}
              flex={1}
              bg="su.lightBlue"
              color="su.black"
              fontWeight="bold"
              py={3}
              px={6}
              _hover={{ opacity: 0.9 }}
              _disabled={{ opacity: 0.5 }}
            >
              Cancel
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Box>
  )
}
