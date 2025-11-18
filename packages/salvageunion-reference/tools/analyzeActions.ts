// Temporary analysis script - can be deleted after migration
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataFiles = [
  'data/abilities.json',
  'data/systems.json',
  'data/modules.json',
  'data/equipment.json',
  'data/bio-titans.json',
  'data/crawlers.json',
  'data/creatures.json',
  'data/meld.json',
  'data/npcs.json',
  'data/squads.json',
]

interface ActionWithContext {
  id: string
  name: string
  content?: unknown[]
  activationCost?: number | string
  actionType?: string
  range?: string[]
  damage?: { damageType: string; amount: number | string }
  traits?: Array<{ type: string; amount?: number | string }>
  _sourceSchema: string
  _sourceEntity: string
  _sourceEntityId: string
}

const allActions: ActionWithContext[] = []
const actionMap = new Map<string, ActionWithContext[]>()
const actionContentMap = new Map<string, ActionWithContext[]>()

function hashContent(content: unknown[] | undefined): string {
  if (!content || !Array.isArray(content)) return ''
  return JSON.stringify(
    content.map((c: any) => ({
      type: c.type,
      value: typeof c.value === 'string' ? c.value : JSON.stringify(c.value),
    }))
  )
}

function normalizeActionForComparison(action: ActionWithContext): string {
  // Create a normalized version for comparison (excluding id and source info)
  return JSON.stringify({
    name: action.name,
    content: hashContent(action.content as unknown[]),
    activationCost: action.activationCost,
    actionType: action.actionType,
    range: action.range,
    damage: action.damage,
    traits: action.traits,
  })
}

for (const file of dataFiles) {
  const filePath = path.join(__dirname, '..', file)
  if (!fs.existsSync(filePath)) continue

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const schemaName = path.basename(file, '.json')

  for (const entity of data) {
    if (entity.actions && Array.isArray(entity.actions)) {
      for (const action of entity.actions) {
        const actionWithContext: ActionWithContext = {
          ...action,
          _sourceSchema: schemaName,
          _sourceEntity: entity.name || entity.id,
          _sourceEntityId: entity.id,
        }
        allActions.push(actionWithContext)

        if (!actionMap.has(action.name)) {
          actionMap.set(action.name, [])
        }
        actionMap.get(action.name)!.push(actionWithContext)

        const contentHash = hashContent(action.content)
        if (contentHash) {
          if (!actionContentMap.has(contentHash)) {
            actionContentMap.set(contentHash, [])
          }
          actionContentMap.get(contentHash)!.push(actionWithContext)
        }
      }
    }
  }
}

console.log(`Total actions found: ${allActions.length}`)
console.log(`Unique action names: ${actionMap.size}`)
console.log(`\n=== Actions with duplicate names ===\n`)

const duplicatesByName = Array.from(actionMap.entries())
  .filter(([, actions]) => actions.length > 1)
  .sort((a, b) => b[1].length - a[1].length)

for (const [name, actions] of duplicatesByName.slice(0, 30)) {
  console.log(`"${name}" appears ${actions.length} times:`)
  for (const action of actions) {
    console.log(`  - ${action._sourceSchema}/${action._sourceEntity} (id: ${action.id})`)
  }
  console.log('')
}

console.log(`\n=== Actions with identical content ===\n`)

const duplicatesByContent = Array.from(actionContentMap.entries())
  .filter(([, actions]) => actions.length > 1 && actions[0]._sourceSchema !== 'chassis-abilities')
  .sort((a, b) => b[1].length - a[1].length)

for (const [, actions] of duplicatesByContent.slice(0, 20)) {
  if (actions.length > 1) {
    console.log(`Content appears ${actions.length} times:`)
    for (const action of actions) {
      console.log(
        `  - "${action.name}" in ${action._sourceSchema}/${action._sourceEntity} (id: ${action.id})`
      )
    }
    console.log('')
  }
}

// Find very similar actions (same name, similar properties)
console.log(`\n=== Very similar actions (same name, similar properties) ===\n`)

const similarActions = new Map<string, ActionWithContext[]>()

for (const [name, actions] of actionMap.entries()) {
  if (actions.length > 1) {
    // Group by normalized action
    const normalizedGroups = new Map<string, ActionWithContext[]>()
    for (const action of actions) {
      const normalized = normalizeActionForComparison(action)
      if (!normalizedGroups.has(normalized)) {
        normalizedGroups.set(normalized, [])
      }
      normalizedGroups.get(normalized)!.push(action)
    }

    // Find groups with multiple actions (very similar)
    for (const [, group] of normalizedGroups.entries()) {
      if (group.length > 1) {
        const key = `${name} (${group.length} identical)`
        similarActions.set(key, group)
      }
    }
  }
}

for (const [key, actions] of Array.from(similarActions.entries()).slice(0, 20)) {
  console.log(`${key}:`)
  for (const action of actions) {
    console.log(`  - ${action._sourceSchema}/${action._sourceEntity} (id: ${action.id})`)
  }
  console.log('')
}

console.log(`\n=== Summary ===\n`)
console.log(`Total actions: ${allActions.length}`)
console.log(`Unique action names: ${actionMap.size}`)
console.log(`Actions with duplicate names: ${duplicatesByName.length}`)
console.log(`Actions with duplicate content: ${duplicatesByContent.length}`)
console.log(`Very similar actions (same name + properties): ${similarActions.size}`)
