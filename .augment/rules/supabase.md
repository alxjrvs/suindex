---
type: 'context_file'
paths: ['src/lib/api/**/*.ts', 'src/lib/supabase.ts', 'src/types/database-generated.types.ts']
---

# Supabase Database

## Configuration

- **Client**: `src/lib/supabase.ts`
- **Project ID**: `opxrguskxuogghzcnppk`
- **Region**: `us-east-2`
- **Auth flow**: PKCE with auto-refresh

## Type Generation

```bash
# Generate types from Supabase schema
bun run gen:types
```

- **Output**: `src/types/database-generated.types.ts`
- **Never edit this file manually** - always regenerate from schema

## Type Usage

```typescript
import type { Tables, TablesInsert } from '../types/database-generated.types'

// Table row type
type PilotRow = Tables<'pilots'>

// Insert type (for creating new rows)
type PilotInsert = TablesInsert<'pilots'>
```

## API Pattern

- **Location**: `src/lib/api/` (organized by entity type)
- **Pattern**: Export typed functions for CRUD operations

```typescript
// Example: src/lib/api/pilots.ts
export async function fetchPilot(id: string): Promise<PilotRow> {
  const { data, error } = await supabase.from('pilots').select('*').eq('id', id).single()

  if (error) throw error
  return data
}
```

## Environment Variables

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Documentation

- **Supabase docs**: https://supabase.com/docs
- **JS client**: https://supabase.com/docs/reference/javascript
- **Type generation**: https://supabase.com/docs/guides/api/rest/generating-types
