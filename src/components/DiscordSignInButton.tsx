import { useState } from 'react'
import { Button, Flex } from '@chakra-ui/react'
import type { ButtonProps } from '@chakra-ui/react'
import { signInWithDiscord } from '../lib/api'
import { DiscordIcon } from './shared/DiscordIcon'

interface DiscordSignInButtonProps extends ButtonProps {
  redirectTo?: string
  respect?: boolean
}

export function DiscordSignInButton({
  redirectTo = `${window.location.origin}/dashboard`,
  respect = true,
  ...props
}: DiscordSignInButtonProps) {
  const [loading, setLoading] = useState(false)

  // Check if Discord sign-in should be shown
  if (respect && import.meta.env.VITE_SHOW_DISCORD_SIGNIN !== '1') {
    return null
  }

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
      <Flex align="center" gap={2}>
        <DiscordIcon />
        {loading ? 'Signing in...' : 'Sign in with Discord'}
      </Flex>
    </Button>
  )
}
