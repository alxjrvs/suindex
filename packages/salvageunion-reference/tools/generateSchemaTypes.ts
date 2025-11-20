/**
 * Generate TypeScript schema types from individual schema files
 *
 * This generator creates TypeScript type definitions for each schema (abilities, chassis, etc.)
 * by reading the schema files and generating types based on their structure. It recognizes and
 * imports refs from enums, common, and objects types.
 */

import * as fs from 'fs'
import * as path from 'path'
import { getSingularTypeName, getDirname, loadSchemaIndex } from './generatorUtils.js'
import { loadSchema, getTypeAliases, type JSONSchema } from './schemaAnalysis.js'

const __dirname = getDirname(import.meta.url)

const OUTPUT_FILE = path.join(__dirname, '../lib/types/schemas.ts')

/**
 * Capitalize first letter of a string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert snake_case or kebab-case to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split(/[-_.]/)
    .map((part) => capitalize(part))
    .join('')
}

interface ImportTracker {
  enums: Set<string>
  common: Set<string>
  objects: Set<string>
}

const imports: ImportTracker = {
  enums: new Set(),
  common: new Set(),
  objects: new Set(),
}

/**
 * Extract type name from a $ref string
 */
function extractRefType(
  ref: string
): { source: 'enum' | 'common' | 'object'; typeName: string } | null {
  if (ref.includes('enums.schema.json#/definitions/')) {
    const defName = ref.split('/').pop()!
    const typeName = `SURefEnum${capitalize(defName)}`
    imports.enums.add(typeName)
    return { source: 'enum', typeName }
  }

  if (ref.includes('common.schema.json#/definitions/')) {
    const defName = ref.split('/').pop()!
    const typeName = `SURefCommon${toPascalCase(defName)}`
    imports.common.add(typeName)
    return { source: 'common', typeName }
  }

  if (ref.includes('objects.schema.json#/definitions/')) {
    const defName = ref.split('/').pop()!
    const typeName = `SURefObject${capitalize(defName)}`
    imports.objects.add(typeName)
    return { source: 'object', typeName }
  }

  if (ref.includes('arrays.schema.json#/definitions/')) {
    const defName = ref.split('/').pop()!
    const typeName = `SURefObject${capitalize(defName)}`
    imports.objects.add(typeName)
    return { source: 'object', typeName }
  }

  return null
}

/**
 * Generate TypeScript type from schema property
 */
function generatePropertyType(schema: JSONSchema): string {
  // Handle $ref
  if (schema.$ref) {
    const refType = extractRefType(schema.$ref)
    if (refType) {
      return refType.typeName
    }
  }

  // Handle oneOf (union types)
  if (schema.oneOf) {
    const types = schema.oneOf.map((s) => generatePropertyType(s)).filter((t) => t)
    if (types.length === 0) return 'unknown'
    return types.length > 1 ? `(${types.join(' | ')})` : types[0]
  }

  // Handle arrays
  if (schema.type === 'array' && schema.items) {
    const itemType = generatePropertyType(schema.items)
    return `${itemType}[]`
  }

  // Handle simple types
  if (schema.type === 'string') {
    if (schema.const !== undefined) {
      return `'${schema.const}'`
    }
    if (schema.enum) {
      return schema.enum.map((v) => `'${v}'`).join(' | ')
    }
    return 'string'
  }

  if (schema.type === 'integer' || schema.type === 'number') {
    if (schema.const !== undefined) {
      return `${schema.const}`
    }
    return 'number'
  }

  if (schema.type === 'boolean') {
    return 'boolean'
  }

  if (schema.type === 'object') {
    return 'object'
  }

  return 'unknown'
}

/**
 * Check if a property name needs to be quoted
 */
function needsQuoting(propName: string): boolean {
  return /[^a-zA-Z0-9_$]/.test(propName) || /^[0-9]/.test(propName)
}

/**
 * Format property name for TypeScript (quote if needed)
 */
function formatPropertyName(propName: string): string {
  return needsQuoting(propName) ? `'${propName}'` : propName
}

/**
 * Generate interface properties
 */
function generateProperties(
  properties: Record<string, JSONSchema>,
  required: string[] = [],
  indent: string = '  '
): string[] {
  const lines: string[] = []

  for (const [propName, propSchema] of Object.entries(properties)) {
    // Skip properties with value `true` - they're inherited from base types
    if (typeof propSchema === 'boolean' && propSchema === true) {
      continue
    }

    const isRequired = required.includes(propName)
    const optional = isRequired ? '' : '?'
    const formattedName = formatPropertyName(propName)

    // Add description if available
    if (propSchema.description) {
      lines.push(`${indent}/**`)
      lines.push(`${indent} * ${propSchema.description}`)
      lines.push(`${indent} */`)
    }

    const propType = generatePropertyType(propSchema)
    lines.push(`${indent}${formattedName}${optional}: ${propType}`)
  }

  return lines
}

