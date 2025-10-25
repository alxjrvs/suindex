import { Box, Flex, Text } from '@chakra-ui/react'
import { ReferenceHeader } from '../shared/ReferenceHeader'
import Footer from '../Footer'
import type { SchemaInfo } from '../../types/schema'
import DataTable from '../DataTable'
import { useSchemaData } from './useSchemaData'
import { useSchemaId } from '../../hooks/useSchemaParams'

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
    <Flex flexDirection="column" minH="100%">
      <ReferenceHeader title={currentSchema.title} textAlign="center">
        <Text color="su.brick" textAlign="center">
          {currentSchema.description}
        </Text>
      </ReferenceHeader>
      <Box flex="1" overflowY="auto">
        <DataTable data={data} schema={currentSchema} />
      </Box>
      <Footer />
    </Flex>
  )
}
