/**
 * Validate that generated files are up-to-date with schema files
 * Compares actual file content to detect stale generated code
 * This is more reliable than timestamp comparison, especially in CI environments
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createHash } from 'crypto'
import { spawnSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Get file content hash for comparison
 */
function getFileHash(filePath: string): string | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return createHash('sha256').update(content).digest('hex')
  } catch {
    return null
  }
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
 * Generate files and return their content hashes
 * This temporarily overwrites the existing files, so we need to restore them
 */
function generateAndGetHashes(originalHashes: Map<string, string>): Map<string, string> {
  const packageDir = path.join(__dirname, '..')
  const generatedFiles = getGeneratedFiles()

  // Run generation (this will overwrite existing files)
  const generateScripts = [
    'generate:enums',
    'generate:common',
    'generate:objects',
    'generate:schemas',
    'generate:index',
  ]

  for (const script of generateScripts) {
    const result = spawnSync('npm', ['run', script], {
      cwd: packageDir,
      stdio: 'pipe',
      shell: true,
    })

    if (result.status !== 0) {
      console.error(`❌ Failed to generate ${script}`)
      console.error(result.stderr?.toString() || result.stdout?.toString())
      throw new Error(`Generation failed for ${script}`)
    }
  }

  // Get hashes of newly generated files
  const newHashes = new Map<string, string>()
  for (const file of generatedFiles) {
    const hash = getFileHash(file)
    if (hash) {
      newHashes.set(file, hash)
    }
  }

  return newHashes
}

/**
 * Validate that generated files match what would be generated from current schemas
 */
function validateGenerated(): boolean {
  console.log('🔍 Validating generated files...\n')

  const generatedFiles = getGeneratedFiles()

  // Check that all files exist
  for (const file of generatedFiles) {
    if (!fs.existsSync(file)) {
      console.error(`❌ Generated file not found: ${path.basename(file)}`)
      return false
    }
  }

  // Save original file contents
  const originalContents = new Map<string, string>()
  for (const file of generatedFiles) {
    try {
      originalContents.set(file, fs.readFileSync(file, 'utf-8'))
    } catch {
      console.error(`❌ Could not read file: ${path.basename(file)}`)
      return false
    }
  }

  // Get original hashes
  const originalHashes = new Map<string, string>()
  for (const [file, content] of originalContents) {
    originalHashes.set(file, createHash('sha256').update(content).digest('hex'))
  }

  // Generate fresh files and get their hashes
  let newHashes: Map<string, string>
  try {
    newHashes = generateAndGetHashes(originalHashes)
  } catch (error) {
    // Restore original files on error
    for (const [file, content] of originalContents) {
      fs.writeFileSync(file, content, 'utf-8')
    }
    console.error('❌ Failed to generate comparison files')
    return false
  }

  // Compare hashes
  let allValid = true
  const staleFiles: string[] = []

  for (const file of generatedFiles) {
    const originalHash = originalHashes.get(file)
    const newHash = newHashes.get(file)

    if (!originalHash || !newHash) {
      console.error(`❌ Could not hash file: ${path.basename(file)}`)
      allValid = false
      staleFiles.push(file)
      continue
    }

    if (originalHash !== newHash) {
      console.error(`❌ Stale: ${path.basename(file)}`)
      allValid = false
      staleFiles.push(file)
    } else {
      console.log(`✅ Fresh: ${path.basename(file)}`)
    }
  }

  // Restore original files (always restore, even if validation passes,
  // to avoid modifying files during validation)
  for (const [file, content] of originalContents) {
    fs.writeFileSync(file, content, 'utf-8')
  }

  console.log()

  if (!allValid) {
    console.error('❌ Some generated files are stale!')
    console.error('\n💡 Run `npm run generate` to update generated files\n')
    console.error('Stale files:')
    staleFiles.forEach((f) => console.error(`  - ${path.relative(process.cwd(), f)}`))
    return false
  }

  console.log('✅ All generated files are up-to-date!\n')
  return true
}

// Run validation
const isValid = validateGenerated()
process.exit(isValid ? 0 : 1)
