import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, Button, Flex, IconButton, Text, VStack } from '@chakra-ui/react'
import { Heading } from './base/Heading'
import Footer from './Footer'

export default function LiveSheetNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigate = (path: string) => {
    navigate(path)
    setIsOpen(false)
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
            <Heading level="h1">Salvage Union</Heading>
            <Text fontSize="sm" color="su.brick">
              Live Sheets
            </Text>
          </Button>
          <VStack as="ul" py={2} gap={0} alignItems="stretch">
            <Box as="li">
              <Button
                onClick={() => handleNavigate('/playground/mech-builder')}
                w="full"
                textAlign="left"
                display="block"
                px={4}
                py={3}
                _hover={{ bg: 'su.lightOrange' }}
                bg={isActive('/playground/mech-builder') ? 'su.lightBlue' : 'transparent'}
                borderLeftWidth={isActive('/playground/mech-builder') ? '4px' : 0}
                borderLeftColor="su.orange"
                color="su.black"
                fontWeight={isActive('/playground/mech-builder') ? 'medium' : 'normal'}
                borderRadius={0}
                variant="ghost"
                h="auto"
                justifyContent="flex-start"
              >
                Mech Live Sheet
              </Button>
            </Box>
            <Box as="li">
              <Button
                onClick={() => handleNavigate('/playground/pilot-builder')}
                w="full"
                textAlign="left"
                display="block"
                px={4}
                py={3}
                _hover={{ bg: 'su.lightOrange' }}
                bg={isActive('/playground/pilot-builder') ? 'su.lightBlue' : 'transparent'}
                borderLeftWidth={isActive('/playground/pilot-builder') ? '4px' : 0}
                borderLeftColor="su.orange"
                color="su.black"
                fontWeight={isActive('/playground/pilot-builder') ? 'medium' : 'normal'}
                borderRadius={0}
                variant="ghost"
                h="auto"
                justifyContent="flex-start"
              >
                Pilot Live Sheet
              </Button>
            </Box>
            <Box as="li">
              <Button
                onClick={() => handleNavigate('/playground/crawler-builder')}
                w="full"
                textAlign="left"
                display="block"
                px={4}
                py={3}
                _hover={{ bg: 'su.lightOrange' }}
                bg={isActive('/playground/crawler-builder') ? 'su.lightBlue' : 'transparent'}
                borderLeftWidth={isActive('/playground/crawler-builder') ? '4px' : 0}
                borderLeftColor="su.orange"
                color="su.black"
                fontWeight={isActive('/playground/crawler-builder') ? 'medium' : 'normal'}
                borderRadius={0}
                variant="ghost"
                h="auto"
                justifyContent="flex-start"
              >
                Crawler Live Sheet
              </Button>
            </Box>
          </VStack>
        </Box>
        <Box mt="auto">
          <Footer />
        </Box>
      </Flex>
    </>
  )
}
