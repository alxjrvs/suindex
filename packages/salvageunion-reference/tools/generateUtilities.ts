#!/usr/bin/env tsx
/**
 * Auto-generates utility functions from schema definitions
 * Creates type guards and property extractors based on schema structure
 */

import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { getSingularTypeName, loadSchemaIndex } from './generatorUtils.js'
import {
  loadSchema,
  extractProperties,
  computePropertyUsageFrequency,
  getManualPropertyExtractors,
  extractRefName,
} from './schemaAnalysis.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const schemasDir = join(__dirname, '..', 'schemas')
const outputFile = join(__dirname, '..', 'lib', 'utilities-generated.ts')

// Load schema index
const schemaIndex = loadSchemaIndex(__dirname)

interface PropertyInfo {
  name: string
  type: string
  required: boolean
  isArray?: boolean
  isRef?: boolean
  refPath?: string
}

function extractPropertiesFromSchema(schemaFile: string): PropertyInfo[] {
  const schema = loadSchema(schemaFile)
  const properties = extractProperties(schema, schemasDir, schema)
  return properties.map((prop) => ({
    name: prop.name,
    type: prop.type,
    required: prop.required,
    isArray: prop.isArray,
    isRef: prop.isRef,
    refPath: prop.refPath,
  }))
}

function generateTypeGuard(typeName: string, properties: PropertyInfo[], isMeta: boolean): string {
  const requiredProps = properties.filter((p) => p.required)

  if (requiredProps.length === 0) return ''

  const prefix = isMeta ? 'SURefMeta' : 'SURef'
  const typeRef = `${prefix}${typeName}`

  let code = `/**\n`
  code += ` * Type guard to check if an entity is a ${typeName}\n`
  code += ` * @param entity - The entity to check\n`
  code += ` * @returns True if the entity is a ${typeName}\n`
  code += ` */\n`
  code += `export function is${typeName}(entity: SURefMetaEntity): entity is ${typeRef} {\n`
  code += `  return (\n`

  const checks = requiredProps.map((prop) => {
    return `    '${prop.name}' in entity`
  })

  code += checks.join(' &&\n')
  code += `\n  )\n`
  code += `}\n\n`

  return code
}

function getTypeScriptType(propName: string, propType: string, propInfo?: PropertyInfo): string {
  // Derive type from schema reference if available
  if (propInfo && propInfo.isRef && propInfo.refPath) {
    const refName = extractRefName(propInfo.refPath)
    if (refName) {
      // Map common object types
      if (propInfo.refPath.includes('objects.schema.json')) {
        const capitalized = refName.charAt(0).toUpperCase() + refName.slice(1)
        if (propInfo.isArray) {
          return `SURefObject${capitalized}[]`
        }
        return `SURefObject${capitalized}`
      }

      // Handle arrays of enums
      if (propInfo.refPath.includes('enums.schema.json') && propInfo.isArray) {
        return 'string[]'
      }
    }
  }

  // Special cases based on property name and type
  if (propName === 'actions' && propType === 'array') {
    return 'string[]' // Actions are string arrays (action names)
  }
  if (propName === 'chassisAbilities' && propType === 'array') {
    return 'SURefObjectAction[]' // Chassis abilities are resolved objects
  }
  if ((propName === 'requirement' || propName === 'coreTrees') && propType === 'array') {
    return 'string[]' // Arrays of tree enums
  }

  // Fall back to basic types
  if (propType === 'string') return 'string'
  if (propType === 'number' || propType === 'integer') return 'number'
  if (propType === 'boolean') return 'boolean'
  if (propType === 'array') return 'unknown[]'
  if (propType === 'object') return 'Record<string, unknown>'
  if (propType === 'string | number') return 'string | number'

  return 'unknown'
}

function generatePropertyExtractor(
  propName: string,
  propType: string,
  propInfo?: PropertyInfo
): string {
  const functionName = `get${propName.charAt(0).toUpperCase()}${propName.slice(1)}`
  const returnType = getTypeScriptType(propName, propType, propInfo)

  let code = `/**\n`
  code += ` * Extract ${propName} from an entity\n`
  if (propName === 'actions') {
    code += ` * Note: This function returns the raw string array. Use extractActions() from utilities.ts\n`
    code += ` * to get resolved action objects.\n`
  }
  code += ` * @param entity - The entity to extract from\n`
  code += ` * @returns The ${propName} or undefined\n`
  code += ` */\n`
  code += `export function ${functionName}(entity: SURefMetaEntity): ${returnType} | undefined {\n`

  // Generate the implementation based on the base type
  if (propType === 'string' || returnType === 'string') {
    code += `  return '${propName}' in entity && typeof entity.${propName} === 'string'\n`
    code += `    ? entity.${propName}\n`
    code += `    : undefined\n`
  } else if (propType === 'number' || propType === 'integer' || returnType === 'number') {
    code += `  return '${propName}' in entity && typeof entity.${propName} === 'number'\n`
    code += `    ? entity.${propName}\n`
    code += `    : undefined\n`
  } else if (propType === 'boolean' || returnType === 'boolean') {
    code += `  return '${propName}' in entity && typeof entity.${propName} === 'boolean'\n`
    code += `    ? entity.${propName}\n`
    code += `    : undefined\n`
  } else if (
    propType === 'array' ||
    returnType.includes('[]') ||
    (returnType.startsWith('SURefObject') && returnType.endsWith('s') && !returnType.includes('|'))
  ) {
    // For string arrays (like actions), cast to the correct type
    if (returnType === 'string[]') {
      code += `  return '${propName}' in entity && Array.isArray(entity.${propName})\n`
      code += `    ? (entity.${propName} as ${returnType})\n`
      code += `    : undefined\n`
    } else {
      code += `  return '${propName}' in entity && Array.isArray(entity.${propName})\n`
      code += `    ? entity.${propName}\n`
      code += `    : undefined\n`
    }
  } else if (
    propType === 'object' ||
    returnType.startsWith('SURefObject') ||
    returnType === 'Record<string, unknown>'
  ) {
    code += `  return '${propName}' in entity &&\n`
    code += `    entity.${propName} !== null &&\n`
    code += `    typeof entity.${propName} === 'object' &&\n`
    code += `    !Array.isArray(entity.${propName})\n`
    code += `    ? entity.${propName}\n`
    code += `    : undefined\n`
  } else if (propType === 'string | number') {
    code += `  return '${propName}' in entity &&\n`
    code += `    (typeof entity.${propName} === 'string' || typeof entity.${propName} === 'number')\n`
    code += `    ? entity.${propName}\n`
    code += `    : undefined\n`
  } else {
    // Unknown type - just check existence
    code += `  return '${propName}' in entity ? entity.${propName} : undefined\n`
  }

  code += `}\n\n`

  return code
}

