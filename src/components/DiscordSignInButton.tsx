import { useState } from 'react'
import { Button } from '@chakra-ui/react'
import type { ButtonProps } from '@chakra-ui/react'
import { signInWithDiscord } from '../lib/api'

interface DiscordSignInButtonProps extends ButtonProps {
  redirectTo?: string
}

export function DiscordSignInButton({
  redirectTo = `${window.location.origin}/dashboard`,
  ...props
}: DiscordSignInButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDiscordLogin = async () => {
    try {
      setLoading(true)
      await signInWithDiscord(redirectTo)
    } catch (error) {
      console.error('Error signing in:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDiscordLogin}
      disabled={loading}
      px={6}
      py={3}
      fontSize="md"
      fontWeight="bold"
      color="su.white"
      bg="su.discordBlurple"
      _hover={{ opacity: 0.9 }}
      _disabled={{ opacity: 0.5 }}
      borderRadius="md"
      h="auto"
      {...props}
    >
      {loading ? 'Signing in...' : 'Sign in with Discord'}
    </Button>
  )
}
