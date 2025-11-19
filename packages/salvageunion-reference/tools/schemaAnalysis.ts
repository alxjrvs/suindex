/**
 * Schema analysis utilities for code generation
 * Provides dependency analysis, topological sorting, and type extraction from JSON schemas
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import type { SchemaIndex, SchemaIndexEntry } from './generatorUtils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface JSONSchema {
  type?: string | string[]
  description?: string
  properties?: Record<string, JSONSchema>
  required?: string[]
  items?: JSONSchema
  $ref?: string
  oneOf?: JSONSchema[]
  allOf?: JSONSchema[]
  const?: string | number
  minimum?: number
  maximum?: number
  minLength?: number
  additionalProperties?: boolean | JSONSchema
  default?: unknown
  enum?: (string | number)[]
  unevaluatedProperties?: boolean
  definitions?: Record<string, JSONSchema>
  $defs?: Record<string, JSONSchema>
}

export interface DependencyNode {
  name: string
  dependencies: Set<string>
  schema: JSONSchema
}

export interface PropertyTypeInfo {
  name: string
  type: string
  required: boolean
  isArray: boolean
  isRef: boolean
  refPath?: string
}

/**
 * Load a schema file
 */
export function loadSchema(schemaPath: string): JSONSchema {
  // Handle both relative paths (from schemas/) and absolute paths
  let fullPath: string
  if (path.isAbsolute(schemaPath)) {
    fullPath = schemaPath
  } else if (schemaPath.startsWith('schemas/')) {
    fullPath = path.join(__dirname, '..', schemaPath)
  } else {
    fullPath = path.join(__dirname, '..', 'schemas', schemaPath)
  }
  return JSON.parse(fs.readFileSync(fullPath, 'utf8')) as JSONSchema
}

/**
 * Extract the definition name from a $ref path
 */
export function extractRefName(ref: string): string | null {
  if (ref.startsWith('#/definitions/')) {
    return ref.split('/').pop() || null
  }
  if (ref.startsWith('#/$defs/')) {
    return ref.split('/').pop() || null
  }
  if (ref.includes('#/definitions/')) {
    return ref.split('#/definitions/')[1] || null
  }
  if (ref.includes('#/$defs/')) {
    return ref.split('#/$defs/')[1] || null
  }
  return null
}

/**
 * Extract all $ref dependencies from a schema
 */
export function extractRefs(schema: JSONSchema, visited: Set<string> = new Set()): Set<string> {
  const refs = new Set<string>()

  if (!schema || visited.has(JSON.stringify(schema))) {
    return refs
  }
  visited.add(JSON.stringify(schema))

  if (schema.$ref) {
    const refName = extractRefName(schema.$ref)
    if (refName) {
      refs.add(refName)
    }
  }

  if (schema.allOf) {
    for (const subSchema of schema.allOf) {
      const subRefs = extractRefs(subSchema, visited)
      subRefs.forEach((ref) => refs.add(ref))
    }
  }

  if (schema.oneOf) {
    for (const subSchema of schema.oneOf) {
      const subRefs = extractRefs(subSchema, visited)
      subRefs.forEach((ref) => refs.add(ref))
    }
  }

  if (schema.items) {
    const itemRefs = extractRefs(schema.items, visited)
    itemRefs.forEach((ref) => refs.add(ref))
  }

  if (schema.properties) {
    for (const propSchema of Object.values(schema.properties)) {
      const propRefs = extractRefs(propSchema, visited)
      propRefs.forEach((ref) => refs.add(ref))
    }
  }

  return refs
}

/**
 * Build a dependency graph from schema definitions
 */
export function analyzeSchemaDependencies(
  _schema: JSONSchema,
  definitions: Record<string, JSONSchema>
): Map<string, DependencyNode> {
  const graph = new Map<string, DependencyNode>()

  for (const [name, def] of Object.entries(definitions)) {
    const dependencies = extractRefs(def)
    graph.set(name, {
      name,
      dependencies,
      schema: def,
    })
  }

  return graph
}

/**
 * Topological sort of dependency graph
 */
