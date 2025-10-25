import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Box, Button, Flex, IconButton, Text, VStack } from '@chakra-ui/react'
import type { SchemaInfo } from '../types/schema'
import Footer from './Footer'
import { Heading } from './base/Heading'

interface ReferenceNavigationProps {
  schemas: SchemaInfo[]
}

export default function ReferenceNavigation({ schemas }: ReferenceNavigationProps) {
  const { schemaId } = useParams<{ schemaId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigate = (path: string) => {
    navigate(path)
    setIsOpen(false)
  }

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
            onClick={() => handleNavigate('/reference/')}
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
              Index
            </Text>
          </Button>
          <Button
            onClick={() => handleNavigate('/dashboard')}
            w="full"
            textAlign="center"
            display="block"
            px={4}
            py={3}
            _hover={{ bg: 'su.lightOrange' }}
            bg="transparent"
            borderRadius={0}
            variant="ghost"
            h="auto"
            borderBottomWidth="1px"
            borderBottomColor="su.lightBlue"
          >
            <Text fontWeight="medium" color="su.black">
              Dashboard
            </Text>
          </Button>
          <Box
            px={4}
            py={2}
            borderBottomWidth="1px"
            borderBottomColor="su.lightBlue"
            fontSize="xs"
            fontWeight="semibold"
            color="su.brick"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            Live Sheets
          </Box>
          <VStack as="ul" py={2} gap={0} alignItems="stretch">
            <Box as="li">
              <Button
                onClick={() => handleNavigate('/reference/sheets/mech')}
                w="full"
                textAlign="left"
                display="block"
                px={4}
                py={3}
                _hover={{ bg: 'su.lightOrange' }}
                bg={location.pathname === '/reference/sheets/mech' ? 'su.lightBlue' : 'transparent'}
                borderLeftWidth={location.pathname === '/reference/sheets/mech' ? '4px' : 0}
                borderLeftColor="su.orange"
                color="su.black"
                fontWeight={location.pathname === '/reference/sheets/mech' ? 'medium' : 'normal'}
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
                onClick={() => handleNavigate('/reference/sheets/pilot')}
                w="full"
                textAlign="left"
                display="block"
                px={4}
                py={3}
                _hover={{ bg: 'su.lightOrange' }}
                bg={
                  location.pathname === '/reference/sheets/pilot' ? 'su.lightBlue' : 'transparent'
                }
                borderLeftWidth={location.pathname === '/reference/sheets/pilot' ? '4px' : 0}
                borderLeftColor="su.orange"
                color="su.black"
                fontWeight={location.pathname === '/reference/sheets/pilot' ? 'medium' : 'normal'}
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
                onClick={() => handleNavigate('/reference/sheets/crawler')}
                w="full"
                textAlign="left"
                display="block"
                px={4}
                py={3}
                _hover={{ bg: 'su.lightOrange' }}
                bg={
                  location.pathname === '/reference/sheets/crawler' ? 'su.lightBlue' : 'transparent'
                }
                borderLeftWidth={location.pathname === '/reference/sheets/crawler' ? '4px' : 0}
                borderLeftColor="su.orange"
                color="su.black"
                fontWeight={location.pathname === '/reference/sheets/crawler' ? 'medium' : 'normal'}
                borderRadius={0}
                variant="ghost"
                h="auto"
                justifyContent="flex-start"
              >
                Crawler Live Sheet
              </Button>
            </Box>
            <Box
              px={4}
              py={2}
              borderTopWidth="1px"
              borderTopColor="su.lightBlue"
              fontSize="xs"
              fontWeight="semibold"
              color="su.brick"
              textTransform="uppercase"
              letterSpacing="wider"
              mt={2}
            >
              Schemas
            </Box>
            {schemas.map((schema) => (
              <Box as="li" key={schema.id}>
                <Button
                  onClick={() => handleNavigate(`/reference/schema/${schema.id}`)}
                  w="full"
                  textAlign="left"
                  display="block"
                  px={4}
                  py={3}
                  _hover={{ bg: 'su.lightOrange' }}
                  bg={schemaId === schema.id ? 'su.lightBlue' : 'transparent'}
                  borderLeftWidth={schemaId === schema.id ? '4px' : 0}
                  borderLeftColor="su.orange"
                  color="su.black"
                  fontWeight={schemaId === schema.id ? 'medium' : 'normal'}
                  borderRadius={0}
                  variant="ghost"
                  h="auto"
                  justifyContent="flex-start"
                >
                  <Box>{schema.title.replace('Salvage Union ', '')}</Box>
                </Button>
              </Box>
            ))}
          </VStack>
        </Box>
        <Box mt="auto">
          <Footer />
        </Box>
      </Flex>
    </>
  )
}
