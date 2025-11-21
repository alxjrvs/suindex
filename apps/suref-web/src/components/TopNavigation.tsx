import { Box, Button, Flex, IconButton, HStack, Menu, Portal, Text } from '@chakra-ui/react'
import type { User } from '@supabase/supabase-js'
import type { SchemaInfo } from '@/types/schema'
import { Heading } from './base/Heading'
import { useNavigationState } from '@/hooks/useNavigationState'
import { NavigationLink } from './shared/NavigationLink'
import { DiscordSignInButton } from './DiscordSignInButton'

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
        bg="bg.canvas"
        borderBottomWidth="2px"
        borderBottomColor="border.default"
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
            _hover={{ bg: 'bg.hover' }}
            bg="transparent"
            borderRadius="md"
            variant="ghost"
            h="auto"
            p={2}
            color="fg.default"
          >
            <Heading level="h2">Salvage Union</Heading>
            <Text fontSize="xs" color="brand.srd">
              SRD
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
                    _hover={{ bg: 'bg.hover' }}
                    bg={isActive('/schema') ? 'bg.active' : 'transparent'}
                    borderBottomWidth={isActive('/schema') ? '3px' : 0}
                    borderBottomColor="su.orange"
                    color="fg.default"
                    fontWeight={isActive('/schema') ? 'semibold' : 'normal'}
                    borderRadius="md"
                    variant="ghost"
                    h="auto"
                    w={{ base: 'full', lg: 'auto' }}
                  >
                    Reference
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content
                      maxH="300px"
                      minW="200px"
                      overflowY="auto"
                      bg="bg.canvas"
                      borderColor="border.default"
                    >
                      {schemas.map((schema) => (
                        <Menu.Item
                          key={schema.id}
                          value={schema.id}
                          onSelect={() => handleNavigate(`/schema/${schema.id}`)}
                          color="fg.default"
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
                    _hover={{ bg: 'bg.hover' }}
                    bg={isActive('/sheets') ? 'bg.active' : 'transparent'}
                    borderBottomWidth={isActive('/sheets') ? '3px' : 0}
                    borderBottomColor="su.orange"
                    color="fg.default"
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
                    <Menu.Content minW="200px" bg="bg.canvas" borderColor="border.default">
                      <Menu.Item
                        value="mech-sheet"
                        onSelect={() => handleNavigate('/sheets/mech')}
                        color="fg.default"
                      >
                        Mech Live Sheet
                      </Menu.Item>
                      <Menu.Item
                        value="pilot-sheet"
                        onSelect={() => handleNavigate('/sheets/pilot')}
                        color="fg.default"
                      >
                        Pilot Live Sheet
                      </Menu.Item>
                      <Menu.Item
                        value="crawler-sheet"
                        onSelect={() => handleNavigate('/sheets/crawler')}
                        color="fg.default"
                      >
                        Crawler Live Sheet
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </Box>

            <Box as="li">
              <NavigationLink
                isActive={isActive('/randsum')}
                onClick={() => handleNavigate('/randsum')}
              >
                Discord Bot
              </NavigationLink>
            </Box>

            <Box as="li">
              <NavigationLink
                isActive={isActive('/about')}
                onClick={() => handleNavigate('/about')}
              >
                About
              </NavigationLink>
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
          {user ? (
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button
                  px={4}
                  py={2}
                  fontSize="sm"
                  color="fg.default"
                  fontWeight="medium"
                  bg="transparent"
                  _hover={{ bg: 'bg.hover' }}
                  borderRadius="md"
                  variant="ghost"
                  h="auto"
                  w={{ base: 'full', lg: 'auto' }}
                >
                  {user.user_metadata?.preferred_username ||
                    user.user_metadata?.full_name ||
                    user.email?.split('@')[0] ||
                    'User'}
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content minW="200px" bg="bg.canvas" borderColor="border.default">
                    <Menu.Item
                      value="pilots"
                      onSelect={() => handleNavigate('/dashboard/pilots')}
                      color="fg.default"
                    >
                      Pilots
                    </Menu.Item>
                    <Menu.Item
                      value="mechs"
                      onSelect={() => handleNavigate('/dashboard/mechs')}
                      color="fg.default"
                    >
                      Mechs
                    </Menu.Item>
                    <Menu.Item
                      value="crawlers"
                      onSelect={() => handleNavigate('/dashboard/crawlers')}
                      color="fg.default"
                    >
                      Crawlers
                    </Menu.Item>
                    <Menu.Item
                      value="games"
                      onSelect={() => handleNavigate('/dashboard/games')}
                      color="fg.default"
                    >
                      Games
                    </Menu.Item>
                    <Menu.Separator />
                    <Menu.Item
                      value="signout"
                      onSelect={handleSignOut}
                      disabled={signingOut}
                      color="brand.srd"
                    >
                      {signingOut ? 'Signing out...' : 'Sign out'}
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
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
