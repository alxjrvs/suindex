import { VStack, Box } from '@chakra-ui/react'
import type { SURefMetaGrant, SURefSchemaName, SURefEntity } from 'salvageunion-reference'
import { getGrants, getModel } from 'salvageunion-reference'
import { EntityDisplay } from './index'
import { EntitySubheader } from './EntitySubheader'
import { useEntityDisplayContext } from './useEntityDisplayContext'

export function EntityGrants() {
  const { data, spacing } = useEntityDisplayContext()

  // Get grants from entity
  const entityGrants = getGrants(data) || []

  if (entityGrants.length === 0) {
    return null
  }

  // Resolve granted entities
  const grantedEntities = entityGrants
    .map((grant: SURefMetaGrant) => {
      // Skip 'choice' schema grants as they're handled separately
      if (grant.schema === 'choice') {
        return null
      }

      const schema = grant.schema as SURefSchemaName
      const model = getModel(schema.toLowerCase())
      if (!model) return null

      const entity = model.find((e: SURefEntity) => e.name === grant.name)
      return entity ? { entity, schemaName: schema } : null
    })
    .filter((item): item is { entity: SURefEntity; schemaName: SURefSchemaName } => item !== null)

  if (grantedEntities.length === 0) {
    return null
  }

  return (
    <VStack gap={spacing.smallGap} alignItems="stretch" px="2">
      <Box mb={spacing.minimalGap}>
        <EntitySubheader disabled={true} label="Grants:" />
      </Box>
      <VStack gap={spacing.contentPadding} alignItems="start">
        {grantedEntities.map(({ entity, schemaName }, idx) => (
          <EntityDisplay
            key={idx}
            hideActions
            data={entity}
            schemaName={schemaName}
            compact
            collapsible
            defaultExpanded={false}
          />
        ))}
      </VStack>
    </VStack>
  )
}
