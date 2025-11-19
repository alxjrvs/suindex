/**
 * Generate TypeScript object types from objects.schema.json
 *
 * This generator creates TypeScript interface and type definitions for complex object
 * and array types used across the Salvage Union data schemas. It recognizes and imports
 * refs from common and enum types.
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import {
  loadSchema,
  analyzeSchemaDependencies,
  topologicalSort,
  type JSONSchema,
} from './schemaAnalysis.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const OUTPUT_FILE = path.join(__dirname, '../lib/types/objects.ts')

/**
 * Capitalize first letter of a string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert snake_case or camelCase to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split('_')
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

// Track forward references for recursive types
const forwardRefs = new Set<string>()

/**
 * Extract type name from a $ref string
 */
function extractRefType(
  ref: string
): { source: 'enum' | 'common' | 'object' | 'array'; typeName: string } | null {
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
    forwardRefs.add(typeName)
    return { source: 'object', typeName }
  }

  if (ref.startsWith('#/definitions/')) {
    const defName = ref.split('/').pop()!
    const typeName = `SURefObject${capitalize(defName)}`
    forwardRefs.add(typeName)
    return { source: 'object', typeName }
  }

  if (ref.includes('arrays.schema.json#/definitions/')) {
    const defName = ref.split('/').pop()!
    const typeName = `SURefObject${capitalize(defName)}`
    return { source: 'array', typeName }
  }

  return null
}

/**
 * Generate TypeScript type from schema property
 */
function generatePropertyType(schema: JSONSchema, depth: number = 0): string {
  // Handle $ref
  if (schema.$ref) {
    const refType = extractRefType(schema.$ref)
    if (refType) {
      return refType.typeName
    }
  }

  // Handle oneOf (union types)
  if (schema.oneOf) {
    const types = schema.oneOf.map((s) => generatePropertyType(s, depth)).filter((t) => t)
    if (types.length === 0) return 'unknown'
    return types.length > 1 ? `(${types.join(' | ')})` : types[0]
  }

  // Handle arrays
  if (schema.type === 'array' && schema.items) {
    const itemType = generatePropertyType(schema.items, depth)
    // Don't return inline-object for arrays, expand it
    if (itemType === 'inline-object' && schema.items.properties) {
      // Return the inline object structure for array items
      const props = generateProperties(schema.items.properties, schema.items.required || [], '')
      return `{\n${props.join('\n')}\n}[]`
    }
    return `${itemType}[]`
  }

  // Handle objects with properties (inline)
  if (schema.type === 'object' && schema.properties) {
    return 'inline-object' // Special marker for inline expansion
  }

  // Handle simple types
  if (schema.type === 'string') {
    if (schema.const !== undefined) {
      return `'${schema.const}'`
    }
    return 'string'
  }

  if (schema.type === 'integer' || schema.type === 'number') {
    return 'number'
  }

  if (schema.type === 'boolean') {
    return 'boolean'
  }

  if (schema.type === 'object' && schema.additionalProperties) {
    if (typeof schema.additionalProperties === 'object') {
      const valueType = generatePropertyType(schema.additionalProperties, depth)
      return `Record<string, ${valueType}>`
    }
    return 'Record<string, unknown>'
  }

  return 'unknown'
}

/**
 * Check if a property name needs to be quoted
 */
function needsQuoting(propName: string): boolean {
  // Quote if contains special characters like hyphens, spaces, or starts with a number
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

    // Handle inline object types
    if (propSchema.type === 'object' && propSchema.properties) {
      lines.push(`${indent}${formattedName}${optional}: {`)
      const nestedProps = generateProperties(
        propSchema.properties,
        propSchema.required || [],
        indent + '  '
      )
      lines.push(...nestedProps)
      lines.push(`${indent}}`)
    } else if (propSchema.type === 'object' && propSchema.additionalProperties) {
      // Handle Record types
      const propType = generatePropertyType(propSchema)
      lines.push(`${indent}${formattedName}${optional}: ${propType}`)
    } else {
      const propType = generatePropertyType(propSchema)
      lines.push(`${indent}${formattedName}${optional}: ${propType}`)
    }
  }

  return lines
}

/**
 * Generate TypeScript interface from object schema definition
 */
function generateObjectType(name: string, schema: JSONSchema): string | null {
  const typeName = `SURefObject${capitalize(name)}`
  const lines: string[] = []

  if (schema.description) {
    lines.push('/**')
    lines.push(` * ${schema.description}`)
    lines.push(' */')
  }

  // Handle simple $ref (type alias)
  if (schema.$ref && !schema.allOf && !schema.properties && !schema.oneOf) {
    const refType = extractRefType(schema.$ref)
    if (refType) {
      lines.push(`export type ${typeName} = ${refType.typeName}`)
      return lines.join('\n')
    }
  }

  // Handle allOf (inheritance/composition)
  const baseTypes: string[] = []
  let ownProperties = schema.properties || {}
  let ownRequired = schema.required || []

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

    // If allOf only contains a single $ref and no own properties, make it a type alias
    if (baseTypes.length === 1 && Object.keys(ownProperties).length === 0) {
      lines.push(`export type ${typeName} = ${baseTypes[0]}`)
      return lines.join('\n')
    }
  }

  // Handle oneOf for complex union types (like table)
  if (schema.oneOf && !schema.properties) {
    // This is a union type, not an interface
    const unionTypes = schema.oneOf.map((s) => {
      if (s.properties) {
        // Generate inline interface for each variant
        const variantLines: string[] = []
        variantLines.push('{')
        const props = generateProperties(s.properties, s.required || [], '    ')
        variantLines.push(...props)
        variantLines.push('  }')
        return variantLines.join('\n')
      }
      return generatePropertyType(s)
    })

    lines.push(`export type ${typeName} =`)
    unionTypes.forEach((ut, idx) => {
      const prefix = idx === 0 ? '  ' : '  | '
      if (ut.includes('\n')) {
        // Multi-line union member (inline object)
        const indentedLines = ut.split('\n').map((line, lineIdx) => {
          if (lineIdx === 0) return `${prefix}${line}`
          return `  ${line}`
        })
        lines.push(indentedLines.join('\n'))
      } else {
        lines.push(`${prefix}${ut}`)
      }
    })

    return lines.join('\n')
  }

  // Generate interface
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

