import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, Button, Flex, IconButton, Text, HStack } from '@chakra-ui/react'
import { supabase } from '../../lib/supabase'
import type { User } from '@supabase/supabase-js'
import { Heading } from '../base/Heading'

interface DashboardNavigationProps {
  user: User | null
  onSignIn?: () => void
}

export function DashboardNavigation({ user, onSignIn }: DashboardNavigationProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [signingIn, setSigningIn] = useState(false)

  const handleNavigate = (path: string) => {
    navigate(path)
    setIsOpen(false)
  }

  const handleSignOut = async () => {
    try {
      setSigningOut(true)
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setSigningOut(false)
    }
  }

  const handleSignIn = async () => {
    try {
      setSigningIn(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
      onSignIn?.()
    } catch (error) {
      console.error('Error signing in:', error)
    } finally {
      setSigningIn(false)
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Mobile menu button */}
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        position="fixed"
        top={4}
        right={4}
        zIndex={50}
        display={{ base: 'flex', lg: 'none' }}
        bg="su.orange"
        color="su.white"
        p={2}
        borderRadius="lg"
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </IconButton>

      {/* Mobile overlay */}
      {isOpen && (
        <Box
          position="fixed"
          inset={0}
          bg="blackAlpha.500"
          zIndex={30}
          display={{ base: 'block', lg: 'none' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Top navigation bar */}
      <Flex
        as="nav"
        position={{ base: 'fixed', lg: 'static' }}
        top={{ base: 0, lg: 'auto' }}
        left={{ base: 0, lg: 'auto' }}
        right={{ base: 0, lg: 'auto' }}
        bg="su.white"
        borderBottomWidth="2px"
        borderBottomColor="su.lightBlue"
        px={6}
        py={3}
        alignItems="center"
        justifyContent="space-between"
        zIndex={40}
        flexDirection={{ base: 'column', lg: 'row' }}
        gap={{ base: 4, lg: 0 }}
        shadow={{ base: isOpen ? 'lg' : 'none', lg: 'sm' }}
      >
        {/* Logo/Brand */}
        <Button
          onClick={() => handleNavigate('/')}
          _hover={{ bg: 'su.lightOrange' }}
          bg="transparent"
          borderRadius="md"
          variant="ghost"
          h="auto"
          p={2}
          display={{ base: isOpen ? 'block' : 'none', lg: 'block' }}
        >
          <Heading level="h2">Salvage Union</Heading>
          <Text fontSize="xs" color="su.brick">
            Dashboard
          </Text>
        </Button>

        {/* Navigation links */}
        <HStack
          as="ul"
          gap={2}
          display={{ base: isOpen ? 'flex' : 'none', lg: 'flex' }}
          flexDirection={{ base: 'column', lg: 'row' }}
          w={{ base: 'full', lg: 'auto' }}
        >
          <Box as="li">
            <Button
              onClick={() => handleNavigate('/dashboard')}
              px={4}
              py={2}
              _hover={{ bg: 'su.lightOrange' }}
              bg={isActive('/dashboard') ? 'su.lightBlue' : 'transparent'}
              borderBottomWidth={isActive('/dashboard') ? '3px' : 0}
              borderBottomColor="su.orange"
              color="su.black"
              fontWeight={isActive('/dashboard') ? 'semibold' : 'normal'}
              borderRadius="md"
              variant="ghost"
              h="auto"
              w={{ base: 'full', lg: 'auto' }}
            >
              Overview
            </Button>
          </Box>
          <Box as="li">
            <Button
              onClick={() => handleNavigate('/dashboard/games')}
              px={4}
              py={2}
              _hover={{ bg: 'su.lightOrange' }}
              bg={isActive('/dashboard/games') ? 'su.lightBlue' : 'transparent'}
              borderBottomWidth={isActive('/dashboard/games') ? '3px' : 0}
              borderBottomColor="su.orange"
              color="su.black"
              fontWeight={isActive('/dashboard/games') ? 'semibold' : 'normal'}
              borderRadius="md"
              variant="ghost"
              h="auto"
              w={{ base: 'full', lg: 'auto' }}
            >
              Games
            </Button>
          </Box>
          <Box as="li">
            <Button
              onClick={() => handleNavigate('/dashboard/crawlers')}
              px={4}
              py={2}
              _hover={{ bg: 'su.lightOrange' }}
              bg={isActive('/dashboard/crawlers') ? 'su.lightBlue' : 'transparent'}
              borderBottomWidth={isActive('/dashboard/crawlers') ? '3px' : 0}
              borderBottomColor="su.orange"
              color="su.black"
              fontWeight={isActive('/dashboard/crawlers') ? 'semibold' : 'normal'}
              borderRadius="md"
              variant="ghost"
              h="auto"
              w={{ base: 'full', lg: 'auto' }}
            >
              Crawlers
            </Button>
          </Box>
          <Box as="li">
            <Button
              onClick={() => handleNavigate('/dashboard/pilots')}
              px={4}
              py={2}
              _hover={{ bg: 'su.lightOrange' }}
              bg={isActive('/dashboard/pilots') ? 'su.lightBlue' : 'transparent'}
              borderBottomWidth={isActive('/dashboard/pilots') ? '3px' : 0}
              borderBottomColor="su.orange"
              color="su.black"
              fontWeight={isActive('/dashboard/pilots') ? 'semibold' : 'normal'}
              borderRadius="md"
              variant="ghost"
              h="auto"
              w={{ base: 'full', lg: 'auto' }}
            >
              Pilots
            </Button>
          </Box>
          <Box as="li">
            <Button
              onClick={() => handleNavigate('/dashboard/mechs')}
              px={4}
              py={2}
              _hover={{ bg: 'su.lightOrange' }}
              bg={isActive('/dashboard/mechs') ? 'su.lightBlue' : 'transparent'}
              borderBottomWidth={isActive('/dashboard/mechs') ? '3px' : 0}
              borderBottomColor="su.orange"
              color="su.black"
              fontWeight={isActive('/dashboard/mechs') ? 'semibold' : 'normal'}
              borderRadius="md"
              variant="ghost"
              h="auto"
              w={{ base: 'full', lg: 'auto' }}
            >
              Mechs
            </Button>
          </Box>
          <Box as="li">
            <Button
              onClick={() => handleNavigate('/reference/')}
              px={4}
              py={2}
              _hover={{ bg: 'su.lightOrange' }}
              bg={isActive('/reference/') ? 'su.lightBlue' : 'transparent'}
              borderBottomWidth={isActive('/reference/') ? '3px' : 0}
              borderBottomColor="su.orange"
              color="su.black"
              fontWeight={isActive('/reference/') ? 'semibold' : 'normal'}
              borderRadius="md"
              variant="ghost"
              h="auto"
              w={{ base: 'full', lg: 'auto' }}
            >
              Rules Reference
            </Button>
          </Box>
        </HStack>

        {/* User info and sign out / Sign in */}
        <Flex
          alignItems="center"
          gap={4}
          display={{ base: isOpen ? 'flex' : 'none', lg: 'flex' }}
          flexDirection={{ base: 'column', lg: 'row' }}
          w={{ base: 'full', lg: 'auto' }}
        >
          {user ? (
            <>
              <Text fontSize="sm" color="su.black" fontWeight="medium">
                {user.user_metadata?.full_name || user.email || 'User'}
              </Text>
              <Button
                onClick={handleSignOut}
                disabled={signingOut}
                px={4}
                py={2}
                fontSize="sm"
                color="su.white"
                bg="su.brick"
                _hover={{ bg: 'su.orange' }}
                _disabled={{ opacity: 0.5 }}
                borderRadius="md"
                h="auto"
                w={{ base: 'full', lg: 'auto' }}
              >
                {signingOut ? 'Signing out...' : 'Sign Out'}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleSignIn}
              disabled={signingIn}
              px={4}
              py={2}
              fontSize="sm"
              color="su.white"
              bg="su.discordBlurple"
              _hover={{ bg: 'su.discordBlurpleHover' }}
              _disabled={{ opacity: 0.5 }}
              borderRadius="md"
              h="auto"
              w={{ base: 'full', lg: 'auto' }}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 71 55"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M60.1045 4.8978C55.6915 2.6951 50.7878 1.1116 45.7051 0C45.1588 1.1001 44.7521 2.3928 44.4604 3.6752C39.1629 2.8591 33.8887 2.8591 28.6145 3.6752C28.3228 2.3928 27.8935 1.1001 27.3467 0C22.2727 1.1116 17.3691 2.6951 12.9054 4.8978C2.23278 21.7490 -0.177363 38.1693 0.0107169 54.1991C5.4626 57.8879 10.7354 60.7751 15.9042 62.5965C17.2799 60.5653 18.5182 58.465 19.5608 56.2912C17.6147 55.7627 15.7429 55.1079 13.9695 54.3012C14.3342 54.0montenegro 14.6564 53.7651 14.9566 53.5235C58.3662 75.3735 122.386 75.9468 164.141 53.5235C164.428 53.7818 164.744 54.0montenegro 165.115 54.3012C163.325 55.1079 161.453 55.7627 159.504 56.2912C160.547 58.465 161.784 60.5653 163.160 62.5965C168.328 60.7751 173.601 57.8879 179.052 54.1991C179.467 35.4244 174.144 19.0951 164.228 4.8978C159.881 2.6951 155.017 1.1116 150.013 0C149.467 1.1001 149.047 2.3928 148.769 3.6752C143.471 2.8591 138.197 2.8591 132.923 3.6752C132.640 2.3928 132.211 1.1001 131.664 0C126.584 1.1116 121.718 2.6951 117.329 4.8978C106.701 21.7490 103.289 38.1693 103.467 54.1991C108.918 57.8879 114.191 60.7751 119.360 62.5965C120.736 60.5653 121.974 58.465 123.016 56.2912C121.070 55.7627 119.198 55.1079 117.425 54.3012C117.789 54.0montenegro 118.111 53.7651 118.411 53.5235C161.822 75.3735 225.873 75.9468 267.628 53.5235C267.915 53.7818 268.231 54.0montenegro 268.602 54.3012C266.812 55.1079 264.940 55.7627 262.991 56.2912C264.034 58.465 265.271 60.5653 266.647 62.5965C271.816 60.7751 277.089 57.8879 282.540 54.1991C282.9 35.4244 277.6 19.0951 267.7 4.8978Z"
                  fill="currentColor"
                />
              </svg>
              {signingIn ? 'Connecting...' : 'Sign in with Discord'}
            </Button>
          )}
        </Flex>
      </Flex>
    </>
  )
}
