#!/usr/bin/env tsx

/**
 * Generate and add missing UUIDs to all data files
 * This script:
 * 1. Finds all items missing IDs at root level
 * 2. Finds all nested choice objects missing IDs
 * 3. Generates valid UUIDs for all missing IDs
 * 4. Replaces invalid UUIDs with valid ones
 * 5. Writes the fixed data back to the files
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'

// UUID v4 regex pattern
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

interface Action {
  id?: string
  name?: string
  actions?: Action[]
  [key: string]: unknown
}

interface Choice {
  id?: string
  name: string
  description: string
  schema: string
}

interface NPC {
  position: string
  description: string
  hitPoints?: number
  choices?: Choice[]
}

interface Ability {
  name: string
  description: string
  choices?: Choice[]
}

interface DataItem {
  id?: string
  npc?: NPC
  abilities?: Ability[]
  choices?: Choice[]
  actions?: Action[]
  [key: string]: unknown
}

interface FileResult {
  file: string
  rootIdsAdded: number
  rootIdsFixed: number
  actionIdsAdded: number
  actionIdsFixed: number
  choiceIdsAdded: number
  choiceIdsFixed: number
  totalChanges: number
}

function validateUUID(id: string): boolean {
  return UUID_PATTERN.test(id)
}

function processFile(filename: string): FileResult {
  const filePath = join(process.cwd(), 'data', filename)
  const data = JSON.parse(readFileSync(filePath, 'utf-8')) as DataItem[]

  const result: FileResult = {
    file: filename,
    rootIdsAdded: 0,
    rootIdsFixed: 0,
    actionIdsAdded: 0,
    actionIdsFixed: 0,
    choiceIdsAdded: 0,
    choiceIdsFixed: 0,
    totalChanges: 0,
  }

  data.forEach((item) => {
    // Check and fix root level ID
    if (!item.id) {
      item.id = randomUUID()
      result.rootIdsAdded++
      result.totalChanges++
    } else if (!validateUUID(item.id)) {
      item.id = randomUUID()
      result.rootIdsFixed++
      result.totalChanges++
    }

    // Process actions (recursive)
    const processActions = (actions: Action[]) => {
      if (actions && Array.isArray(actions)) {
        actions.forEach((action) => {
          if (!action.id) {
            action.id = randomUUID()
            result.actionIdsAdded++
            result.totalChanges++
          } else if (!validateUUID(action.id)) {
            action.id = randomUUID()
            result.actionIdsFixed++
            result.totalChanges++
          }
          // Recursively process nested actions
          if (action.actions) {
            processActions(action.actions)
          }
        })
      }
    }

    // Process choices
    const processChoices = (choices: Choice[]) => {
      if (choices && Array.isArray(choices)) {
        choices.forEach((choice) => {
          if (!choice.id) {
            choice.id = randomUUID()
            result.choiceIdsAdded++
            result.totalChanges++
          } else if (!validateUUID(choice.id)) {
            choice.id = randomUUID()
            result.choiceIdsFixed++
            result.totalChanges++
          }
        })
      }
    }

    // Check actions at root level
    if (item.actions) {
      processActions(item.actions)
    }

    // Check choices at root level
    if (item.choices) {
      processChoices(item.choices)
    }

    // Check choices in NPC
    if (item.npc?.choices) {
      processChoices(item.npc.choices)
    }

    // Check choices in abilities
    if (item.abilities && Array.isArray(item.abilities)) {
      item.abilities.forEach((ability) => {
        if (ability.choices) {
          processChoices(ability.choices)
        }
      })
    }
  })

  // Write back to file if changes were made
  if (result.totalChanges > 0) {
    writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n')
  }

  return result
}

// List of data files to process
const dataFiles = [
  'abilities.json',
  'ability-tree-requirements.json',
  'bio-titans.json',
  'chassis.json',
  'classes.advanced.json',
  'classes.core.json',
  'crawler-bays.json',
  'crawler-tech-levels.json',
  'crawlers.json',
  'creatures.json',
  'drones.json',
  'equipment.json',
  'keywords.json',
  'meld.json',
  'modules.json',
  'npcs.json',
  'roll-tables.json',
  'squads.json',
  'systems.json',
  'traits.json',
  'vehicles.json',
]

console.log('🔧 Generating and fixing UUIDs...\n')

let totalRootIdsAdded = 0
let totalRootIdsFixed = 0
let totalActionIdsAdded = 0
let totalActionIdsFixed = 0
let totalChoiceIdsAdded = 0
let totalChoiceIdsFixed = 0
let filesModified = 0

for (const filename of dataFiles) {
  const result = processFile(filename)

  if (result.totalChanges > 0) {
    filesModified++
    console.log(`📝 ${filename}:`)

    if (result.rootIdsAdded > 0) {
      console.log(`   ✓ Added ${result.rootIdsAdded} root-level ID(s)`)
      totalRootIdsAdded += result.rootIdsAdded
    }

    if (result.rootIdsFixed > 0) {
      console.log(`   ✓ Fixed ${result.rootIdsFixed} invalid root-level ID(s)`)
      totalRootIdsFixed += result.rootIdsFixed
    }

    if (result.actionIdsAdded > 0) {
      console.log(`   ✓ Added ${result.actionIdsAdded} action ID(s)`)
      totalActionIdsAdded += result.actionIdsAdded
    }

    if (result.actionIdsFixed > 0) {
      console.log(`   ✓ Fixed ${result.actionIdsFixed} invalid action ID(s)`)
      totalActionIdsFixed += result.actionIdsFixed
    }

    if (result.choiceIdsAdded > 0) {
      console.log(`   ✓ Added ${result.choiceIdsAdded} choice ID(s)`)
      totalChoiceIdsAdded += result.choiceIdsAdded
    }

    if (result.choiceIdsFixed > 0) {
      console.log(`   ✓ Fixed ${result.choiceIdsFixed} invalid choice ID(s)`)
      totalChoiceIdsFixed += result.choiceIdsFixed
    }

    console.log()
  }
}

if (filesModified === 0) {
  console.log('✅ All IDs are valid! No changes needed.\n')
} else {
  console.log('📊 Summary:')
  console.log('='.repeat(80))
  console.log(`Files modified: ${filesModified}`)
  console.log(`Root-level IDs added: ${totalRootIdsAdded}`)
  console.log(`Root-level IDs fixed: ${totalRootIdsFixed}`)
  console.log(`Action IDs added: ${totalActionIdsAdded}`)
  console.log(`Action IDs fixed: ${totalActionIdsFixed}`)
  console.log(`Choice IDs added: ${totalChoiceIdsAdded}`)
  console.log(`Choice IDs fixed: ${totalChoiceIdsFixed}`)
  console.log(
    `Total changes: ${totalRootIdsAdded + totalRootIdsFixed + totalActionIdsAdded + totalActionIdsFixed + totalChoiceIdsAdded + totalChoiceIdsFixed}`
  )
  console.log('\n✅ All missing and invalid IDs have been generated and fixed!')
  console.log(
    '\n💡 Run `npm run validate:ids` to verify all IDs are now valid and unique.'
  )
}