export function topologicalSort(graph: Map<string, DependencyNode>): string[] {
  const sorted: string[] = []
  const visited = new Set<string>()
  const visiting = new Set<string>()

  function visit(nodeName: string): void {
    if (visiting.has(nodeName)) {
      // Circular dependency detected - add anyway but warn
      console.warn(`⚠️  Circular dependency detected involving: ${nodeName}`)
      return
    }
    if (visited.has(nodeName)) {
      return
    }

    visiting.add(nodeName)
    const node = graph.get(nodeName)
    if (node) {
      for (const dep of node.dependencies) {
        if (graph.has(dep)) {
          visit(dep)
        }
      }
    }
    visiting.delete(nodeName)
    visited.add(nodeName)
    sorted.push(nodeName)
  }

  for (const nodeName of graph.keys()) {
    if (!visited.has(nodeName)) {
      visit(nodeName)
    }
  }

  return sorted
}

/**
 * Resolve a $ref to its actual schema definition
 */
export function resolveSchemaReference(
  ref: string,
  _schemasDir: string,
  currentSchema?: JSONSchema
): JSONSchema | null {
  if (ref.startsWith('#/definitions/') || ref.startsWith('#/$defs/')) {
    const defName = extractRefName(ref)
    if (!defName || !currentSchema) return null

    const definitions = currentSchema.definitions || currentSchema.$defs || {}
    return definitions[defName] || null
  }

  if (ref.includes('common.schema.json')) {
    const commonSchema = loadSchema('schemas/shared/common.schema.json')
    const defName = extractRefName(ref)
    if (!defName) return null
    const definitions = commonSchema.definitions || commonSchema.$defs || {}
    return definitions[defName] || null
  }

  if (ref.includes('enums.schema.json')) {
    const enumsSchema = loadSchema('schemas/shared/enums.schema.json')
    const defName = extractRefName(ref)
    if (!defName) return null
    const definitions = enumsSchema.definitions || enumsSchema.$defs || {}
    return definitions[defName] || null
  }

  if (ref.includes('objects.schema.json')) {
    const objectsSchema = loadSchema('schemas/shared/objects.schema.json')
    const defName = extractRefName(ref)
    if (!defName) return null
    const definitions = objectsSchema.definitions || objectsSchema.$defs || {}
    return definitions[defName] || null
  }

  if (ref.includes('arrays.schema.json')) {
    const arraysSchema = loadSchema('schemas/shared/arrays.schema.json')
    const defName = extractRefName(ref)
    if (!defName) return null
    const definitions = arraysSchema.definitions || arraysSchema.$defs || {}
    return definitions[defName] || null
  }

  return null
}

/**
 * Extract property type information from a schema property
 */
export function extractPropertyType(
  propName: string,
  propSchema: JSONSchema,
  schemasDir: string,
  currentSchema?: JSONSchema
): PropertyTypeInfo {
  const info: PropertyTypeInfo = {
    name: propName,
    type: 'unknown',
    required: false,
    isArray: false,
    isRef: false,
  }

  // Handle $ref
  if (propSchema.$ref) {
    info.isRef = true
    info.refPath = propSchema.$ref
    const resolved = resolveSchemaReference(propSchema.$ref, schemasDir, currentSchema)
    if (resolved) {
      if (resolved.type === 'string' && resolved.enum) {
        info.type = 'enum'
      } else if (resolved.type === 'integer' || resolved.type === 'number') {
        info.type = 'number'
      } else if (resolved.type === 'string') {
        info.type = 'string'
      } else if (resolved.type === 'object') {
        info.type = 'object'
      } else {
        info.type = 'ref'
      }
    } else {
      info.type = 'ref'
    }
  }

  // Handle arrays
  if (propSchema.type === 'array' && propSchema.items) {
    info.isArray = true
    if (propSchema.items.$ref) {
      info.isRef = true
      info.refPath = propSchema.items.$ref
      const resolved = resolveSchemaReference(propSchema.items.$ref, schemasDir, currentSchema)
      if (resolved) {
        if (resolved.type === 'string' && resolved.enum) {
          info.type = 'enum[]'
        } else if (resolved.type === 'object') {
          info.type = 'object[]'
        } else {
          info.type = 'ref[]'
        }
      } else {
        info.type = 'ref[]'
      }
    } else if (propSchema.items.type) {
      info.type = `${propSchema.items.type}[]`
    }
  }

  // Handle simple types
  if (!info.isRef && !info.isArray && propSchema.type) {
    if (Array.isArray(propSchema.type)) {
      info.type = propSchema.type.join(' | ')
    } else {
      info.type = propSchema.type
    }
  }

  // Handle oneOf
  if (propSchema.oneOf && !info.isRef && !info.isArray) {
    const types = new Set<string>()
    for (const option of propSchema.oneOf) {
      if (option.type) {
        if (Array.isArray(option.type)) {
          types.add(option.type.join(' | '))
        } else {
          types.add(option.type)
        }
      } else if (option.$ref) {
        types.add('ref')
      }
    }
    if (types.size === 1) {
      info.type = Array.from(types)[0]
    } else if (types.size > 1) {
      info.type = Array.from(types).join(' | ')
    }
  }

  return info
}

