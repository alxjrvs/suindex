import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, Button, Flex, IconButton, Text, HStack, Menu, Portal } from '@chakra-ui/react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import { Heading } from './base/Heading'
import { DiscordSignInButton } from './DiscordSignInButton'

interface TopNavigationProps {
  user: User | null
}

export function TopNavigation({ user }: TopNavigationProps) {
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

  const isActive = (path: string) => location.pathname.startsWith(path)
  const isDashboard = location.pathname.startsWith('/dashboard')
  const isReference = location.pathname.startsWith('/reference')
  const isLanding = location.pathname === '/'

  // Determine which links to show based on current page
  const showDashboardLinks = isDashboard
  const showReferenceLinks = isReference
  const showLandingLinks = isLanding

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
        justifyContent="flex-start"
        zIndex={40}
        flexDirection={{ base: 'column', lg: 'row' }}
        gap={{ base: 4, lg: 0 }}
        shadow={{ base: isOpen ? 'lg' : 'none', lg: 'sm' }}
      >
        {/* Left section: Logo + Navigation links */}
        <Flex
          alignItems="center"
          gap={2}
          display={{ base: isOpen ? 'flex' : 'none', lg: 'flex' }}
          flexDirection={{ base: 'column', lg: 'row' }}
          flex={{ base: 'none', lg: 1 }}
        >
          {/* Logo/Brand */}
          <Button
            onClick={() => {
              if (isDashboard) {
                handleNavigate('/dashboard')
              } else if (isReference) {
                handleNavigate('/reference')
              } else {
                handleNavigate('/')
              }
            }}
            _hover={{ bg: 'su.lightOrange' }}
            bg="transparent"
            borderRadius="md"
            variant="ghost"
            h="auto"
            p={2}
          >
            <Heading level="h2">Salvage Union</Heading>
            {!isLanding && (
              <Text fontSize="xs" color="su.brick">
                {isDashboard ? 'Dashboard' : isReference ? 'Reference' : ''}
              </Text>
            )}
          </Button>

          {/* Dashboard link from reference pages */}
          {showReferenceLinks && (
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
              Dashboard
            </Button>
          )}

          {/* Rules Reference link from dashboard */}
          {showDashboardLinks && (
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
          )}

          {/* Dashboard link from landing page */}
          {showLandingLinks && (
            <Button
              onClick={() => handleNavigate('/dashboard')}
              px={4}
              py={2}
              _hover={{ bg: 'su.lightOrange' }}
              bg="transparent"
              color="su.black"
              fontWeight="normal"
              borderRadius="md"
              variant="ghost"
              h="auto"
              w={{ base: 'full', lg: 'auto' }}
            >
              Dashboard
            </Button>
          )}

          {/* Rules Reference link from landing page */}
          {showLandingLinks && (
            <Button
              onClick={() => handleNavigate('/reference/')}
              px={4}
              py={2}
              _hover={{ bg: 'su.lightOrange' }}
              bg="transparent"
              color="su.black"
              fontWeight="normal"
              borderRadius="md"
              variant="ghost"
              h="auto"
              w={{ base: 'full', lg: 'auto' }}
            >
              Rules Reference
            </Button>
          )}

          {/* Navigation links */}
          <HStack
            as="ul"
            gap={2}
            display={{ base: 'flex', lg: 'flex' }}
            flexDirection={{ base: 'column', lg: 'row' }}
            w={{ base: 'full', lg: 'auto' }}
          >
            {/* Dashboard Links */}
            {showDashboardLinks && (
              <>
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
              </>
            )}

            {/* Reference Links - Dropdowns */}
            {showReferenceLinks && (
              <>
                {/* Schemas Dropdown */}
                <Box as="li">
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <Button
                        px={4}
                        py={2}
                        _hover={{ bg: 'su.lightOrange' }}
                        bg={isActive('/reference/schema') ? 'su.lightBlue' : 'transparent'}
                        borderBottomWidth={isActive('/reference/schema') ? '3px' : 0}
                        borderBottomColor="su.orange"
                        color="su.black"
                        fontWeight={isActive('/reference/schema') ? 'semibold' : 'normal'}
                        borderRadius="md"
                        variant="ghost"
                        h="auto"
                        w={{ base: 'full', lg: 'auto' }}
                      >
                        Schemas
                      </Button>
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content maxH="300px" minW="200px">
                          <Menu.Item
                            value="abilities"
                            onSelect={() => handleNavigate('/reference/schema/abilities')}
                          >
                            Abilities
                          </Menu.Item>
                          <Menu.Item
                            value="equipment"
                            onSelect={() => handleNavigate('/reference/schema/equipment')}
                          >
                            Equipment
                          </Menu.Item>
                          <Menu.Item
                            value="chassis"
                            onSelect={() => handleNavigate('/reference/schema/chassis')}
                          >
                            Chassis
                          </Menu.Item>
                          <Menu.Item
                            value="patterns"
                            onSelect={() => handleNavigate('/reference/schema/patterns')}
                          >
                            Patterns
                          </Menu.Item>
                          <Menu.Item
                            value="systems"
                            onSelect={() => handleNavigate('/reference/schema/systems')}
                          >
                            Systems
                          </Menu.Item>
                          <Menu.Item
                            value="modules"
                            onSelect={() => handleNavigate('/reference/schema/modules')}
                          >
                            Modules
                          </Menu.Item>
                          <Menu.Item
                            value="classes"
                            onSelect={() => handleNavigate('/reference/schema/classes')}
                          >
                            Classes
                          </Menu.Item>
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>
                </Box>

                {/* Playground Dropdown */}
                <Box as="li">
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <Button
                        px={4}
                        py={2}
                        _hover={{ bg: 'su.lightOrange' }}
                        bg={isActive('/reference/sheets') ? 'su.lightBlue' : 'transparent'}
                        borderBottomWidth={isActive('/reference/sheets') ? '3px' : 0}
                        borderBottomColor="su.orange"
                        color="su.black"
                        fontWeight={isActive('/reference/sheets') ? 'semibold' : 'normal'}
                        borderRadius="md"
                        variant="ghost"
                        h="auto"
                        w={{ base: 'full', lg: 'auto' }}
                      >
                        Playground
                      </Button>
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content minW="200px">
                          <Menu.Item
                            value="mech-sheet"
                            onSelect={() => handleNavigate('/reference/sheets/mech')}
                          >
                            Mech Live Sheet
                          </Menu.Item>
                          <Menu.Item
                            value="pilot-sheet"
                            onSelect={() => handleNavigate('/reference/sheets/pilot')}
                          >
                            Pilot Live Sheet
                          </Menu.Item>
                          <Menu.Item
                            value="crawler-sheet"
                            onSelect={() => handleNavigate('/reference/sheets/crawler')}
                          >
                            Crawler Live Sheet
                          </Menu.Item>
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>
                </Box>
              </>
            )}
          </HStack>
        </Flex>

        {/* Right section: User info and sign out / Sign in */}
        <Flex
          alignItems="center"
          gap={4}
          display={{ base: isOpen ? 'flex' : 'none', lg: 'flex' }}
          flexDirection={{ base: 'column', lg: 'row' }}
          w={{ base: 'full', lg: 'auto' }}
          ml={{ base: 0, lg: 'auto' }}
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
            <DiscordSignInButton
              px={4}
              py={2}
              fontSize="sm"
              w={{ base: 'full', lg: 'auto' }}
              display="flex"
              alignItems="center"
              gap={2}
            />
          )}
        </Flex>
      </Flex>
    </>
  )
}
