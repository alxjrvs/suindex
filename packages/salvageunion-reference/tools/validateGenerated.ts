/**
 * Validate that generated files are up-to-date with schema files
 * Compares timestamps to detect stale generated code
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface FileTimestamp {
  path: string
  mtime: number
}

/**
 * Get modification time of a file
 */
function getFileTimestamp(filePath: string): FileTimestamp | null {
  try {
    const stats = fs.statSync(filePath)
    return {
      path: filePath,
      mtime: stats.mtimeMs,
    }
  } catch {
    return null
  }
}

/**
 * Get all schema files
 */
function getSchemaFiles(): string[] {
  const schemasDir = path.join(__dirname, '../schemas')
  const files = fs.readdirSync(schemasDir)
  return files
    .filter((f) => f.endsWith('.schema.json'))
    .map((f) => path.join(schemasDir, f))
}

/**
 * Get all generated type files
 */
function getGeneratedFiles(): string[] {
  const libTypesDir = path.join(__dirname, '../lib/types')
  return [
    path.join(libTypesDir, 'enums.ts'),
    path.join(libTypesDir, 'common.ts'),
    path.join(libTypesDir, 'objects.ts'),
    path.join(libTypesDir, 'schemas.ts'),
    path.join(__dirname, '../lib/index.ts'),
  ]
}

/**
 * Validate that generated files are newer than schema files
 */
function validateGenerated(): boolean {
  console.log('🔍 Validating generated files...\n')

  const schemaFiles = getSchemaFiles()
  const generatedFiles = getGeneratedFiles()

  // Get timestamps for all schema files
  const schemaTimestamps = schemaFiles
    .map(getFileTimestamp)
    .filter((t): t is FileTimestamp => t !== null)

  if (schemaTimestamps.length === 0) {
    console.error('❌ No schema files found!')
    return false
  }

  // Find the most recently modified schema file
  const newestSchema = schemaTimestamps.reduce((newest, current) =>
    current.mtime > newest.mtime ? current : newest
  )

  console.log(
    `📄 Newest schema: ${path.basename(newestSchema.path)} (${new Date(newestSchema.mtime).toISOString()})`
  )

  // Check each generated file
  let allValid = true
  const staleFiles: string[] = []

  for (const genFile of generatedFiles) {
    const genTimestamp = getFileTimestamp(genFile)

    if (!genTimestamp) {
      console.error(`❌ Generated file not found: ${path.basename(genFile)}`)
      allValid = false
      staleFiles.push(genFile)
      continue
    }

    if (genTimestamp.mtime < newestSchema.mtime) {
      console.error(
        `❌ Stale: ${path.basename(genFile)} (${new Date(genTimestamp.mtime).toISOString()})`
      )
      allValid = false
      staleFiles.push(genFile)
    } else {
      console.log(
        `✅ Fresh: ${path.basename(genFile)} (${new Date(genTimestamp.mtime).toISOString()})`
      )
    }
  }

  console.log()

  if (!allValid) {
    console.error('❌ Some generated files are stale!')
    console.error('\n💡 Run `npm run generate` to update generated files\n')
    console.error('Stale files:')
    staleFiles.forEach((f) =>
      console.error(`  - ${path.relative(process.cwd(), f)}`)
    )
    return false
  }

  console.log('✅ All generated files are up-to-date!\n')
  return true
}

// Run validation
const isValid = validateGenerated()
process.exit(isValid ? 0 : 1)
