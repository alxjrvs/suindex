# Deep Dive: Refactoring Analysis

## Executive Summary

This analysis identifies opportunities to reduce duplication, extract patterns, and combine components across the Salvage Union Index application. The codebase shows good architectural patterns but has significant duplication in several areas.

## 1. Components That Can Be Combined

### 1.1 Entity Display Wrappers (HIGH PRIORITY)

**Current State:** 19 nearly identical wrapper components in `src/components/schema/entities/`

**Files:**
- `NPCDisplay.tsx`, `CreatureDisplay.tsx`, `BioTitanDisplay.tsx`, `DroneDisplay.tsx`
- `VehicleDisplay.tsx`, `SquadDisplay.tsx`, `MeldDisplay.tsx`
- `SystemDisplay.tsx`, `ModuleDisplay.tsx`, `EquipmentDisplay.tsx`
- `KeywordDisplay.tsx`, `TraitDisplay.tsx`, `RollTableDisplay.tsx`
- `CrawlerDisplay.tsx`, `ChassisDisplay.tsx`
- And more...

**Pattern:**
```typescript
// Current: 10-17 lines per file × 19 files = ~250 lines
export function NPCDisplay({ data }: NPCDisplayProps) {
  return (
    <EntityDisplay
      entityName="NPC"
      data={data}
      actionHeaderBgColor="su.green"
      actionHeaderTextColor="white"
    />
  )
}
```

**Recommendation:** Create a factory function or configuration-based approach

```typescript
// Proposed: Single file with configuration
const ENTITY_DISPLAY_CONFIG: Record<SURefEntityName, EntityDisplayConfig> = {
  NPC: { actionHeaderBg: 'su.green', actionHeaderText: 'white' },
  Creature: { headerColor: 'su.orange' },
  BioTitan: { actionHeaderBg: 'su.orange', actionHeaderText: 'su.white' },
  // ... etc
}

export function createEntityDisplay(entityName: SURefEntityName) {
  return ({ data }: { data: SURefEntity }) => {
    const config = ENTITY_DISPLAY_CONFIG[entityName]
    return <EntityDisplay entityName={entityName} data={data} {...config} />
  }
}
```

**Impact:** Reduce ~250 lines to ~50 lines, eliminate 19 files

---

### 1.2 Grid Card Components (MEDIUM PRIORITY)

**Current State:** 4 similar grid card components with slight variations

**Files:**
- `PilotGridCard.tsx` (45 lines)
- `MechGridCard.tsx` (37 lines)
- `CrawlerGridCard.tsx` (33 lines)
- `GameGridCard.tsx` (61 lines)

**Pattern:** All use `GridCard` wrapper with similar structure:
- Title/heading
- Subtitle/secondary info
- Stats/metadata at bottom

**Recommendation:** Create a generic `EntityGridCard` component

```typescript
interface EntityGridCardProps {
  title: string
  subtitle?: string
  stats?: Array<{ label: string; value: string | number }>
  cells?: Array<DataCellProps> // For GameGridCard
  onClick: () => void
  isLoading?: boolean
}

export function EntityGridCard({ title, subtitle, stats, cells, onClick, isLoading }: EntityGridCardProps) {
  // Unified implementation
}
```

**Impact:** Reduce ~176 lines to ~80 lines, eliminate 3 files

---

### 1.3 Control Bar Components (HIGH PRIORITY)

**Current State:** 3 nearly identical control bar components

**Files:**
- `PilotControlBar.tsx` (68 lines)
- `MechControlBar.tsx` (64 lines)
- `CrawlerControlBar.tsx` (78 lines)

**Duplication:**
- Same structure: fetch related entities, render SheetSelect + LinkButton
- Same loading/state management pattern
- Only differences: table name, field names, colors

**Recommendation:** Create generic `LiveSheetControlBar` component

```typescript
interface ControlBarConfig {
  entityType: 'pilot' | 'mech' | 'crawler'
  relationTable: string
  relationField: string
  relationLabel: string
  backgroundColor: string
  linkLabel: string
  linkPath: (id: string) => string
}

export function LiveSheetControlBar({
  config,
  relationId,
  savedRelationId,
  onRelationChange,
  hasPendingChanges
}: LiveSheetControlBarProps) {
  // Generic implementation with config-driven behavior
}
```

**Impact:** Reduce ~210 lines to ~100 lines, eliminate 2 files

---

### 1.4 Resource Stepper Components (MEDIUM PRIORITY)

**Current State:** 3 similar resource stepper components

**Files:**
- `PilotResourceSteppers.tsx` (52 lines)
- `MechResourceSteppers.tsx` (53 lines)
- `CrawlerResourceSteppers.tsx` (75 lines)

**Pattern:** All wrap `NumericStepper` components in `RoundedBox` with different resources

**Recommendation:** Create generic `ResourceSteppersBox` component

