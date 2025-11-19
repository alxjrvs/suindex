/**
 * Generate lib/index.ts from template by injecting dynamic schema-based code
 */

import fs from 'fs'
import path from 'path'
import {
  getDirname,
  loadSchemaIndex,
  getSingularTypeName,
  toPascalCase,
  type SchemaIndexEntry,
} from './generatorUtils.js'

const __dirname = getDirname(import.meta.url)
const schemaIndex = loadSchemaIndex(__dirname)

function generateIndexFile() {
  console.log('🔧 Generating lib/index.ts from template...\n')

  // Read the template file
  const templatePath = path.join(__dirname, '..', 'lib', 'index.template.ts')
  let template = fs.readFileSync(templatePath, 'utf-8')

  // Schemas that are not top-level entities (excluded from entity operations)
  const nonEntitySchemas = new Set(['chassis-abilities', 'actions'])

  // Generate type imports for entity schemas (non-meta, non-excluded)
  const entitySchemas = schemaIndex.schemas.filter(
    (entry) => !nonEntitySchemas.has(entry.id) && !entry.meta
  )
  const typeImports = entitySchemas
    .map((entry: SchemaIndexEntry) => {
      const singularName = getSingularTypeName(entry.id)
      return `  SURef${singularName}`
    })
    .join(',\n')

  // Generate meta type imports (for meta schemas that need model properties)
  const metaSchemas = schemaIndex.schemas.filter(
    (entry) => !nonEntitySchemas.has(entry.id) && entry.meta
  )
  const metaTypeImports = metaSchemas
    .map((entry: SchemaIndexEntry) => {
      const singularName = getSingularTypeName(entry.id)
      return `  SURefMeta${singularName}`
    })
    .join(',\n')

  // Combine all imports
  const allTypeImports = metaTypeImports
    ? `${typeImports},\n${metaTypeImports},\n  SURefEntity,\n  SURefSchemaName`
    : `${typeImports},\n  SURefEntity,\n  SURefSchemaName`

  // EntitySchemaName is defined in the generated file, not imported

  // Generate SchemaToEntityMap (includes entity schemas AND meta schemas, excludes nonEntitySchemas)
  // This includes all schemas that can be queried via the ORM
  const schemasForEntityMap = schemaIndex.schemas.filter((entry) => !nonEntitySchemas.has(entry.id))
  const schemaToEntityEntries = schemasForEntityMap
    .map((entry: SchemaIndexEntry) => {
      const singularName = getSingularTypeName(entry.id)
      const prefix = entry.meta ? 'SURefMeta' : 'SURef'
      return `  '${entry.id}': ${prefix}${singularName}`
    })
    .join('\n')

  // Generate EntitySchemaName type (includes entity schemas and meta schemas, excludes nonEntitySchemas)
  const entitySchemaNames = schemasForEntityMap.map((entry) => `  '${entry.id}'`).join(' |\n')

  // Generate runtime constant for entity schema names (for runtime checks)
  const entitySchemaNameList = schemasForEntityMap.map((entry) => `  '${entry.id}'`).join(',\n')

  // Generate SchemaToModelMap
  const schemaToModelEntries = schemaIndex.schemas
    .map((entry: SchemaIndexEntry) => {
      const modelName = toPascalCase(entry.id)
      return `  '${entry.id}': '${modelName}'`
    })
    .join(',\n')

  // Generate SchemaToDisplayName
  const schemaToDisplayNameEntries = schemaIndex.schemas
    .map((entry: SchemaIndexEntry) => {
      return `  '${entry.id}': '${entry.displayName}'`
    })
    .join(',\n')

  // Generate static model properties for ALL schemas (including meta)
  // Entity schemas use SchemaToEntityMap, meta schemas use their direct type
  const modelProperties = schemaIndex.schemas
    .filter((entry) => !nonEntitySchemas.has(entry.id))
    .map((entry: SchemaIndexEntry) => {
      const modelName = toPascalCase(entry.id)
      const singularName = getSingularTypeName(entry.id)
      const prefix = entry.meta ? 'SURefMeta' : 'SURef'
      const typeRef = entry.meta ? `${prefix}${singularName}` : `SchemaToEntityMap['${entry.id}']`
      return `  static ${modelName} = models.${modelName} as ModelWithMetadata<
    ${typeRef}
  >`
    })
    .join('\n')

  // Inject all dynamic parts into template
  template = template.replace(
    '// INJECT:TYPE_IMPORTS',
    `import type {
${allTypeImports},
} from './types/index.js'`
  )

  template = template.replace(
    '// INJECT:SCHEMA_TO_ENTITY_MAP',
    `// Type mapping from schema names to entity types (includes entity schemas and meta schemas)
export type SchemaToEntityMap = {
${schemaToEntityEntries}
}`
  )

  template = template.replace('// INJECT:ENTITY_SCHEMA_NAMES', entitySchemaNameList)

  template = template.replace(
    '// INJECT:SCHEMA_TO_MODEL_MAP',
    `// Runtime mapping from schema names to model property names
export const SchemaToModelMap = {
${schemaToModelEntries},
} as const`
  )

  template = template.replace(
    '// INJECT:SCHEMA_TO_DISPLAY_NAME',
    `// Runtime mapping from schema names to display names
export const SchemaToDisplayName = {
${schemaToDisplayNameEntries},
} as const`
  )

  template = template.replace(
    '  // INJECT:MODEL_PROPERTIES',
    `  // Initialize static properties from generated models
${modelProperties}`
  )

  // Write the generated file
  const outputPath = path.join(__dirname, '..', 'lib', 'index.ts')
  fs.writeFileSync(outputPath, template, 'utf-8')

  console.log('✅ Generated lib/index.ts')
  console.log(`   - ${schemaIndex.schemas.length} schemas`)
  console.log(`   - ${schemaIndex.schemas.length} model properties`)
}

generateIndexFile()