/**
 * Generate inline type for a schema (used in oneOf unions)
 */
function generateInlineType(schema: JSONSchema): string | null {
  const baseTypes: string[] = []
  let ownProperties = schema.properties || {}
  let ownRequired = schema.required || []

  // Collect base types from allOf
  if (schema.allOf) {
    for (const subSchema of schema.allOf) {
      if (subSchema.$ref) {
        const refType = extractRefType(subSchema.$ref)
        if (refType) {
          baseTypes.push(refType.typeName)
        }
      } else if (subSchema.properties) {
        // Merge properties from allOf
        ownProperties = { ...ownProperties, ...subSchema.properties }
        if (subSchema.required) {
          ownRequired = [...ownRequired, ...subSchema.required]
        }
      }
    }
  }

  // If we have base types and no own properties, use type alias
  if (baseTypes.length > 0 && Object.keys(ownProperties).length === 0) {
    return baseTypes.length === 1 ? baseTypes[0] : `(${baseTypes.join(' & ')})`
  }

  // Generate inline type
  const typeParts: string[] = []
  if (baseTypes.length > 0) {
    typeParts.push(baseTypes.join(' & '))
  }
  if (Object.keys(ownProperties).length > 0) {
    const props = generateProperties(ownProperties, ownRequired, '  ')
    if (props.length > 0) {
      typeParts.push(`{\n${props.join('\n')}\n}`)
    }
  }

  return typeParts.length > 0 ? typeParts.join(' & ') : null
}

/**
 * Generate TypeScript type from schema items definition
 */
function generateSchemaType(
  schemaId: string,
  schema: JSONSchema,
  isMeta: boolean = false
): string | null {
  // Use getSingularTypeName for consistent singular naming
  const singularName = getSingularTypeName(schemaId, __dirname)
  if (!singularName) {
    console.warn(`⚠️  No mapping found for schema: ${schemaId}`)
    return null
  }
  // Use SURefMeta prefix for meta schemas
  const typeName = isMeta ? `SURefMeta${singularName}` : `SURef${singularName}`
  const lines: string[] = []

  // Schema should be type: "array" with items
  if (schema.type !== 'array' || !schema.items) {
    console.warn(`⚠️  Skipping ${schemaId}: not an array schema`)
    return null
  }

  const itemSchema = schema.items

  if (schema.description) {
    lines.push('/**')
    lines.push(` * ${schema.description}`)
    lines.push(' */')
  }

  // Handle oneOf (union types) in items schema
  if (itemSchema.oneOf) {
    const unionTypes: string[] = []
    for (const subSchema of itemSchema.oneOf) {
      if (subSchema.$ref) {
        const refType = extractRefType(subSchema.$ref)
        if (refType) {
          unionTypes.push(refType.typeName)
        }
      } else if (subSchema.allOf || subSchema.properties) {
        // Generate inline type for complex schemas
        const inlineType = generateInlineType(subSchema)
        if (inlineType) {
          unionTypes.push(inlineType)
        }
      }
    }
    if (unionTypes.length > 0) {
      lines.push(`export type ${typeName} =`)
      lines.push(`  | ${unionTypes.join('\n  | ')}`)
      return lines.join('\n')
    }
  }

  // If items is just a $ref, use it as a type alias
  if (itemSchema.$ref && !itemSchema.allOf && !itemSchema.properties && !itemSchema.oneOf) {
    const refType = extractRefType(itemSchema.$ref)
    if (refType) {
      // If the type name matches the referenced type exactly, skip generating it (it's already defined)
      if (typeName === refType.typeName) {
        return null
      }
      lines.push(`export type ${typeName} = ${refType.typeName}`)
      return lines.join('\n')
    }
  }

  // Collect base types from allOf
  const baseTypes: string[] = []
  let ownProperties = itemSchema.properties || {}
  let ownRequired = itemSchema.required || []

  if (itemSchema.allOf) {
    for (const subSchema of itemSchema.allOf) {
      if (subSchema.$ref) {
        const refType = extractRefType(subSchema.$ref)
        if (refType) {
          baseTypes.push(refType.typeName)
        }
      } else if (subSchema.properties) {
        // Merge properties from allOf
        ownProperties = { ...ownProperties, ...subSchema.properties }
        if (subSchema.required) {
          ownRequired = [...ownRequired, ...subSchema.required]
        }
      }
    }
  }

  // If we have base types and no own properties, use type alias instead of empty interface
  if (baseTypes.length > 0 && Object.keys(ownProperties).length === 0) {
    // If the type name matches the base type exactly, skip generating it (it's already defined)
    if (baseTypes.length === 1 && typeName === baseTypes[0]) {
      return null
    }
    if (baseTypes.length === 1) {
      lines.push(`export type ${typeName} = ${baseTypes[0]}`)
    } else {
      lines.push(`export type ${typeName} = ${baseTypes.join(' & ')}`)
    }
    return lines.join('\n')
  }

  // Generate interface (only if we have own properties or no base types)
  if (baseTypes.length > 0) {
    lines.push(`export interface ${typeName} extends ${baseTypes.join(', ')} {`)
  } else {
    lines.push(`export interface ${typeName} {`)
  }

  if (Object.keys(ownProperties).length > 0) {
    const props = generateProperties(ownProperties, ownRequired)
    lines.push(...props)
  }

  lines.push('}')

  return lines.join('\n')
}