```typescript
interface ResourceConfig {
  label: string
  value: number
  onChange: (value: number) => void
  max?: number
  min?: number
  step?: number
}

interface ResourceSteppersBoxProps {
  resources: ResourceConfig[]
  backgroundColor: string
  borderColor?: string
  layout?: 'vertical' | 'grid'
  disabled?: boolean
}
```

**Impact:** Reduce ~180 lines to ~70 lines, eliminate 2 files

---

### 1.5 New Entity Modal Components (HIGH PRIORITY)

**Current State:** 3 very similar modal components with massive duplication

**Files:**
- `NewPilotModal.tsx` (378 lines)
- `NewMechModal.tsx` (294 lines)
- `NewCrawlerModal.tsx` (260 lines)

**Duplication:**
- Same form structure and validation
- Same loading/error state management
- Same submit/close handlers
- Same game/crawler/pilot relationship loading

**Recommendation:** Create generic `NewEntityModal` component with form configuration

```typescript
interface FormField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select'
  required?: boolean
  options?: Array<{ id: string; name: string }>
  placeholder?: string
}

interface NewEntityModalConfig {
  title: string
  table: string
  backgroundColor: string
  fields: FormField[]
  relationships?: RelationshipConfig[]
}

export function NewEntityModal({ config, isOpen, onClose, onSuccess }: NewEntityModalProps) {
  // Generic form handling with config-driven fields
}
```

**Impact:** Reduce ~932 lines to ~250 lines, eliminate 2 files

---

## 2. Patterns That Can Be Extracted

### 2.1 Entity Relationship Loading Pattern (HIGH PRIORITY)

**Current Duplication:** Found in all control bars and modals

**Pattern:**
```typescript
// Repeated in 6+ files
useEffect(() => {
  const fetchRelated = async () => {
    try {
      setLoading(true)
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return
      
      const { data } = await supabase
        .from(table)
        .select('id, name')
        .eq('user_id', userData.user.id)
        .order('name')
      
      if (data) setItems(data)
    } finally {
      setLoading(false)
    }
  }
  fetchRelated()
}, [])
```

**Recommendation:** Create `useEntityRelationships` hook

```typescript
export function useEntityRelationships(table: string, selectFields: string = 'id, name') {
  const [items, setItems] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    // Generic implementation
  }, [table, selectFields])
  
  return { items, loading, reload }
}
```

**Impact:** Eliminate ~150 lines of duplicated code across 6+ files

---

### 2.2 Form State Management Pattern (MEDIUM PRIORITY)

**Current Duplication:** All modal components have identical form state patterns

**Pattern:**
```typescript
// Repeated in NewPilotModal, NewMechModal, NewCrawlerModal
const [field1, setField1] = useState('')
const [field2, setField2] = useState('')
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

const handleSubmit = async () => {
  // Validation
  // Submit to Supabase
  // Reset form
  // Close modal
}

const handleClose = () => {
  // Reset all fields
  // Clear error
  // Call onClose
}
```

**Recommendation:** Create `useFormState` hook

```typescript
export function useFormState<T extends Record<string, any>>(
  initialState: T,
  onSubmit: (values: T) => Promise<void>
) {
  const [values, setValues] = useState<T>(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)
      await onSubmit(values)
      setValues(initialState)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  const reset = () => {
    setValues(initialState)
    setError(null)
  }
  
  return { values, setValues, loading, error, handleSubmit, reset }
}
```

**Impact:** Simplify form components by ~50 lines each

---

### 2.3 LiveSheet State Management Pattern (LOW PRIORITY - Already Extracted)

**Status:** ✅ Already well-extracted in `useLiveSheetState` hook

The application already has excellent extraction of the LiveSheet state pattern:
- `useLiveSheetState` (generic hook)
- `usePilotLiveSheetState`, `useMechLiveSheetState`, `useCrawlerLiveSheetState` (specific implementations)

This is a good example of the pattern to follow for other extractions.

---

### 2.4 Grid Layout Pattern (LOW PRIORITY - Already Extracted)

**Status:** ✅ Already well-extracted in `GridLayout` component

The `GridLayout` component successfully extracts the common grid pattern used across:
- `PilotsGrid`
- `MechsGrid`
- `CrawlersGrid`
- `GamesGrid`

---

## 3. Duplication That Can Be Avoided

### 3.1 Supabase Insert Pattern (MEDIUM PRIORITY)

**Current Duplication:** Every modal has nearly identical insert logic

**Pattern:**
```typescript
// Repeated in 3+ modals
const { data: { user } } = await supabase.auth.getUser()
if (!user) throw new Error('Not authenticated')

const { error: insertError } = await supabase.from(table).insert({
  ...fields,
  user_id: user.id,
})

if (insertError) throw insertError
```

**Recommendation:** Create `useSupabaseInsert` hook

```typescript
export function useSupabaseInsert<T>(table: string) {
  const insert = async (data: Omit<T, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')
    
    const { error } = await supabase.from(table).insert({
      ...data,
      user_id: user.id,
    })
    
    if (error) throw error
  }
  
  return { insert }
}
```

---

