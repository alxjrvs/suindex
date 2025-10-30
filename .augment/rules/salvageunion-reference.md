---
type: 'always_apply'
---

# Salvage Union Reference Package

## Source of Truth

- **Package**: `salvageunion-reference` (npm: `@randsum/salvageunion`)
- **Version**: See `package.json` for current version
- **ALL game data types come from this package** - never create custom types for game entities

## Type Imports

```typescript
// ✅ Always import types from salvageunion-reference
import type {
  SURefEntity,
  SURefSchemaName,
  SURefChassis,
  SURefAbility,
  SURefMetaEntity
} from 'salvageunion-reference'

// ❌ Never create custom types for game data
type Chassis = { name: string; ... } // WRONG
```

## Data Access

```typescript
import { SalvageUnionReference } from 'salvageunion-reference'

// Find single entity
const chassis = SalvageUnionReference.findIn('chassis', (c) => c.id === 'mule')

// Find all matching entities
const allChassis = SalvageUnionReference.findAllIn('chassis', () => true)

// Get schema catalog
const catalog = getSchemaCatalog()
```

## Schema Names

- Use `SURefSchemaName` type for valid schema names
- Valid schemas: `'chassis'`, `'systems'`, `'modules'`, `'abilities'`, `'classes.core'`, etc.
- `SURefMetaSchemaName` and `SURefMetaEntity` are types used to track not only the official schema, but entity-like sub schema, i.e. 'actions`.
- See `getSchemaCatalog()` for complete list

## Helper Pattern

- Create helpers in `src/utils/referenceDataHelpers.ts` for common queries
- Example: `getAllClasses()`, `findClassById()`, `getChassis()`

## Documentation

- **Package docs**: https://www.npmjs.com/package/@randsum/salvageunion
- **Source**: https://github.com/randsum/salvageunion