/**
 * Extract all properties from a schema with their types
 */
export function extractProperties(
  schema: JSONSchema,
  schemasDir: string,
  currentSchema?: JSONSchema
): PropertyTypeInfo[] {
  const properties: PropertyTypeInfo[] = []
  const propertyMap = new Map<string, PropertyTypeInfo>()

  if (!schema.items?.properties) {
    return properties
  }

  const required = schema.items.required || []

  // Extract properties from allOf references
  if (schema.items.allOf) {
    for (const ref of schema.items.allOf) {
      if (ref.$ref) {
        const resolved = resolveSchemaReference(ref.$ref, schemasDir, currentSchema)
        if (resolved?.properties) {
          const refRequired = resolved.required || []
          for (const [propName, propDef] of Object.entries(resolved.properties)) {
            if (typeof propDef === 'boolean' && propDef === true) continue

            const propInfo = extractPropertyType(propName, propDef, schemasDir, currentSchema)
            propInfo.required = refRequired.includes(propName)
            propertyMap.set(propName, propInfo)
          }
        }
      }
    }
  }

  // Add/override with direct properties
  for (const [propName, propDef] of Object.entries(schema.items.properties)) {
    if (typeof propDef === 'boolean' && propDef === true) continue

    const propInfo = extractPropertyType(propName, propDef, schemasDir, currentSchema)
    propInfo.required = required.includes(propName)
    propertyMap.set(propName, propInfo)
  }

  return Array.from(propertyMap.values())
}

/**
 * Categorize schemas from schema index
 */
export function categorizeSchemas(schemaIndex: SchemaIndex): {
  entities: SchemaIndexEntry[]
  nonEntities: SchemaIndexEntry[]
  metaSchemas: SchemaIndexEntry[]
  nonMetaSchemas: SchemaIndexEntry[]
} {
  const entities: SchemaIndexEntry[] = []
  const nonEntities: SchemaIndexEntry[] = []
  const metaSchemas: SchemaIndexEntry[] = []
  const nonMetaSchemas: SchemaIndexEntry[] = []

  for (const schema of schemaIndex.schemas) {
    if (schema.meta === true) {
      metaSchemas.push(schema)
    } else {
      nonMetaSchemas.push(schema)
    }

    if (schema.nonEntity === true) {
      nonEntities.push(schema)
    } else {
      entities.push(schema)
    }
  }

  return { entities, nonEntities, metaSchemas, nonMetaSchemas }
}

/**
 * Compute property usage frequency across all schemas
 */
export function computePropertyUsageFrequency(
  schemaIndex: SchemaIndex,
  schemasDir: string
): Map<string, number> {
  const frequency = new Map<string, number>()

  for (const schemaEntry of schemaIndex.schemas) {
    const schema = loadSchema(schemaEntry.schemaFile)
    const properties = extractProperties(schema, schemasDir, schema)

    for (const prop of properties) {
      const current = frequency.get(prop.name) || 0
      frequency.set(prop.name, current + 1)
    }
  }

  return frequency
}

/**
 * Get manual property extractors from schema index
 */
export function getManualPropertyExtractors(schemaIndex: SchemaIndex): Set<string> {
  const manual = new Set<string>()

  for (const schema of schemaIndex.schemas) {
    if (schema.manualPropertyExtractors) {
      for (const prop of schema.manualPropertyExtractors) {
        manual.add(prop)
      }
    }
  }

  return manual
}

/**
 * Get type alias mappings from schema index
 */
export function getTypeAliases(schemaIndex: SchemaIndex): Map<string, string> {
  const aliases = new Map<string, string>()

  for (const schema of schemaIndex.schemas) {
    if (schema.typeAlias) {
      aliases.set(schema.id, schema.typeAlias)
    }
  }

  return aliases
}