### 3.2 Error Display Component (LOW PRIORITY)

**Current Duplication:** Error boxes repeated in every modal

**Pattern:**
```typescript
// Repeated in 3+ modals
{error && (
  <Box
    bg="red.100"
    borderWidth="1px"
    borderColor="red.400"
    color="red.700"
    px={4}
    py={3}
    borderRadius="md"
  >
    {error}
  </Box>
)}
```

**Recommendation:** Create `ErrorAlert` component

```typescript
export function ErrorAlert({ error }: { error: string | null }) {
  if (!error) return null
  
  return (
    <Box
      bg="red.100"
      borderWidth="1px"
      borderColor="red.400"
      color="red.700"
      px={4}
      py={3}
      borderRadius="md"
    >
      {error}
    </Box>
  )
}
```

---

### 3.3 Modal Button Footer Pattern (LOW PRIORITY)

**Current Duplication:** Cancel/Submit button pattern repeated in every modal

**Pattern:**
```typescript
// Repeated in 4+ modals
<Flex gap={2} justifyContent="flex-end" pt={2}>
  <Button onClick={handleClose} disabled={loading} bg="su.brick" color="su.white">
    Cancel
  </Button>
  <Button onClick={handleSubmit} disabled={!isValid || loading} bg="su.orange" color="su.white">
    {loading ? 'Creating...' : 'Create'}
  </Button>
</Flex>
```

**Recommendation:** Create `ModalActions` component

```typescript
interface ModalActionsProps {
  onCancel: () => void
  onSubmit: () => void
  submitLabel: string
  loading?: boolean
  disabled?: boolean
}

export function ModalActions({ onCancel, onSubmit, submitLabel, loading, disabled }: ModalActionsProps) {
  // Unified implementation
}
```

---

## 4. Priority Recommendations

### Phase 1: High Impact, Low Risk
1. **Combine Entity Display Wrappers** - Eliminate 19 files, ~200 lines saved
2. **Extract Control Bar Pattern** - Eliminate 2 files, ~110 lines saved
3. **Extract New Entity Modal Pattern** - Eliminate 2 files, ~680 lines saved
4. **Create useEntityRelationships hook** - ~150 lines saved across multiple files

**Total Phase 1 Savings:** ~1,140 lines, 23 files eliminated

### Phase 2: Medium Impact, Medium Risk
1. **Combine Grid Card Components** - Eliminate 3 files, ~96 lines saved
2. **Extract Resource Stepper Pattern** - Eliminate 2 files, ~110 lines saved
3. **Create useFormState hook** - ~150 lines saved across multiple files
4. **Create useSupabaseInsert hook** - ~50 lines saved

**Total Phase 2 Savings:** ~406 lines, 5 files eliminated

### Phase 3: Low Impact, Low Risk (Polish)
1. **Create ErrorAlert component** - ~30 lines saved
2. **Create ModalActions component** - ~40 lines saved
3. **Extract other small patterns** - ~50 lines saved

**Total Phase 3 Savings:** ~120 lines

---

## 5. Overall Impact

**Total Potential Savings:**
- **Lines of Code:** ~1,666 lines reduced
- **Files Eliminated:** 28 files
- **Maintainability:** Significantly improved - changes to patterns only need to be made once
- **Consistency:** Enforced through shared components
- **Testing:** Easier - test shared components once instead of testing duplicates

**Risk Assessment:**
- Phase 1: Low risk - mostly wrapper elimination
- Phase 2: Medium risk - requires careful API design
- Phase 3: Low risk - cosmetic improvements

---

## 6. Implementation Notes

### Testing Strategy
1. Create new shared components alongside existing ones
2. Migrate one consumer at a time
3. Run full test suite after each migration
4. Remove old components only after all consumers migrated

### Breaking Changes
- Most refactorings can be done without breaking changes
- Entity Display wrappers might need component registry updates
- Control bars and modals are internal components, low breaking change risk

### Code Review Checklist
- [ ] All existing tests still pass
- [ ] New shared components have comprehensive tests
- [ ] TypeScript types are properly generic
- [ ] Documentation updated for new patterns
- [ ] No regression in functionality
- [ ] Performance not degraded

---

## 7. Additional Observations

### Good Patterns Already in Place
1. ✅ `useLiveSheetState` - Excellent generic hook pattern
2. ✅ `GridLayout` - Good extraction of grid pattern
3. ✅ `ControlBarContainer` - Good separation of layout from logic
4. ✅ `EntityDisplay` - Comprehensive entity display with helpers
5. ✅ Shared UI components (`RoundedBox`, `SheetDisplay`, `StatDisplay`, etc.)

### Architecture Strengths
- Clear separation between LiveSheet, Dashboard, and Reference sections
- Consistent use of Chakra UI theming
- Good TypeScript typing throughout
- Supabase integration well-isolated

### Future Considerations
- Consider form library (React Hook Form) for complex forms
- Consider state management library if complexity grows
- Consider component library documentation (Storybook)

