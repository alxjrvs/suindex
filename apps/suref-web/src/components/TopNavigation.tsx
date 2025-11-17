import { Box, Button, Flex, IconButton, HStack, Menu, Portal, Text } from '@chakra-ui/react'
import type { User } from '@supabase/supabase-js'
import type { SchemaInfo } from '../types/schema'
import { Heading } from './base/Heading'
import { useNavigationState } from '../hooks/useNavigationState'
import { NavigationLink } from './shared/NavigationLink'
import { UserMenu } from './shared/UserMenu'

interface TopNavigationProps {
  user: User | null
  schemas?: SchemaInfo[]
}

export function TopNavigation({ user, schemas = [] }: TopNavigationProps) {
  const { isOpen, signingOut, handleNavigate, handleSignOut, isActive, toggleMenu } =
    useNavigationState()

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
        <Flex
          alignItems="center"
          gap={2}
          display={{ base: isOpen ? 'flex' : 'none', lg: 'flex' }}
          flexDirection={{ base: 'column', lg: 'row' }}
          flex={{ base: 'none', lg: 1 }}
        >
          <Button
            onClick={() => handleNavigate('/')}
            _hover={{ bg: 'su.lightOrange' }}
            bg="transparent"
            borderRadius="md"
            variant="ghost"
            h="auto"
            p={2}
          >
            <Heading level="h2">Salvage Union</Heading>
            <Text fontSize="xs" color="su.brick">
              Reference
            </Text>
          </Button>

          <HStack
            as="ul"
            gap={2}
            display={{ base: 'flex', lg: 'flex' }}
            flexDirection={{ base: 'column', lg: 'row' }}
            w={{ base: 'full', lg: 'auto' }}
          >
            <Box as="li">
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button
                    px={4}
                    py={2}
                    _hover={{ bg: 'su.lightOrange' }}
                    bg={isActive('/schema') ? 'su.lightBlue' : 'transparent'}
                    borderBottomWidth={isActive('/schema') ? '3px' : 0}
                    borderBottomColor="su.orange"
                    color="su.black"
                    fontWeight={isActive('/schema') ? 'semibold' : 'normal'}
                    borderRadius="md"
                    variant="ghost"
                    h="auto"
                    w={{ base: 'full', lg: 'auto' }}
                  >
                    Schema
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content maxH="300px" minW="200px" overflowY="auto">
                      {schemas.map((schema) => (
                        <Menu.Item
                          key={schema.id}
                          value={schema.id}
                          onSelect={() => handleNavigate(`/schema/${schema.id}`)}
                        >
                          {schema.displayName || schema.title.replace('Salvage Union ', '')}
                        </Menu.Item>
                      ))}
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </Box>

            <Box as="li">
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button
                    px={4}
                    py={2}
                    _hover={{ bg: 'su.lightOrange' }}
                    bg={isActive('/sheets') ? 'su.lightBlue' : 'transparent'}
                    borderBottomWidth={isActive('/sheets') ? '3px' : 0}
                    borderBottomColor="su.orange"
                    color="su.black"
                    fontWeight={isActive('/sheets') ? 'semibold' : 'normal'}
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
                      <Menu.Item value="mech-sheet" onSelect={() => handleNavigate('/sheets/mech')}>
                        Mech Live Sheet
                      </Menu.Item>
                      <Menu.Item
                        value="pilot-sheet"
                        onSelect={() => handleNavigate('/sheets/pilot')}
                      >
                        Pilot Live Sheet
                      </Menu.Item>
                      <Menu.Item
                        value="crawler-sheet"
                        onSelect={() => handleNavigate('/sheets/crawler')}
                      >
                        Crawler Live Sheet
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </Box>
          </HStack>
        </Flex>

        <Flex
          alignItems="center"
          gap={4}
          display={{ base: isOpen ? 'flex' : 'none', lg: 'flex' }}
          flexDirection={{ base: 'column', lg: 'row' }}
          w={{ base: 'full', lg: 'auto' }}
          ml={{ base: 0, lg: 'auto' }}
        >
          {user && (
            <>
              <NavigationLink
                isActive={isActive('/dashboard/pilots')}
                onClick={() => handleNavigate('/dashboard/pilots')}
              >
                Pilots
              </NavigationLink>

              <NavigationLink
                isActive={isActive('/dashboard/mechs')}
                onClick={() => handleNavigate('/dashboard/mechs')}
              >
                Mechs
              </NavigationLink>

              <NavigationLink
                isActive={isActive('/dashboard/crawlers')}
                onClick={() => handleNavigate('/dashboard/crawlers')}
              >
                Crawlers
              </NavigationLink>

              <NavigationLink
                isActive={isActive('/dashboard/games')}
                onClick={() => handleNavigate('/dashboard/games')}
              >
                Games
              </NavigationLink>
            </>
          )}

          <UserMenu user={user} onSignOut={handleSignOut} signingOut={signingOut} />
        </Flex>
      </Flex>
    </>
  )
}
