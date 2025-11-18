import { useState } from 'react'
import { Button, Flex } from '@chakra-ui/react'
import type { ButtonProps } from '@chakra-ui/react'
import { useSearch } from '@tanstack/react-router'
import { signInWithDiscord } from '../lib/api'
import { DiscordIcon } from './shared/DiscordIcon'

interface DiscordSignInButtonProps extends ButtonProps {
  redirectTo?: string
  respect?: boolean
}

export function DiscordSignInButton({
  redirectTo,
  respect = true,
  ...props
}: DiscordSignInButtonProps) {
  const [loading, setLoading] = useState(false)

  const search = useSearch({ strict: false })
  const searchParams = search as Record<string, unknown>
  const havenKey = Object.keys(searchParams).find((key) => key.toUpperCase() === 'HAVEN')
  const havenValue = havenKey ? searchParams[havenKey] : undefined
  const havenStr = havenValue != null ? String(havenValue) : undefined

  let showDiscordSignIn = havenStr?.toUpperCase() === 'TRUE'
  if (!showDiscordSignIn && typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    const havenParam = urlParams.get('haven') || urlParams.get('HAVEN')
    showDiscordSignIn = havenParam?.toUpperCase() === 'TRUE'
  }

  if (respect && !showDiscordSignIn) {
    return null
  }

  const handleDiscordLogin = async () => {
    try {
      setLoading(true)

      const defaultRedirect =
        typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : '/dashboard'
      await signInWithDiscord(redirectTo || defaultRedirect)
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
