---
type: 'always_apply'
---

# TypeScript Rules

## Strict Mode

- **Enabled**: `strict: true` in `tsconfig.json`
- **No unused locals/parameters**: Enforced via `noUnusedLocals` and `noUnusedParameters`
- **Verbatim module syntax**: Use `import type` for type-only imports

  ```typescript
  // ✅ Correct
  import type { SURefEntity } from 'salvageunion-reference'

  // ❌ Wrong
  import { SURefEntity } from 'salvageunion-reference'
  ```

- **NEVER use `any`** - Always use specific types
- **Avoid `unknown`** - Prefer specific types or type guards when possible
- **Avoid typing returns** - Let TypeScript infer return types wherever possible

  ```typescript
  // ✅ Correct - inferred return type
  function calculateTotal(items: Item[]) {
    return items.reduce((sum, item) => sum + item.price, 0)
  }

  // ❌ Wrong - unnecessary explicit return type
  function calculateTotal(items: Item[]): number {
    return items.reduce((sum, item) => sum + item.price, 0)
  }
  ```

- **NEVER use `any`** - Always use specific types
- **Avoid `unknown`** - Prefer specific types or type guards when possible

## Type Imports

- Always use `type` keyword for type-only imports (required by `verbatimModuleSyntax`)
- Import types from `salvageunion-reference` package for game data
- Import database types from `src/types/database-generated.types.ts`

## Documentation

- **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook/intro.html
- **tsconfig reference**: https://www.typescriptlang.org/tsconfig