/**
 * Generate TypeScript type alias from array schema definition
 */
function generateArrayType(name: string, schema: JSONSchema): string | null {
  const typeName = `SURefObject${capitalize(name)}`
  const lines: string[] = []

  if (schema.description) {
    lines.push('/**')
    lines.push(` * ${schema.description}`)
    lines.push(' */')
  }

  if (schema.type === 'array' && schema.items) {
    const itemType = generatePropertyType(schema.items)

    // Handle inline objects in arrays
    if (itemType === 'inline-object' && schema.items.properties) {
      lines.push(`export type ${typeName} = {`)
      const props = generateProperties(schema.items.properties, schema.items.required || [], '  ')
      lines.push(...props)
      lines.push('}[]')
    } else {
      lines.push(`export type ${typeName} = ${itemType}[]`)
    }
  } else {
    console.warn(`⚠️  Skipping array type ${name}: not an array schema`)
    return null
  }

  return lines.join('\n')
}

async function generateObjectTypes() {
  console.log('🔧 Generating TypeScript object and array types from objects.schema.json...\n')

  // Read schema
  const objectsSchema = loadSchema('schemas/shared/objects.schema.json')

  const typeDefinitions: string[] = []

  // Header (will add imports later)
  typeDefinitions.push('/**')
  typeDefinitions.push(' * Auto-generated TypeScript object and array types')
  typeDefinitions.push(' * DO NOT EDIT MANUALLY')
  typeDefinitions.push(' * Generated by tools/generateObjectTypes.ts')
  typeDefinitions.push(' */')
  typeDefinitions.push('')

  // Placeholder for imports (we'll prepend these after generation)
  const importsPlaceholder = typeDefinitions.length
  typeDefinitions.push('') // Will be replaced with imports

  // Get all definitions
  const allDefs = objectsSchema.definitions || objectsSchema.$defs || {}

  // Separate object types from array types
  const objectDefs: Record<string, JSONSchema> = {}
  const arrayDefs: Record<string, JSONSchema> = {}
  const simpleTypeDefs: Record<string, JSONSchema> = {}

  for (const [name, def] of Object.entries(allDefs)) {
    const schema = def as JSONSchema
    if (schema.type === 'array') {
      arrayDefs[name] = schema
    } else if (schema.oneOf && !schema.properties) {
      // Simple union types (not complex objects with oneOf)
      simpleTypeDefs[name] = schema
    } else {
      objectDefs[name] = schema
    }
  }

  // Generate object types in dependency order using topological sort
  const objectDependencyGraph = analyzeSchemaDependencies(objectsSchema, objectDefs)
  const objectOrder = topologicalSort(objectDependencyGraph)

  console.log('📋 Generating object types...')
  for (const typeName of objectOrder) {
    if (objectDefs[typeName]) {
      const typeCode = generateObjectType(typeName, objectDefs[typeName])
      if (typeCode) {
        typeDefinitions.push(typeCode)
        typeDefinitions.push('')
        console.log(`   ✓ ${typeName}`)
      }
    }
  }

  // Generate simple union types (like schemaName)
  const simpleTypeOrder = Object.keys(simpleTypeDefs).sort()

  if (simpleTypeOrder.length > 0) {
    console.log('\n📋 Generating simple union types...')
    for (const typeName of simpleTypeOrder) {
      const typeCode = generateObjectType(typeName, simpleTypeDefs[typeName])
      if (typeCode) {
        typeDefinitions.push(typeCode)
        typeDefinitions.push('')
        console.log(`   ✓ ${typeName}`)
      }
    }
  }

  // Generate array types
  const arrayOrder = Object.keys(arrayDefs).sort()

  console.log('\n📋 Generating array types...')
  for (const typeName of arrayOrder) {
    const typeCode = generateArrayType(typeName, arrayDefs[typeName])
    if (typeCode) {
      typeDefinitions.push(typeCode)
      typeDefinitions.push('')
      console.log(`   ✓ ${typeName}`)
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

  // Insert imports at placeholder
  typeDefinitions[importsPlaceholder] = importLines.join('\n')

  // Write output file
  const output = typeDefinitions.join('\n')
  fs.writeFileSync(OUTPUT_FILE, output, 'utf8')

  console.log('\n✅ Object and array types generated successfully!')
  console.log(`📄 Output: ${OUTPUT_FILE}`)
  console.log(`📊 Generated ${objectOrder.length} object types, ${arrayOrder.length} array types`)
  console.log(`📦 Imported ${imports.enums.size} enum types, ${imports.common.size} common types`)
}

// Run the generator
generateObjectTypes().catch((error) => {
  console.error('❌ Object type generation failed:', error)
  process.exit(1)
})
