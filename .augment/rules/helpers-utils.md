---
type: 'context_file'
paths:
  ['src/utils/**/*.ts', 'src/constants/**/*.ts', 'src/components/entity/entityDisplayHelpers.ts']
---

# Helpers & Utilities

## Organization

- **Entity helpers**: `src/components/entity/entityDisplayHelpers.ts`
- **Reference helpers**: `src/utils/referenceDataHelpers.ts`
- **Reference utils**: `src/utils/referenceUtils.ts`
- **Game constants**: `src/constants/gameRules.ts`

## Helper Pattern

```typescript
// Pure functions with JSDoc
/**
 * Extract tech level from entity data
 */
export function extractTechLevel(data: SURefMetaEntity): number | undefined {
  if ('stats' in data && typeof data.stats === 'object' && data.stats) {
    return (data.stats as { techLevel?: number }).techLevel
  }
  return undefined
}
```

## When to Extract

- Function used in 2+ files → Extract to helper
- Complex logic (>10 lines) → Extract to helper
- Pure calculation → Extract to helper
- Keep inline: Simple one-liners, component-specific logic

## Constants

```typescript
// src/constants/gameRules.ts
export const PILOT_DEFAULTS = {
  maxHP: 10,
  maxAP: 5,
} as const

export const DEBOUNCE_TIMINGS = {
  autoSave: 300,
  search: 300,
} as const
```

## Naming

- **Extractors**: `extract*` (e.g., `extractTechLevel`)
- **Getters**: `get*` (e.g., `getSchemaDisplayName`)
- **Checkers**: `has*`, `is*` (e.g., `hasPageReference`)
- **Calculators**: `calculate*` (e.g., `calculateBackgroundColor`)
