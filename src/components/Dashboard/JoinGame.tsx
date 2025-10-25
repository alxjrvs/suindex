import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Box, Input, Text, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Heading } from '.././base/Heading'
import { redeemInviteCode } from '../../lib/api'

export function JoinGame() {
  const [searchParams] = useSearchParams()
  const [code, setCode] = useState(searchParams.get('code') || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setCode(searchParams.get('code') || '')
  }, [searchParams])

  const redeem = useCallback(
    async (invite: string) => {
      setError(null)
      setLoading(true)
      try {
        const gameId = await redeemInviteCode(invite)
        navigate(`/dashboard/games/${gameId}`)
      } catch (err) {
        console.error('Failed to join game', err)
        const message = err instanceof Error ? err.message : 'Failed to join game'
        if (message.includes('invalid_or_expired_code')) {
          setError('That invite code is invalid or expired.')
        } else if (message.includes('invite_max_uses_reached')) {
          setError('This invite has reached its maximum number of uses.')
        } else if (message.includes('not_authenticated')) {
          setError('You must be signed in to join a game.')
        } else {
          setError(message)
        }
      } finally {
        setLoading(false)
      }
    },
    [navigate]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    await redeem(code)
  }

  useEffect(() => {
    const q = searchParams.get('code')
    if (q && q.trim()) {
      // Auto-join when a code is present
      redeem(q)
    }
  }, [searchParams, redeem])

  return (
    <Box p={8} maxW="xl" mx="auto">
      <Button
        onClick={() => navigate('/dashboard')}
        variant="plain"
        color="su.brick"
        mb={4}
        _hover={{ textDecoration: 'underline' }}
      >
        ← Back to Dashboard
      </Button>
      <Heading level="h1" mb={6}>
        Join a Game
      </Heading>
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="su.white"
        borderWidth="1px"
        borderColor="su.lightBlue"
        borderRadius="lg"
        p={6}
      >
        <VStack gap={4} align="stretch">
          <Box>
            <Text
              as="label"
              display="block"
              fontSize="sm"
              fontWeight="medium"
              color="su.black"
              mb={2}
            >
              Invite Code
            </Text>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter invite code"
              borderColor="su.lightBlue"
              required
            />
          </Box>
          {error && (
            <Text color="red.600" fontSize="sm">
              {error}
            </Text>
          )}
          <Button
            type="submit"
            disabled={loading || !code.trim()}
            bg="su.brick"
            color="su.white"
            fontWeight="bold"
            py={2}
            px={6}
            _hover={{ opacity: 0.9 }}
            _disabled={{ opacity: 0.5 }}
          >
            {loading ? 'Joining…' : 'Join Game'}
          </Button>
        </VStack>
      </Box>
    </Box>
  )
}
