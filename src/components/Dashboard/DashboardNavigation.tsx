import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, Button, Flex, IconButton, Text, HStack } from '@chakra-ui/react'
import { supabase } from '../../lib/supabase'
import type { User } from '@supabase/supabase-js'
import { Heading } from '../base/Heading'

interface DashboardNavigationProps {
  user: User
}

export function DashboardNavigation({ user }: DashboardNavigationProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

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

        {/* User info and sign out */}
        <Flex
          alignItems="center"
          gap={4}
          display={{ base: isOpen ? 'flex' : 'none', lg: 'flex' }}
          flexDirection={{ base: 'column', lg: 'row' }}
          w={{ base: 'full', lg: 'auto' }}
        >
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
        </Flex>
      </Flex>
    </>
  )
}