// Generate utilities
console.log('Generating utility functions from schemas...\n')

let output = `/**\n`
output += ` * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY\n`
output += ` * Generated by tools/generateUtilities.ts\n`
output += ` * \n`
output += ` * Type guards and property extractors generated from JSON schemas\n`
output += ` */\n\n`
output += `import type { SURefMetaEntity } from './types/index.js'\n`

// Track which types are actually used (have type guards generated)
const usedTypes = new Set<string>()

output += `// ============================================================================\n`
output += `// TYPE GUARDS\n`
output += `// ============================================================================\n\n`

// Generate type guards for each schema and track which types are used
for (const schemaInfo of schemaIndex.schemas) {
  const properties = extractPropertiesFromSchema(schemaInfo.schemaFile)
  const typeName = getSingularTypeName(schemaInfo.id, __dirname)
  const isMeta = schemaInfo.meta === true
  const prefix = isMeta ? 'SURefMeta' : 'SURef'
  const typeGuard = generateTypeGuard(typeName, properties, isMeta)
  if (typeGuard) {
    // Only track types that actually got a type guard generated
    usedTypes.add(`${prefix}${typeName}`)
    output += typeGuard
  }
}

// Now add imports only for types that are actually used
if (usedTypes.size > 0) {
  output += `\n// Import types used in type guards\n`
  output += `import type {\n`
  output += Array.from(usedTypes)
    .sort()
    .map((type) => `  ${type}`)
    .join(',\n')
  output += `\n} from './types/index.js'\n`
}

output += `// ============================================================================\n`
output += `// PROPERTY EXTRACTORS\n`
output += `// ============================================================================\n\n`

// Get manual properties from schema metadata
const manualProperties = getManualPropertyExtractors(schemaIndex)

// Collect all unique properties across all schemas with their full info
const allProperties = new Map<string, { type: string; info?: PropertyInfo }>()

for (const schemaInfo of schemaIndex.schemas) {
  const schema = loadSchema(schemaInfo.schemaFile)
  const properties = extractProperties(schema, schemasDir, schema)
  for (const prop of properties) {
    if (!allProperties.has(prop.name)) {
      allProperties.set(prop.name, { type: prop.type, info: prop })
    }
  }
}

// Compute property usage frequency for prioritization
const propertyFrequency = computePropertyUsageFrequency(schemaIndex, schemasDir)

// Determine which meta types are actually used based on properties
// Only include types from properties that will be auto-generated (not manual)
const usedMetaTypes = new Set<string>()
for (const [propName, propData] of allProperties.entries()) {
  // Skip manual properties - they have their own implementations
  if (manualProperties.has(propName)) {
    continue
  }
  const metaType = getTypeScriptType(propName, propData.type, propData.info)
  if (metaType.startsWith('SURefObject')) {
    // Extract base type from arrays (e.g., 'SURefObjectAction[]' -> 'SURefObjectAction')
    const baseType = metaType.replace(/\[]$/, '')
    usedMetaTypes.add(baseType)
  }
}

// Generate property extractors for all properties
// Prioritize by usage frequency (most common first)
const sortedProperties = Array.from(allProperties.entries()).sort((a, b) => {
  const freqA = propertyFrequency.get(a[0]) || 0
  const freqB = propertyFrequency.get(b[0]) || 0
  return freqB - freqA // Descending order
})

const generatedExtractors = new Set<string>()

// Generate extractors for all properties (sorted by frequency)
for (const [propName, propData] of sortedProperties) {
  if (!manualProperties.has(propName)) {
    output += generatePropertyExtractor(propName, propData.type, propData.info)
    generatedExtractors.add(propName)
  }
}

// Add imports for object types used in property extractors
if (usedMetaTypes.size > 0) {
  output += `\n// Import object types used in property extractors\n`
  output += `import type {\n`
  const metaTypeList = Array.from(usedMetaTypes).sort()
  output += metaTypeList.map((type) => `  ${type}`).join(',\n')
  output += `\n} from './types/objects.js'\n`
}

writeFileSync(outputFile, output)
console.log(`✅ Generated ${outputFile}`)
console.log(`   - ${usedTypes.size} type guards`)
console.log(`   - ${generatedExtractors.size} property extractors`)
