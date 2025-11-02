import { Suspense } from 'react'
import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import type { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import Footer from './Footer'
import type { SchemaInfo } from '../types/schema'
import { getDisplayComponent } from './componentRegistry'
import { useSchemaData } from './schema/useSchemaData'
import { useSchemaParams } from '../hooks/useSchemaParams'

interface ItemShowPageProps {
  schemas: SchemaInfo[]
}

export default function ItemShowPage({ schemas }: ItemShowPageProps) {
  const { schemaId, itemId } = useSchemaParams()
  const { data, loading, error } = useSchemaData(schemaId)
  const [searchParams] = useSearchParams()

  // Read compact query parameter, default to false for full display
  const compact = searchParams.get('compact') === 'true'

  const currentSchema = schemas.find((s) => s.id === schemaId)
  const item = data.find((d) => d.id === itemId)

  const formatValue = (value: unknown): ReactElement => {
    if (value === undefined || value === null) {
      return (
        <Text as="span" color="su.brick" opacity={0.5}>
          -
        </Text>
      )
    }

    if (Array.isArray(value)) {
      return (
        <Box as="ul" listStyleType="square" ml={6}>
          <VStack gap={2} alignItems="stretch">
            {value.map((v, i) => (
              <Box as="li" key={i} pl={2}>
                {formatValue(v)}
              </Box>
            ))}
          </VStack>
        </Box>
      )
    }

    if (typeof value === 'object') {
      return (
        <Box ml={6} borderLeftWidth="2px" borderColor="su.lightBlue" pl={4}>
          <VStack gap={2} alignItems="stretch">
            {Object.entries(value).map(([k, v]) => (
              <Box key={k}>
                <Text as="span" fontWeight="medium" color="su.black">
                  {k}:{' '}
                </Text>
                {formatValue(v)}
              </Box>
            ))}
          </VStack>
        </Box>
      )
    }

    if (typeof value === 'boolean') {
      return (
        <Text as="span" color={value ? 'su.green' : 'su.brick'}>
          {value ? 'Yes' : 'No'}
        </Text>
      )
    }

    return <Text as="span">{String(value)}</Text>
  }

  if (loading) {
    return (
      <Flex alignItems="center" justifyContent="center" h="full">
        <Text fontSize="xl">Loading...</Text>
      </Flex>
    )
  }

  if (error || !currentSchema || !item) {
    return (
      <Flex alignItems="center" justifyContent="center" h="full">
        <Text fontSize="xl" color="red.600">
          Error: {error || 'Item not found'}
        </Text>
      </Flex>
    )
  }

  const renderSpecializedContent = () => {
    if (!schemaId) return null
    const DisplayComponent = getDisplayComponent(schemaId)
    if (!DisplayComponent) return null
    return (
      <Suspense
        fallback={
          <Flex alignItems="center" justifyContent="center" h="full">
            <Text fontSize="xl">Loading component...</Text>
          </Flex>
        }
      >
        <DisplayComponent data={item} compact={compact} />
      </Suspense>
    )
  }

  const specializedContent = renderSpecializedContent()

  return (
    <Flex minH="100vh" flexDirection="column" bg="su.white">
      <Box flex="1" overflowY="auto" p={6}>
        <Box maxW="6xl" mx="auto">
          {specializedContent ? (
            specializedContent
          ) : (
            <Box
              bg="su.white"
              borderRadius="md"
              shadow="lg"
              p={8}
              borderWidth="2px"
              borderColor="su.lightBlue"
            >
              <VStack gap={6} alignItems="stretch">
                {Object.entries(item)
                  .sort(([a], [b]) => {
                    if (a === 'name') return -1
                    if (b === 'name') return 1
                    return a.localeCompare(b)
                  })
                  .map(([key, value]) => (
                    <Box
                      key={key}
                      borderBottomWidth="1px"
                      borderColor="su.lightBlue"
                      pb={6}
                      _last={{ borderBottomWidth: 0 }}
                    >
                      <Text
                        fontWeight="semibold"
                        color="su.black"
                        mb={3}
                        fontSize="lg"
                        textTransform="capitalize"
                      >
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Text>
                      <Box color="su.black" fontSize="base">
                        {formatValue(value)}
                      </Box>
                    </Box>
                  ))}
              </VStack>
            </Box>
          )}
        </Box>
      </Box>
      <Footer />
    </Flex>
  )
}
