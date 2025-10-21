import type { ReactNode } from 'react'
import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { DataList } from './DataList'
import type { DataValue } from '../../types/common'
import { techLevelColors } from '../../theme'

interface FrameProps {
  header: string
  headerColor?: string
  headerContent?: ReactNode
  level?: string | number
  techLevel?: number
  details?: DataValue[]
  description?: string
  notes?: string
  children?: ReactNode
  showSidebar?: boolean
  slotsRequired?: number
  salvageValue?: number
}

export function Frame({
  header,
  headerColor,
  headerContent,
  level,
  techLevel,
  details,
  description,
  notes,
  children,
  showSidebar = true,
  slotsRequired,
  salvageValue,
}: FrameProps) {
  const backgroundColor = headerColor || (techLevel ? techLevelColors[techLevel] : 'su.orange')

  return (
    <Box bg="su.lightBlue" w="full" borderRadius="lg" shadow="lg" overflow="visible">
      <Box p={3} zIndex={10} bg={backgroundColor} overflow="visible">
        <Flex alignItems="flex-start" gap={3} overflow="visible">
          {level && (
            <Flex alignItems="center" justifyContent="center" minW="35px" maxW="35px">
              <Text color="su.white" fontSize="2xl" fontWeight="bold">
                {level}
              </Text>
            </Flex>
          )}
          <Box flex="1" overflow="visible">
            <Flex justifyContent="space-between" alignItems="flex-start" overflow="visible">
              {header && (
                <Heading
                  as="h3"
                  fontSize="2xl"
                  fontWeight="bold"
                  color="su.white"
                  maxW="80%"
                  flexWrap="wrap"
                >
                  {header}
                </Heading>
              )}
              {headerContent}
            </Flex>
            <Box minH="15px" mt={1}>
              <DataList textColor="su.white" values={details || []} />
            </Box>
          </Box>
        </Flex>
      </Box>

      <Flex bg={backgroundColor}>
        {showSidebar && (techLevel || slotsRequired || salvageValue) && (
          <VStack
            alignItems="center"
            justifyContent="flex-start"
            pb={1}
            gap={1}
            minW="35px"
            maxW="35px"
            bg={backgroundColor}
            overflow="visible"
          >
            {techLevel && (
              <Flex
                bg="su.black"
                borderWidth="1px"
                borderColor="su.black"
                color="su.white"
                fontWeight="bold"
                textAlign="center"
                alignItems="center"
                justifyContent="center"
                minW="25px"
                h="25px"
                borderRadius="5px"
                pt="2px"
                title="Tech level"
              >
                T{techLevel}
              </Flex>
            )}
            {slotsRequired && (
              <Box position="relative" w="30px" h="25px" title="Slots">
                <Box
                  position="absolute"
                  w={0}
                  h={0}
                  borderLeft="15px solid transparent"
                  borderRight="15px solid transparent"
                  borderBottom="25px solid"
                  borderBottomColor="su.black"
                  top="-2px"
                  left={0}
                />
                <Flex
                  position="absolute"
                  color="su.white"
                  fontWeight="bold"
                  textAlign="center"
                  alignItems="center"
                  justifyContent="center"
                  w="30px"
                  top="4px"
                >
                  {slotsRequired}
                </Flex>
              </Box>
            )}
            {salvageValue && (
              <Flex
                bg="su.black"
                color="su.white"
                fontWeight="bold"
                textAlign="center"
                alignItems="center"
                justifyContent="center"
                w="25px"
                h="25px"
                borderRadius="30px"
                pt="4px"
                title="Salvage value"
              >
                {salvageValue}
              </Flex>
            )}
          </VStack>
        )}

        <VStack flex="1" bg="su.lightBlue" p={3} gap={6} alignItems="stretch">
          {description && (
            <Text color="su.black" fontWeight="medium" lineHeight="relaxed">
              {description}
            </Text>
          )}

          {children}

          {notes && (
            <Box borderWidth="1px" borderColor="su.black" p={3} borderRadius="md" bg="su.white">
              <Text color="su.black">{notes}</Text>
            </Box>
          )}
        </VStack>
      </Flex>
    </Box>
  )
}
