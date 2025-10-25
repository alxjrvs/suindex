# Refactoring Quick Start Guide

## Overview

This guide provides concrete implementation steps for the refactoring opportunities identified in `REFACTORING_ANALYSIS.md`.

---

## Phase 1: High Impact Refactorings

### 1. Entity Display Wrappers → Factory Pattern

**Goal:** Eliminate 19 wrapper files, reduce ~200 lines

**Step 1:** Create configuration file

```typescript
// src/components/schema/entities/entityDisplayConfig.ts
import type { SURefEntityName } from 'salvageunion-reference'

interface EntityDisplayConfig {
  headerColor?: string
  actionHeaderBgColor?: string
  actionHeaderTextColor?: string
}

export const ENTITY_DISPLAY_CONFIGS: Record<SURefEntityName, EntityDisplayConfig> = {
  NPC: { actionHeaderBgColor: 'su.green', actionHeaderTextColor: 'white' },
  Creature: { headerColor: 'su.orange' },
  BioTitan: { actionHeaderBgColor: 'su.orange', actionHeaderTextColor: 'su.white' },
  Drone: {},
  Vehicle: {},
  Squad: {},
  Meld: {},
  System: {},
  Module: {},
  Equipment: {},
  Keyword: {},
  Trait: {},
  RollTable: { headerColor: 'su.orange' },
  Crawler: {
    headerColor: 'su.pink',
    actionHeaderBgColor: 'su.pink',
    actionHeaderTextColor: 'white',
  },
  Chassis: { headerColor: 'su.green' },
  Class: {}, // Special case - has custom children
  Ability: {}, // Special case - has custom logic
  AbilityTreeRequirement: {},
  CrawlerBay: {},
  CrawlerTechLevel: {},
}
```

**Step 2:** Update component registry

```typescript
// src/components/componentRegistry.ts
import { EntityDisplay } from './shared/EntityDisplay'
import { ENTITY_DISPLAY_CONFIGS } from './schema/entities/entityDisplayConfig'
import type { SURefEntity, SURefEntityName } from 'salvageunion-reference'

// Factory function for simple entity displays
function createEntityDisplay(entityName: SURefEntityName) {
  return ({ data }: { data: SURefEntity }) => {
    const config = ENTITY_DISPLAY_CONFIGS[entityName]
    return <EntityDisplay entityName={entityName} data={data} {...config} />
  }
}

// Special cases that need custom components
import { ClassDisplay } from './schema/entities/ClassDisplay'
import { AbilityDisplay } from './schema/entities/AbilityDisplay'
import { ChassisDisplay } from './schema/entities/ChassisDisplay'
import { CrawlerBayDisplay } from './schema/entities/CrawlerBayDisplay'

export const componentRegistry: Record<string, DisplayComponentType> = {
  // Simple displays using factory
  npcs: createEntityDisplay('NPC'),
  creatures: createEntityDisplay('Creature'),
  'bio-titans': createEntityDisplay('BioTitan'),
  drones: createEntityDisplay('Drone'),
  vehicles: createEntityDisplay('Vehicle'),
  squads: createEntityDisplay('Squad'),
  meld: createEntityDisplay('Meld'),
  systems: createEntityDisplay('System'),
  modules: createEntityDisplay('Module'),
  equipment: createEntityDisplay('Equipment'),
  keywords: createEntityDisplay('Keyword'),
  traits: createEntityDisplay('Trait'),
  'roll-tables': createEntityDisplay('RollTable'),
  crawlers: createEntityDisplay('Crawler'),

  // Special cases with custom components
  classes: ClassDisplay,
  abilities: AbilityDisplay,
  chassis: ChassisDisplay,
  'crawler-bays': CrawlerBayDisplay,
  'crawler-tech-levels': createEntityDisplay('CrawlerTechLevel'),
  'ability-tree-requirements': createEntityDisplay('AbilityTreeRequirement'),
}
```

**Step 3:** Delete old wrapper files

```bash
# After verifying everything works
rm src/components/schema/entities/NPCDisplay.tsx
rm src/components/schema/entities/CreatureDisplay.tsx
rm src/components/schema/entities/BioTitanDisplay.tsx
# ... etc for all simple wrappers
```

---

### 2. Control Bars → Generic Component

**Goal:** Eliminate 2 files, reduce ~110 lines

**Step 1:** Create generic control bar

