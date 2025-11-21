import { Box, Button, Flex, IconButton, HStack, Text } from '@chakra-ui/react'
import type { User } from '@supabase/supabase-js'
import { Link } from '@tanstack/react-router'
import { Heading } from '@/components/base/Heading'
import { useNavigationState } from '@/hooks/useNavigationState'
import { NavigationLink } from '@/components/shared/NavigationLink'
import { UserMenu } from '@/components/shared/UserMenu'
import { DiscordSignInButton } from '@/components/DiscordSignInButton'

interface DashboardNavigationProps {
  user: User | null
}

export function DashboardNavigation({ user }: DashboardNavigationProps) {
  const { isOpen, signingOut, handleSignOut, isActive, toggleMenu } = useNavigationState()

  return (
    <>
      <IconButton
        onClick={toggleMenu}
        position="fixed"
        top={4}
        right={4}
        zIndex={50}
        display={{ base: 'flex', lg: 'none' }}
        bg="su.orange"
        color="su.white"
        p={2}
        borderRadius="md"
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

      {isOpen && (
        <Box
          position="fixed"
          inset={0}
          bg="blackAlpha.500"
          zIndex={30}
          display={{ base: 'block', lg: 'none' }}
          onClick={toggleMenu}
        />
      )}

      <Flex
        as="nav"
        position={{ base: 'fixed', lg: 'static' }}
        top={{ base: 0, lg: 'auto' }}
        left={{ base: 0, lg: 'auto' }}
        right={{ base: 0, lg: 'auto' }}
        bg="bg.canvas"
        borderBottomWidth="2px"
        borderBottomColor="border.default"
        px={6}
        py={3}
        alignItems="center"
        justifyContent="space-between"
        zIndex={40}
        flexDirection={{ base: 'column', lg: 'row' }}
        gap={{ base: 4, lg: 0 }}
        shadow={{ base: isOpen ? 'lg' : 'none', lg: 'sm' }}
      >
        <Button
          asChild
          _hover={{ bg: 'bg.hover' }}
          bg="transparent"
          borderRadius="md"
          variant="ghost"
          h="auto"
          p={2}
          display={{ base: isOpen ? 'block' : 'none', lg: 'block' }}
          color="fg.default"
        >
          <Link to="/">
            <Heading level="h2">Salvage Union</Heading>
            <Text fontSize="xs" color="brand.srd">
              Dashboard
            </Text>
          </Link>
        </Button>

        <HStack
          as="ul"
          gap={2}
          display={{ base: isOpen ? 'flex' : 'none', lg: 'flex' }}
          flexDirection={{ base: 'column', lg: 'row' }}
          w={{ base: 'full', lg: 'auto' }}
        >
          <Box as="li">
            <NavigationLink isActive={isActive('/dashboard', true)} to="/dashboard">
              Overview
            </NavigationLink>
          </Box>
          <Box as="li">
            <NavigationLink isActive={isActive('/dashboard/games')} to="/dashboard/games">
              Games
            </NavigationLink>
          </Box>
          <Box as="li">
            <NavigationLink isActive={isActive('/dashboard/crawlers')} to="/dashboard/crawlers">
              Crawlers
            </NavigationLink>
          </Box>
          <Box as="li">
            <NavigationLink isActive={isActive('/dashboard/pilots')} to="/dashboard/pilots">
              Pilots
            </NavigationLink>
          </Box>
          <Box as="li">
            <NavigationLink isActive={isActive('/dashboard/mechs')} to="/dashboard/mechs">
              Mechs
            </NavigationLink>
          </Box>
        </HStack>

        <Flex
          alignItems="center"
          gap={4}
          display={{ base: isOpen ? 'flex' : 'none', lg: 'flex' }}
          flexDirection={{ base: 'column', lg: 'row' }}
          w={{ base: 'full', lg: 'auto' }}
        >
          <UserMenu
            user={user}
            onSignOut={handleSignOut}
            signingOut={signingOut}
            signInComponent={
              <DiscordSignInButton px={4} py={2} fontSize="sm" w={{ base: 'full', lg: 'auto' }} />
            }
          />
        </Flex>
      </Flex>
    </>
  )
}
