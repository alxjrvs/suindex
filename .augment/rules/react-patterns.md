---
type: 'always_apply'
---

# React Component Patterns

## Component Structure

```typescript
// 1. Imports (grouped)
import { Box, Flex } from '@chakra-ui/react'
import { useState, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { SURefEntity } from 'salvageunion-reference'

// 2. Types/Interfaces
interface MyComponentProps {
  data: SURefEntity
  onUpdate: (id: string) => void
}

// 3. Component
export function MyComponent({ data, onUpdate }: MyComponentProps) {
  // Hooks first
  const [state, setState] = useState(false)
  const navigate = useNavigate()

  // Callbacks
  const handleClick = useCallback(() => {
    onUpdate(data.id)
  }, [data.id, onUpdate])

  // Render
  return <Box>...</Box>
}
```

## Import Order

1. Chakra UI components
2. React hooks
3. TanStack Router hooks (`useNavigate`, `useParams`, `useSearch`, etc.)
4. Third-party libraries
5. Local components
6. Utils/helpers
7. Types (with `import type`)

## State Management

- **Local state**: `useState` for component-specific state
- **TanStack Query**: Resource-specific hooks organized by entity type
  - `src/hooks/pilot/` - Pilot hooks (usePilot, useUpdatePilot, useHydratedPilot)
  - `src/hooks/mech/` - Mech hooks (useMech, useUpdateMech, useHydratedMech)
  - `src/hooks/crawler/` - Crawler hooks (useCrawler, useUpdateCrawler, useHydratedCrawler)
  - `src/hooks/entity/` - Entity hooks (useEntitiesFor, usePlayerChoices)
  - `src/hooks/cargo/` - Cargo hooks (useCargo, useCreateCargo, useDeleteCargo)
- **Auto-save**: Debounced updates to Supabase (300ms delay)

## Component Organization

- **Base components**: `src/components/base/` (Text, Heading)
- **Shared components**: `src/components/shared/` (reusable across features)
- **Feature components**: `src/components/[Feature]/` (MechLiveSheet, PilotLiveSheet)
- **Entity displays**: `src/components/entity/EntityDisplay/`

## Lazy Loading

```typescript
// For complex components
const HeavyComponent = lazy(() =>
  import('./HeavyComponent').then((m) => ({ default: m.HeavyComponent }))
)
```

## Documentation

- **React docs**: https://react.dev/
- **React hooks**: https://react.dev/reference/react/hooks