```typescript
// src/components/shared/LiveSheetControlBar.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { SheetSelect } from './SheetSelect'
import { ControlBarContainer } from './ControlBarContainer'
import { LinkButton } from './LinkButton'

interface ControlBarConfig {
  table: string
  selectFields: string
  nameField: string
  label: string
  backgroundColor: string
  linkLabel: string
  linkPath: (id: string) => string
}

interface LiveSheetControlBarProps {
  config: ControlBarConfig
  relationId?: string | null
  savedRelationId?: string | null
  onRelationChange: (id: string | null) => void
  hasPendingChanges?: boolean
}

export function LiveSheetControlBar({
  config,
  relationId,
  savedRelationId,
  onRelationChange,
  hasPendingChanges = false,
}: LiveSheetControlBarProps) {
  const [items, setItems] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) return

        const { data } = await supabase
          .from(config.table)
          .select(config.selectFields)
          .eq('user_id', userData.user.id)
          .order(config.nameField)

        if (data) {
          setItems(data.map(item => ({
            id: item.id,
            name: item[config.nameField]
          })))
        }
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [config.table, config.selectFields, config.nameField])

  return (
    <ControlBarContainer
      backgroundColor={config.backgroundColor}
      hasPendingChanges={hasPendingChanges}
      leftContent={
        <SheetSelect
          label={config.label}
          value={relationId ?? null}
          loading={loading}
          options={items}
          onChange={onRelationChange}
          placeholder={`No ${config.label}`}
        />
      }
      rightContent={
        savedRelationId && (
          <LinkButton to={config.linkPath(savedRelationId)} label={config.linkLabel} />
        )
      }
    />
  )
}
```

**Step 2:** Create config constants

```typescript
// src/components/shared/controlBarConfigs.ts
import type { ControlBarConfig } from './LiveSheetControlBar'

export const PILOT_CONTROL_BAR_CONFIG: ControlBarConfig = {
  table: 'crawlers',
  selectFields: 'id, name, game_id',
  nameField: 'name',
  label: 'Crawler',
  backgroundColor: 'bg.builder.pilot',
  linkLabel: '→ Crawler',
  linkPath: (id) => `/dashboard/crawlers/${id}`,
}

export const MECH_CONTROL_BAR_CONFIG: ControlBarConfig = {
  table: 'pilots',
  selectFields: 'id, callsign',
  nameField: 'callsign',
  label: 'Pilot',
  backgroundColor: 'bg.builder.mech',
  linkLabel: '→ Pilot',
  linkPath: (id) => `/dashboard/pilots/${id}`,
}

export const CRAWLER_CONTROL_BAR_CONFIG: ControlBarConfig = {
  table: 'games',
  selectFields: 'id, name',
  nameField: 'name',
  label: 'Game',
  backgroundColor: 'bg.builder.crawler',
  linkLabel: '→ Game',
  linkPath: (id) => `/dashboard/games/${id}`,
}
```

**Step 3:** Update LiveSheet components

```typescript
// src/components/PilotLiveSheet/index.tsx
import { LiveSheetControlBar } from '../shared/LiveSheetControlBar'
import { PILOT_CONTROL_BAR_CONFIG } from '../shared/controlBarConfigs'

// Replace PilotControlBar with:
<LiveSheetControlBar
  config={PILOT_CONTROL_BAR_CONFIG}
  relationId={pilot.crawler_id}
  savedRelationId={savedCrawlerId}
  onRelationChange={(crawlerId) => updatePilot({ crawler_id: crawlerId })}
  hasPendingChanges={hasPendingChanges}
/>
```

**Step 4:** Delete old control bars

```bash
rm src/components/PilotLiveSheet/PilotControlBar.tsx
rm src/components/MechLiveSheet/MechControlBar.tsx
# Keep CrawlerControlBar.tsx for now as it has special game member logic
```

---

### 3. New Entity Modals → Generic Form Modal

**Goal:** Eliminate 2 files, reduce ~680 lines

**Step 1:** Create form field types

```typescript
// src/components/shared/FormModal/types.ts
export type FormFieldType = 'text' | 'textarea' | 'select' | 'relationship'

export interface FormField {
  name: string
  label: string
  type: FormFieldType
  required?: boolean
  placeholder?: string
  options?: Array<{ id: string; name: string }>
  relationshipConfig?: {
    table: string
    selectFields: string
    nameField: string
    filterField?: string
    filterValue?: string
  }
}

export interface FormModalConfig {
  title: string
  table: string
  backgroundColor: string
  fields: FormField[]
  submitLabel: string
}
```