async function generateSchemaTypes() {
  console.log('🔧 Generating TypeScript schema types from schema files...\n')

  // Read schema index
  const schemaIndex = loadSchemaIndex(__dirname)
  const schemas = schemaIndex.schemas || []
  const typeAliases = getTypeAliases(schemaIndex)

  const typeDefinitions: string[] = []

  // Header
  typeDefinitions.push('/**')
  typeDefinitions.push(' * Auto-generated TypeScript schema types')
  typeDefinitions.push(' * DO NOT EDIT MANUALLY')
  typeDefinitions.push(' * Generated by tools/generateSchemaTypes.ts')
  typeDefinitions.push(' */')
  typeDefinitions.push('')

  // Placeholder for imports
  const importsPlaceholder = typeDefinitions.length
  typeDefinitions.push('') // Will be replaced with imports

  // Generate types for each schema
  console.log('📋 Generating schema types...')
  for (const schemaEntry of schemas) {
    // Handle type aliases from schema metadata
    if (typeAliases.has(schemaEntry.id)) {
      const aliasType = typeAliases.get(schemaEntry.id)!
      // For actions, the base type is SURefObjectAction (from objects.ts)
      // The alias type is SURefMetaAction (the meta schema type)
      const baseType = aliasType.replace('SURefMeta', 'SURefObject')
      typeDefinitions.push('/**')
      typeDefinitions.push(` * ${schemaEntry.description || schemaEntry.title}`)
      typeDefinitions.push(
        ` * Note: ${baseType} is defined in objects.ts, this is just an alias for convenience`
      )
      typeDefinitions.push(' */')
      typeDefinitions.push(`export type ${aliasType} = ${baseType}`)
      typeDefinitions.push('')
      console.log(`   ✓ ${schemaEntry.id} (meta - alias)`)
      continue
    }

    const schema = loadSchema(schemaEntry.schemaFile)
    const isMeta = schemaEntry.meta === true

    const typeCode = generateSchemaType(schemaEntry.id, schema, isMeta)
    if (typeCode) {
      typeDefinitions.push(typeCode)
      typeDefinitions.push('')
      console.log(`   ✓ ${schemaEntry.id}${isMeta ? ' (meta)' : ''}`)
    } else {
      // Type was skipped because it's already defined elsewhere (e.g., in objects.ts)
      console.log(
        `   ⊘ ${schemaEntry.id}${isMeta ? ' (meta - skipped, already defined)' : ' (skipped, already defined)'}`
      )
    }
  }

  // Generate imports based on what was used
  const importLines: string[] = []

  if (imports.enums.size > 0) {
    const enumImports = Array.from(imports.enums).sort().join(',\n  ')
    importLines.push(`import type {`)
    importLines.push(`  ${enumImports}`)
    importLines.push(`} from './enums.js'`)
    importLines.push('')
  }

  if (imports.common.size > 0) {
    const commonImports = Array.from(imports.common).sort().join(',\n  ')
    importLines.push(`import type {`)
    importLines.push(`  ${commonImports}`)
    importLines.push(`} from './common.js'`)
    importLines.push('')
  }

  if (imports.objects.size > 0) {
    const objectImports = Array.from(imports.objects).sort().join(',\n  ')
    importLines.push(`import type {`)
    importLines.push(`  ${objectImports}`)
    importLines.push(`} from './objects.js'`)
    importLines.push('')
  }

  // Insert imports at placeholder
  typeDefinitions[importsPlaceholder] = importLines.join('\n')

  // Write output file
  const output = typeDefinitions.join('\n')
  fs.writeFileSync(OUTPUT_FILE, output, 'utf8')

  console.log('\n✅ Schema types generated successfully!')
  console.log(`📄 Output: ${OUTPUT_FILE}`)
  console.log(`📊 Generated ${schemas.length} schema types`)
  console.log(
    `📦 Imported ${imports.enums.size} enum types, ${imports.common.size} common types, ${imports.objects.size} object types`
  )
}

// Run the generator
generateSchemaTypes().catch((error) => {
  console.error('❌ Schema type generation failed:', error)
  process.exit(1)
})
