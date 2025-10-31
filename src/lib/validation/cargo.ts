/**
 * Zod validation schemas for cargo operations
 * Validates cargo data before database writes
 *
 * HYBRID APPROACH:
 * - Base schemas auto-generated from Supabase types (database-generated.zod.ts)
 * - Extended with custom business logic validation
 */

import { z } from 'zod'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { SURefSchemaName } from 'salvageunion-reference'
import {
  publicCargoInsertSchema,
  publicCargoUpdateSchema,
} from '../../types/database-generated.zod'

/**
 * Valid schema names for cargo items
 * Cargo can reference equipment, systems, or modules
 */
const CARGO_SCHEMA_NAMES = ['equipment', 'systems', 'modules'] as const

/**
 * Schema name validation for cargo
 */
export const cargoSchemaNameSchema = z.enum(CARGO_SCHEMA_NAMES).optional()

/**
 * Cargo creation schema
 * Extends auto-generated schema with business logic validation:
 * 1. Exactly one parent (mech_id or crawler_id) must be set
 * 2. Either amount OR both schema_name and schema_ref_id must be set
 * 3. If schema_ref_id is set, it must exist in salvageunion-reference data
 */
export const createCargoSchema = publicCargoInsertSchema
  .extend({
    // Override schema_name to use our stricter enum
    schema_name: cargoSchemaNameSchema,
    // Override amount to enforce positive integers
    amount: z.number().int().positive().optional().nullable(),
  })
  .refine(
    (data) => {
      // Ensure exactly one parent is set
      const parentCount = [data.mech_id, data.crawler_id].filter(Boolean).length
      return parentCount === 1
    },
    { message: 'Exactly one parent (mech_id or crawler_id) must be set' }
  )
  .refine(
    (data) => {
      // Ensure either amount is set OR both schema_name and schema_ref_id are set
      const hasAmount = data.amount !== undefined && data.amount !== null
      const hasRef = data.schema_name !== undefined && data.schema_ref_id !== undefined
      return hasAmount || hasRef
    },
    { message: 'Either amount or both schema_name and schema_ref_id must be set' }
  )
  .refine(
    (data) => {
      // If schema_name and schema_ref_id are set, validate they exist in reference data
      if (data.schema_name && data.schema_ref_id) {
        return SalvageUnionReference.exists(data.schema_name as SURefSchemaName, data.schema_ref_id)
      }
      return true
    },
    { message: 'Invalid cargo reference - schema_ref_id does not exist in reference data' }
  )

/**
 * Cargo update schema
 * Extends auto-generated schema with stricter amount validation
 */
export const updateCargoSchema = publicCargoUpdateSchema.extend({
  // Override amount to enforce positive integers
  amount: z.number().int().positive().optional().nullable(),
})

/**
 * Type exports for use in API functions
 */
export type CreateCargoInput = z.infer<typeof createCargoSchema>
export type UpdateCargoInput = z.infer<typeof updateCargoSchema>