**Step 2:** Create generic form modal (see next section for full implementation)

**Step 3:** Create config for each entity type

```typescript
// src/components/Dashboard/formModalConfigs.ts
export const NEW_PILOT_CONFIG: FormModalConfig = {
  title: 'Create New Pilot',
  table: 'pilots',
  backgroundColor: 'bg.builder',
  submitLabel: 'Create Pilot',
  fields: [
    {
      name: 'callsign',
      label: 'Callsign',
      type: 'text',
      required: true,
      placeholder: 'Enter pilot callsign...',
    },
    { name: 'class_id', label: 'Class', type: 'select', options: [] }, // Populated from SalvageUnionReference
    { name: 'keepsake', label: 'Keepsake', type: 'textarea', placeholder: 'Enter keepsake...' },
    { name: 'motto', label: 'Motto', type: 'textarea', placeholder: 'Enter motto...' },
    {
      name: 'background',
      label: 'Background',
      type: 'textarea',
      placeholder: 'Enter background...',
    },
    {
      name: 'appearance',
      label: 'Appearance',
      type: 'textarea',
      placeholder: 'Enter appearance...',
    },
    {
      name: 'crawler_id',
      label: 'Crawler',
      type: 'relationship',
      relationshipConfig: {
        table: 'crawlers',
        selectFields: 'id, name',
        nameField: 'name',
      },
    },
  ],
}
```

---

### 4. useEntityRelationships Hook

**Goal:** Reduce ~150 lines across multiple files

**Implementation:**

```typescript
// src/hooks/useEntityRelationships.ts
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface UseEntityRelationshipsConfig {
  table: string
  selectFields?: string
  orderBy?: string
  filterField?: string
  filterValue?: string
}

export function useEntityRelationships<T = { id: string; name: string }>(
  config: UseEntityRelationshipsConfig
) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      let query = supabase
        .from(config.table)
        .select(config.selectFields || 'id, name')
        .eq('user_id', userData.user.id)

      if (config.filterField && config.filterValue) {
        query = query.eq(config.filterField, config.filterValue)
      }

      if (config.orderBy) {
        query = query.order(config.orderBy)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError
      if (data) setItems(data as T[])
    } catch (err) {
      console.error(`Error loading ${config.table}:`, err)
      setError(err instanceof Error ? err.message : `Failed to load ${config.table}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [config.table, config.selectFields, config.orderBy, config.filterField, config.filterValue])

  return { items, loading, error, reload: load }
}
```

**Usage:**

```typescript
// In any component that needs to load relationships
const { items: crawlers, loading: loadingCrawlers } = useEntityRelationships({
  table: 'crawlers',
  selectFields: 'id, name, game_id',
  orderBy: 'name',
})
```

---

## Testing Strategy

### For Each Refactoring:

1. **Create new component/hook alongside existing**
2. **Write tests for new component**
3. **Migrate one consumer at a time**
4. **Run full test suite after each migration**
5. **Delete old component only after all consumers migrated**

### Example Test Migration:

```typescript
// Before
import { PilotControlBar } from './PilotControlBar'

// After
import { LiveSheetControlBar } from '../shared/LiveSheetControlBar'
import { PILOT_CONTROL_BAR_CONFIG } from '../shared/controlBarConfigs'

// Update test to use new component with config
```

---

## Rollback Plan

If any refactoring causes issues:

1. **Revert the specific commit** (each refactoring should be a separate commit)
2. **Keep the new shared component** for future use
3. **Document the issue** for future reference
4. **Re-attempt with adjusted approach**

---

## Success Metrics

Track these metrics before and after each phase:

- **Lines of Code:** Total LOC in affected directories
- **File Count:** Number of files in affected directories
- **Test Coverage:** Ensure coverage doesn't decrease
- **Build Time:** Should not increase significantly
- **Bundle Size:** Should decrease or stay the same

---

## Next Steps

1. Review `REFACTORING_ANALYSIS.md` for detailed analysis
2. Choose a Phase 1 refactoring to start with
3. Create a feature branch
4. Implement following the steps above
5. Test thoroughly
6. Submit PR with clear description of changes
7. Repeat for next refactoring

---

## Questions?

Refer to:

- `REFACTORING_ANALYSIS.md` - Detailed analysis
- Existing patterns in codebase (e.g., `useLiveSheetState`, `GridLayout`)
- Team for architectural decisions
