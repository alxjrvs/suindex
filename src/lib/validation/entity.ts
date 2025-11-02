/**
 * Zod validation schemas for entity operations
 * Validates entity data before database writes
 *
 * HYBRID APPROACH:
 * - Base schemas auto-generated from Supabase types (database-generated.zod.ts)
 * - Extended with custom business logic validation
 */

import { z } from 'zod'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefSchemaName } from 'salvageunion-reference'
import {
  publicSuentitiesInsertSchema,
  publicSuentitiesUpdateSchema,
} from '../../types/database-generated.zod'

/**
 * Valid schema names for entities
 * These are the schemas that can be stored as entities in the database
 */
const ENTITY_SCHEMA_NAMES = [
  'abilities',
  'equipment',
  'systems',
  'modules',
  'crawler-bays',
  'classes.core',
  'classes.advanced',
  'classes.hybrid',
  'chassis',
  'crawlers',
] as const

/**
 * Schema name validation
 * Ensures the schema name is one of the valid entity schema names
 */
export const entitySchemaNameSchema = z.enum(ENTITY_SCHEMA_NAMES)

/**
 * Entity creation schema
 * Extends auto-generated schema with business logic validation:
 * 1. Exactly one parent (pilot_id, mech_id, or crawler_id) must be set
 * 2. schema_ref_id must exist in salvageunion-reference data
 */
export const createEntitySchema = publicSuentitiesInsertSchema
  .extend({
    // Override schema_name to use our stricter enum
    schema_name: entitySchemaNameSchema,
  })
  .refine(
    (data) => {
      // Ensure exactly one parent is set
      const parentCount = [data.pilot_id, data.mech_id, data.crawler_id].filter(Boolean).length
      return parentCount === 1
    },
    { message: 'Exactly one parent (pilot_id, mech_id, or crawler_id) must be set' }
  )
  .refine(
    (data) => {
      // Validate that schema_ref_id exists in reference data
      return SalvageUnionReference.exists(data.schema_name as SURefSchemaName, data.schema_ref_id)
    },
    { message: 'Invalid entity reference - schema_ref_id does not exist in reference data' }
  )

/**
 * Entity update schema
 * Extends auto-generated schema (no additional validation needed for updates)
 */
export const updateEntitySchema = publicSuentitiesUpdateSchema

/**
 * Type exports for use in API functions
 */
export type CreateEntityInput = z.infer<typeof createEntitySchema>
export type UpdateEntityInput = z.infer<typeof updateEntitySchema>
