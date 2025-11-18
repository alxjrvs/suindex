/**
 * Shared utilities for code generators
 * Reduces duplication across generator scripts
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Schema index entry structure
 */
export interface SchemaIndexEntry {
  id: string
  title: string
  description: string
  dataFile: string
  schemaFile: string
  itemCount: number
  requiredFields: string[]
  displayName: string
}

/**
 * Schema index structure
 */
export interface SchemaIndex {
  $schema: string
  title: string
  description: string
  version: string
  generated: string
  schemas: SchemaIndexEntry[]
}

/**
 * Get __dirname equivalent for ES modules
 */
export function getDirname(importMetaUrl: string): string {
  const __filename = fileURLToPath(importMetaUrl)
  return path.dirname(__filename)
}

/**
 * Load and parse the schema index
 */
export function loadSchemaIndex(dirname: string): SchemaIndex {
  const schemaIndexPath = path.join(dirname, '../schemas/index.json')
  return JSON.parse(fs.readFileSync(schemaIndexPath, 'utf-8')) as SchemaIndex
}

/**
 * Generate schema name map from schema index
 * Derives singular type names from display names
 */
export function generateSchemaNameMap(schemaIndex: SchemaIndex): Record<string, string> {
  const map: Record<string, string> = {}

  for (const schema of schemaIndex.schemas) {
    const displayName = schema.displayName

    // Split by spaces and hyphens first, then singularize each word
    const pascalCase = displayName
      .split(/[\s-]/)
      .map((word) => {
        // Singularize each word
        let singular = word

        // Handle special cases first (before generic plural handling)
        if (word === 'Abilities') singular = 'Ability'
        else if (word === 'Chassis')
          singular = 'Chassis' // Already singular, don't remove 's'
        else if (word === 'Equipment')
          singular = 'Equipment' // Already singular
        else if (word === 'Meld')
          singular = 'Meld' // Already singular
        else if (word === 'Distances') singular = 'Distance'
        else if (word === 'Classes')
          singular = 'Class' // Classes -> Class
        else if (word.endsWith('ies')) {
          // Abilities -> Ability
          singular = word.slice(0, -3) + 'y'
        } else if (word.endsWith('s') && word !== 'Chassis' && word !== 'chassis') {
          // Remove trailing 's' for most plurals, but not for "Chassis" (case-insensitive check)
          singular = word.slice(0, -1)
        }

        // Capitalize first letter
        return singular.charAt(0).toUpperCase() + singular.slice(1)
      })
      .join('')

    map[schema.id] = pascalCase
  }

  return map
}

/**
 * Get singular type name from schema ID
 * Generates the map from schema index on first call
 */
let cachedSchemaNameMap: Record<string, string> | null = null

export function getSingularTypeName(schemaId: string, dirname?: string): string {
  if (!cachedSchemaNameMap) {
    const dir = dirname || getDirname(import.meta.url)
    const schemaIndex = loadSchemaIndex(dir)
    cachedSchemaNameMap = generateSchemaNameMap(schemaIndex)
  }

  return cachedSchemaNameMap[schemaId] || schemaId
}

/**
 * Convert schema ID to PascalCase for model property names
 * Handles special cases for classes and NPCs
 */
export function toPascalCase(id: string): string {
  // Handle special cases for classes
  if (id === 'classes.core') return 'CoreClasses'
  if (id === 'classes.advanced') return 'AdvancedClasses'

  // Handle special case for NPCs (all caps)
  if (id === 'npcs') return 'NPCs'

  // Handle hyphenated and dotted names
  return id
    .split(/[-.]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
