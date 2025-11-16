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

  // Generate type imports
  const typeImports = schemaIndex.schemas
    .map((entry: SchemaIndexEntry) => {
      const singularName = getSingularTypeName(entry.id)
      return `  SURef${singularName}`
    })
    .join(',\n')

  // Add union types to imports
  const allTypeImports = `${typeImports},\n  SURefEntity,\n  SURefSchemaName`

  // Generate SchemaToEntityMap
  const schemaToEntityEntries = schemaIndex.schemas
    .map((entry: SchemaIndexEntry) => {
      const singularName = getSingularTypeName(entry.id)
      return `  '${entry.id}': SURef${singularName}`
    })
    .join('\n')

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

  // Generate static model properties
  const modelProperties = schemaIndex.schemas
    .map((entry: SchemaIndexEntry) => {
      const modelName = toPascalCase(entry.id)
      return `  static ${modelName} = models.${modelName} as ModelWithMetadata<
    SchemaToEntityMap['${entry.id}']
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
    `// Type mapping from schema names to entity types
type SchemaToEntityMap = {
${schemaToEntityEntries}
}`
  )

  template = template.replace(
    '// INJECT:SCHEMA_TO_MODEL_MAP',
    `// Runtime mapping from schema names to model property names
const SchemaToModelMap = {
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
