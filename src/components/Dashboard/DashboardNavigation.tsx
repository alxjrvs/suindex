import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, Button, Flex, Heading, IconButton, Text, VStack } from '@chakra-ui/react'
import { supabase } from '../../lib/supabase'
import Footer from '../Footer'
import type { User } from '@supabase/supabase-js'

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
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        position="fixed"
        top={4}
        left={4}
        zIndex={50}
        display={{ base: 'flex', md: 'none' }}
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

      {isOpen && (
        <Box
          position="fixed"
          inset={0}
          bg="blackAlpha.500"
          zIndex={30}
          display={{ base: 'block', md: 'none' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      <Flex
        as="nav"
        position={{ base: 'fixed', md: 'static' }}
        top={0}
        left={0}
        h="100vh"
        w="64"
        bg="su.white"
        shadow="lg"
        overflowY="auto"
        borderRightWidth="1px"
        borderRightColor="su.lightBlue"
        zIndex={40}
        transform={{
          base: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          md: 'translateX(0)',
        }}
        transition="transform 0.3s ease-in-out"
        flexDirection="column"
      >
        <Box flex="1">
          <Button
            onClick={() => handleNavigate('/')}
            w="full"
            textAlign="left"
            display="block"
            p={4}
            borderBottomWidth="1px"
            borderBottomColor="su.lightBlue"
            _hover={{ bg: 'su.lightOrange' }}
            bg="transparent"
            borderRadius={0}
            variant="ghost"
            h="auto"
          >
            <Heading as="h1" fontSize="xl" fontWeight="bold" color="su.black">
              Salvage Union
            </Heading>
            <Text fontSize="sm" color="su.brick">
              Dashboard
            </Text>
          </Button>

          <VStack as="ul" py={2} gap={0} alignItems="stretch">
            <Box as="li">
              <Button
                onClick={() => handleNavigate('/dashboard')}
                w="full"
                textAlign="left"
                display="block"
                px={4}
                py={3}
                _hover={{ bg: 'su.lightOrange' }}
                bg={isActive('/dashboard') ? 'su.lightBlue' : 'transparent'}
                borderLeftWidth={isActive('/dashboard') ? '4px' : 0}
                borderLeftColor="su.orange"
                color="su.black"
                fontWeight={isActive('/dashboard') ? 'medium' : 'normal'}
                borderRadius={0}
                variant="ghost"
                h="auto"
                justifyContent="flex-start"
              >
                Overview
              </Button>
            </Box>
            <Box as="li">
              <Button
                onClick={() => handleNavigate('/dashboard/games')}
                w="full"
                textAlign="left"
                display="block"
                px={4}
                py={3}
                _hover={{ bg: 'su.lightOrange' }}
                bg={isActive('/dashboard/games') ? 'su.lightBlue' : 'transparent'}
                borderLeftWidth={isActive('/dashboard/games') ? '4px' : 0}
                borderLeftColor="su.orange"
                color="su.black"
                fontWeight={isActive('/dashboard/games') ? 'medium' : 'normal'}
                borderRadius={0}
                variant="ghost"
                h="auto"
                justifyContent="flex-start"
              >
                Games
              </Button>
            </Box>
            <Box as="li">
              <Button
                onClick={() => handleNavigate('/dashboard/crawlers')}
                w="full"
                textAlign="left"
                display="block"
                px={4}
                py={3}
                _hover={{ bg: 'su.lightOrange' }}
                bg={isActive('/dashboard/crawlers') ? 'su.lightBlue' : 'transparent'}
                borderLeftWidth={isActive('/dashboard/crawlers') ? '4px' : 0}
                borderLeftColor="su.orange"
                color="su.black"
                fontWeight={isActive('/dashboard/crawlers') ? 'medium' : 'normal'}
                borderRadius={0}
                variant="ghost"
                h="auto"
                justifyContent="flex-start"
              >
                Crawlers
              </Button>
            </Box>
            <Box as="li">
              <Button
                onClick={() => handleNavigate('/dashboard/pilots')}
                w="full"
                textAlign="left"
                display="block"
                px={4}
                py={3}
                _hover={{ bg: 'su.lightOrange' }}
                bg={isActive('/dashboard/pilots') ? 'su.lightBlue' : 'transparent'}
                borderLeftWidth={isActive('/dashboard/pilots') ? '4px' : 0}
                borderLeftColor="su.orange"
                color="su.black"
                fontWeight={isActive('/dashboard/pilots') ? 'medium' : 'normal'}
                borderRadius={0}
                variant="ghost"
                h="auto"
                justifyContent="flex-start"
              >
                Pilots
              </Button>
            </Box>
            <Box as="li">
              <Button
                onClick={() => handleNavigate('/dashboard/mechs')}
                w="full"
                textAlign="left"
                display="block"
                px={4}
                py={3}
                _hover={{ bg: 'su.lightOrange' }}
                bg={isActive('/dashboard/mechs') ? 'su.lightBlue' : 'transparent'}
                borderLeftWidth={isActive('/dashboard/mechs') ? '4px' : 0}
                borderLeftColor="su.orange"
                color="su.black"
                fontWeight={isActive('/dashboard/mechs') ? 'medium' : 'normal'}
                borderRadius={0}
                variant="ghost"
                h="auto"
                justifyContent="flex-start"
              >
                Mechs
              </Button>
            </Box>
          </VStack>
        </Box>
        <Box mt="auto">
          {/* User Info & Sign Out */}
          <Box p={4} borderTopWidth="1px" borderTopColor="su.lightBlue" bg="su.lightOrange">
            <Text fontSize="sm" color="su.black" fontWeight="medium" mb={2}>
              {user.user_metadata?.full_name || user.email || 'User'}
            </Text>
            <Button
              onClick={handleSignOut}
              disabled={signingOut}
              w="full"
              textAlign="left"
              fontSize="sm"
              color="su.brick"
              _hover={{ color: 'su.orange' }}
              _disabled={{ opacity: 0.5 }}
              bg="transparent"
              variant="ghost"
              h="auto"
              p={0}
              justifyContent="flex-start"
            >
              {signingOut ? 'Signing out...' : 'Sign Out'}
            </Button>
          </Box>
          <Footer variant="nav" />
        </Box>
      </Flex>
    </>
  )
}
