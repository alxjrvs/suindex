<!-- 15b8e901-0206-4280-82f2-012203282523 774b0527-782c-4afa-b44c-e23fdcccf513 -->
# Multi-Select Choices Implementation Plan

## Overview

Enable choices that can be selected multiple times, such as Custom Sniper Rifle modifications which allow one selection per tech level. This requires changes across the reference data schema, database, API, and UI.

## Current State

- Choices currently enforce single selection via `UNIQUE(entity_id, choice_ref_id)` constraint
- UI displays "(choose one)" for limited choices
- Custom Sniper Rifle "Modification" choice needs to allow multiple selections (one per tech level)

## Implementation Strategy

### 1. Reference Data Schema Changes

**Files:**

- `packages/salvageunion-reference/schemas/shared/objects.schema.json`
- `packages/salvageunion-reference/lib/types/objects.ts`

**Changes:**

- Add optional `multiSelect?: boolean` property to `SURefObjectChoice` interface
- Add `multiSelect` field to choice schema definition
- Default to `false` (backward compatible)
- Add optional `choiceOptions?: Array<{ label: string; value: string; description?: string }>` property to `SURefObjectChoice` interface
- Add `choiceOptions` field to choice schema definition (similar to `actionOptions`)
- This allows choices to define structured options with labels, values, and optional descriptions
- Enables Custom Sniper Rifle modifications to be defined as structured choice options rather than just `schemaEntities` strings

### 2. Database Schema Migration

**File:** `apps/suref-web/supabase/migrations/[timestamp]_add_multi_select_choices.sql`

**Changes:**

- Remove `UNIQUE(entity_id, choice_ref_id)` constraint (or make it conditional)
- Add new constraint that allows multiple rows only when choice is multi-select
- Alternative: Remove unique constraint entirely and handle uniqueness in application logic for single-select choices
- Consider adding an index on `(entity_id, choice_ref_id)` for performance

**Decision needed:** Should we:

- Option A: Remove unique constraint entirely, enforce single-select in app logic
- Option B: Add a computed column/check constraint that enforces uniqueness only for non-multi-select choices

### 3. API Layer Updates

**Files:**

- `apps/suref-web/src/lib/api/playerChoices.ts`
- `apps/suref-web/src/lib/validation/playerChoice.ts`

**Changes:**

- Update `upsertPlayerChoice` to handle multiple selections (remove unique conflict handling for multi-select)
- Add `fetchChoicesForEntity` to return all selections for a choice_ref_id (already returns array)
- Update validation schema to allow multiple entries
- Add helper function to check if choice is multi-select from reference data

### 4. React Hooks Updates

**File:** `apps/suref-web/src/hooks/suentity/usePlayerChoices.ts`

**Changes:**

- Update `useUpsertPlayerChoice` to handle multiple selections per choice_ref_id
- Modify cache update logic to append rather than replace for multi-select choices
- Update `useDeletePlayerChoice` to handle deleting specific selections
- Add helper to get all selections for a choice_ref_id

### 5. UI Component Updates

**Files:**

- `apps/suref-web/src/components/entity/EntityDisplay/EntityChoice.tsx`
- `apps/suref-web/src/components/entity/EntityDisplay/EntityListDisplay.tsx`
- `apps/suref-web/src/components/CrawlerLiveSheet/SheetEntityChoiceDisplay.tsx`

**Changes:**

- Detect multi-select choices via `choice.multiSelect` flag
- Display all selected values for multi-select choices
- Show "Add [Choice Name]" button for multi-select choices
- Allow removing individual selections
- Update "(choose one)" text to "(choose multiple)" or "(choose one per tech level)" for multi-select
- Handle display of multiple selected entities/values
- Add support for rendering `choiceOptions` (similar to how `actionOptions` are handled)
- Display choice options with their labels and optional descriptions
- Allow selection from `choiceOptions` when present (in addition to existing `schemaEntities` support)

### 6. Data Updates

**File:** `packages/salvageunion-reference/data/equipment.json`

**Changes:**

- Add `"multiSelect": true` to Custom Sniper Rifle "Modification" choice
- Add `choiceOptions` array to Custom Sniper Rifle "Modification" choice with structured definitions for each modification:
- Rangefinder
- Laser Guidance
- Pinpoint Targeter
- Dum Dum Rounds
- High Calibre Rounds
- Anti-Matter
- Flashy
- Silencer
- Compact Design
- Each option should include `label` (display name), `value` (identifier), and optionally `description` (if descriptions exist in source material)
- This provides structured choice infrastructure in addition to the existing content blocks that describe the modifications
- Review other choices that should be multi-select (if any)

## Key Considerations

1. **Backward Compatibility:** Existing single-select choices must continue to work
2. **Data Migration:** Existing data should remain valid (single selections work as-is)
3. **UI/UX:** Clear indication of multi-select vs single-select choices
4. **Validation:** Ensure single-select choices still enforce uniqueness in application logic
5. **Performance:** Indexing strategy for querying multiple selections efficiently

## Testing Requirements

- Test single-select choices still work (backward compatibility)
- Test multi-select choices allow multiple selections
- Test deletion of individual multi-select entries
- Test nested choices with multi-select
- Test Custom Sniper Rifle modification selection at different tech levels
- Test `choiceOptions` rendering and selection in UI
- Verify modification descriptions display correctly from choice options

### To-dos

- [ ] Add multiSelect boolean flag to SURefObjectChoice type and JSON schema
- [ ] Create migration to remove/modify unique constraint on player_choices table
- [ ] Update playerChoices API to handle multiple selections per choice_ref_id
- [ ] Update React hooks to support multiple selections and cache management
- [ ] Update EntityChoice and related components to display and manage multiple selections
- [ ] Add multiSelect flag to Custom Sniper Rifle Modification choice in equipment.json
- [ ] Test single-select backward compatibility and multi-select functionality
- [ ] Add multiSelect boolean flag to SURefObjectChoice type and JSON schema
- [ ] Add choiceOptions array type to SURefObjectChoice type and JSON schema (similar to actionOptions)
- [ ] Create migration to remove/modify unique constraint on player_choices table
- [ ] Update playerChoices API to handle multiple selections per choice_ref_id
- [ ] Update React hooks to support multiple selections and cache management
- [ ] Update EntityChoice and related components to display and manage multiple selections
- [ ] Add UI support for rendering choiceOptions (display options with labels/descriptions)
- [ ] Add multiSelect flag to Custom Sniper Rifle Modification choice in equipment.json
- [ ] Add choiceOptions array to Custom Sniper Rifle Modification choice with all modification options defined
- [ ] Test single-select backward compatibility and multi-select functionality
- [ ] Test choiceOptions rendering and selection in UI