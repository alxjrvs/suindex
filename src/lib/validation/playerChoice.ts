/**
 * Zod validation schemas for player choice operations
 * Validates player choice data before database writes
 *
 * HYBRID APPROACH:
 * - Base schemas auto-generated from Supabase types (database-generated.zod.ts)
 * - Extended with custom business logic validation (currently none needed)
 */

import { z } from 'zod'
import { publicPlayerChoicesInsertSchema } from '../../types/database-generated.zod'

/**
 * Player choice creation/upsert schema
 * Uses auto-generated schema directly (no additional validation needed)
 */
export const upsertPlayerChoiceSchema = publicPlayerChoicesInsertSchema

/**
 * Type exports for use in API functions
 */
export type UpsertPlayerChoiceInput = z.infer<typeof upsertPlayerChoiceSchema>
