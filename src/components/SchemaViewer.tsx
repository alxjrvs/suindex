import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import type { SchemaInfo } from '../types/schema'
import DataTable from './DataTable'
import { useSchemaData } from '../hooks/useSchemaData'
import { useSchemaId } from '../hooks/useSchemaParams'

interface SchemaViewerProps {
  schemas: SchemaInfo[]
}

export default function SchemaViewer({ schemas }: SchemaViewerProps) {
  const schemaId = useSchemaId()
  const { data, loading, error } = useSchemaData(schemaId)

  const currentSchema = schemas.find((s) => s.id === schemaId)

  if (loading) {
    return (
      <Flex alignItems="center" justifyContent="center" h="full">
        <Text fontSize="xl">Loading data...</Text>
      </Flex>
    )
  }

  if (error || !currentSchema) {
    return (
      <Flex alignItems="center" justifyContent="center" h="full">
        <Text fontSize="xl" color="red.600">
          Error: {error || 'Schema not found'}
        </Text>
      </Flex>
    )
  }

  return (
    <Flex h="full" flexDirection="column">
      <Box bg="su.white" shadow="sm" borderBottomWidth="1px" borderColor="su.lightBlue" p={6}>
        <Heading as="h2" fontSize="2xl" fontWeight="bold" color="su.black">
          {currentSchema.title}
        </Heading>
        <Text color="su.brick" mt={1}>
          {currentSchema.description}
        </Text>
      </Box>
      <Box flex="1" overflowY="auto">
        <DataTable data={data} schema={currentSchema} />
      </Box>
    </Flex>
  )
}
