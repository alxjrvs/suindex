# Test Utilities Extraction Summary

## Overview

Extracted common test patterns and utilities from test files to eliminate duplication and improve maintainability. All tests pass successfully.

## New Test Helper Modules

### 1. `src/test/helpers/referenceData.ts`

Centralizes fetching and validation of SalvageUnionReference data.

**Functions:**

- `getCoreClasses()` - Fetch core classes with validation
- `getHybridClasses()` - Fetch hybrid classes with validation
- `getAdvancedClasses()` - Fetch advanced classes with validation
- `findClass(name, type)` - Find specific class by name and type
- `getChassis()` - Fetch chassis with validation
- `getChassisWithPatterns()` - Get chassis that have patterns
- `getCrawlers()` - Fetch crawlers with validation
- `getCrawlerBays()` - Fetch crawler bays with validation
- `getAbilities()` - Fetch abilities with validation
- `getAbilitiesForClass(classObj)` - Get abilities for a specific class
- `getAbilitiesByLevel(abilities, level)` - Filter abilities by level
- `getEquipment()` - Fetch equipment with validation

### 2. `src/test/helpers/steppers.ts`

Provides utilities for interacting with stepper components (HP, AP, TP, SP, etc.).

**Functions:**

- `getStepperGroup(label)` - Get stepper element by label
- `getIncrementButton(label)` - Get increment button
- `getDecrementButton(label)` - Get decrement button
- `incrementStepper(user, label, times)` - Click increment N times
- `decrementStepper(user, label, times)` - Click decrement N times
- `getStepperValue(label)` - Get current numeric value
- `getStepperDisplayValue(label)` - Get full display value (e.g., "5/10")
- `waitForStepperValue(label, value)` - Wait for specific value
- `waitForStepperDisplayValue(label, value)` - Wait for display value
- `isStepperButtonDisabled(label, type)` - Check if button is disabled

### 3. `src/test/helpers/sections.ts`

Utilities for interacting with sections and modals.

**Functions:**

- `getSection(name)` - Find section by heading text
- `getSectionAddButton(name)` - Get add button for section
- `openSection(user, name)` - Open section modal
- `waitForModalOpen(text)` - Wait for modal to appear
- `waitForModalClosed(text)` - Wait for modal to disappear
- `closeModal(user)` - Close modal by clicking close button
- `closeModalAndWait(user, text)` - Close and wait for disappearance
- `getSectionCount(name)` - Get count display (e.g., "0/6")
- `waitForSectionCount(name, count)` - Wait for specific count
- `getModalButton(text)` - Find button in modal
- `clickModalButton(user, text)` - Click button in modal

### 4. `src/test/helpers/combobox.ts`

Utilities for interacting with combobox/select elements.

**Functions:**

- `getCombobox(labelOrIndex)` - Get combobox by label or index
- `selectComboboxOption(user, labelOrIndex, value)` - Select option
- `getComboboxOptions(labelOrIndex)` - Get all options
- `getComboboxOptionCount(labelOrIndex)` - Get option count
- `isComboboxDisabled(labelOrIndex)` - Check if disabled

## Updated Files

### Test Files Updated

All test files now use the new utilities instead of duplicating code:

1. `src/components/PilotLiveSheet/__tests__/PilotLiveSheet.test.tsx`
2. `src/components/PilotLiveSheet/__tests__/AbilitySelection.test.tsx`
3. `src/components/PilotLiveSheet/__tests__/AbilityRemoval.test.tsx`
4. `src/components/PilotLiveSheet/__tests__/AdvancedClasses.test.tsx`
5. `src/components/PilotLiveSheet/__tests__/LegendaryAbilities.test.tsx`
6. `src/components/PilotLiveSheet/__tests__/EquipmentInventory.test.tsx`
7. `src/components/PilotLiveSheet/__tests__/Integration.test.tsx`
8. `src/components/PilotLiveSheet/__tests__/ResourceManagement.test.tsx`
9. `src/components/PilotLiveSheet/__tests__/PilotInformation.test.tsx`
10. `src/components/MechLiveSheet/__tests__/MechLiveSheet.test.tsx`
11. `src/components/CrawlerLiveSheet/__tests__/CrawlerLiveSheet.test.tsx`

### Helper Files Updated

- `src/test/helpers/index.ts` - Exports all new utilities
- `src/test/helpers/userInteractions.ts` - Refactored to use new stepper/section helpers

## Benefits

1. **Reduced Duplication** - Common patterns extracted into reusable functions
2. **Improved Maintainability** - Changes to interaction patterns only need to be made in one place
3. **Better Readability** - Test code is more concise and intent is clearer
4. **Consistency** - All tests use the same utilities, ensuring consistent behavior
5. **Easier Testing** - New tests can be written faster using these utilities

## Example Usage

### Before

```typescript
const tpStepper = screen.getByRole('group', { name: /TP/i })
const tpIncrementButton = tpStepper.querySelector(
  'button[aria-label="Increment TP"]'
) as HTMLButtonElement

for (let i = 0; i < 5; i++) {
  await user.click(tpIncrementButton)
}
```

### After

```typescript
import { incrementStepper } from '../../../test/helpers'

await incrementStepper(user, 'TP', 5)
```

## Test Results

All tests pass successfully with the new utilities in place.

**Final Test Results:**

- Test Files: 12 passed (12)
- Tests: 143 passed (143)

**Quality Checks:**

- ✅ TypeScript typecheck: Passed
- ✅ ESLint: Passed
- ✅ Prettier format: Passed
