# In-Depth Explanation: Classes Schema Restructuring

## Overview

The classes data underwent a **major architectural restructuring** that split a single unified `classes.json` file with a polymorphic schema into **three separate files** with distinct schemas:

1. **`classes.core.json`** / **`classes.core.schema.json`** - Core character classes
2. **`classes.advanced.json`** / **`classes.advanced.schema.json`** - Advanced progression for core classes
3. **`classes.hybrid.json`** / **`classes.hybrid.schema.json`** - Hybrid classes formed by combining core classes

This change was implemented in commit `c279713bb3f24354cce0691baad0cf95ccd11dcf` on 2025-10-26.

---

## The Old Structure (Before Split)

### Single File: `classes.json`

The original schema used a **polymorphic `oneOf` pattern** where each class had a `type` field that determined its structure:

- **Core classes**: `"type": "core"`
- **Hybrid classes**: `"type": "hybrid"`

### Old Schema Fields (Core Classes)

```json
{
  "type": "core",
  "coreAbilities": [...],
  "hybridClasses": [...],
  "advancedAbilities": "...",
  "legendaryAbilities": [...]
}
```

### Old Schema Fields (Hybrid Classes)

```json
{
  "type": "hybrid",
  "coreClasses": [...],
  "coreAbilities": [...],
  "advancedAbilities": "...",
  "legendaryAbilities": [...]
}
```

---

## The New Structure (After Split)

### Three Separate Files

Each class type now has its own dedicated file and schema, eliminating the need for polymorphism.

---

## Field Changes: Detailed Breakdown

### 1. **Core Classes** (`classes.core.json`)

#### **DROPPED FIELDS:**

| Old Field            | Reason Dropped                                              |
| -------------------- | ----------------------------------------------------------- |
| `type`               | No longer needed - file separation makes type implicit      |
| `hybridClasses`      | Relationship information removed from core class definition |
| `advancedAbilities`  | **Moved to `classes.advanced.json`**                        |
| `legendaryAbilities` | **Moved to `classes.advanced.json`**                        |

#### **RENAMED FIELDS:**

| Old Name        | New Name    | Notes                                                                       |
| --------------- | ----------- | --------------------------------------------------------------------------- |
| `coreAbilities` | `coreTrees` | More accurate name - these are ability tree names, not individual abilities |

#### **NEW FIELDS:**

| Field          | Type              | Description                                                                                                  |
| -------------- | ----------------- | ------------------------------------------------------------------------------------------------------------ |
| `maxAbilities` | `integer` (10-12) | Maximum number of abilities a character can have. Most core classes have 10, Salvager has 12                 |
| `advanceable`  | `boolean`         | Indicates if this class can advance into advanced/hybrid classes. Salvager is `false`, all others are `true` |

#### **Example: Engineer (Core)**

**Before:**

```json
{
  "name": "Engineer",
  "type": "core",
  "coreAbilities": ["Mechanical Knowledge", "Forging", "Mech-Tech"],
  "hybridClasses": ["Fabricator", "Union Rep"],
  "advancedAbilities": "Advanced Engineer",
  "legendaryAbilities": ["Tip Top Shape", "The Full Works"]
}
```

**After:**

```json
{
  "name": "Engineer",
  "coreTrees": ["Mechanical Knowledge", "Forging", "Mech-Tech"],
  "maxAbilities": 10,
  "advanceable": true
}
```

---

### 2. **Advanced Classes** (`classes.advanced.json`) - NEW FILE

This is an **entirely new category** that didn't exist before. It contains the advanced progression data that was previously embedded in core class records.

#### **PURPOSE:**

Represents the advanced specialization path for core classes (e.g., "Advanced Engineer", "Advanced Hacker").

#### **FIELDS:**

| Field                | Type      | Source                             | Description                                            |
| -------------------- | --------- | ---------------------------------- | ------------------------------------------------------ |
| `id`                 | `string`  | Same as core class                 | Links to the corresponding core class                  |
| `name`               | `string`  | **NEW**                            | Name of the advanced class (e.g., "Advanced Engineer") |
| `source`             | `string`  | Copied from core                   | Source book reference                                  |
| `description`        | `string`  | Copied from core                   | Class description                                      |
| `advancedTree`       | `string`  | **Moved from `advancedAbilities`** | Name of the advanced ability tree                      |
| `sourceTrees`        | `array`   | **NEW**                            | Array of ability tree names that lead to this class    |
| `legendaryAbilities` | `array`   | **Moved from core**                | Array of legendary ability names                       |
| `page`               | `integer` | Copied from core                   | Page number in source book                             |

#### **Example: Advanced Engineer**

**Before (embedded in Engineer core class):**

```json
{
  "name": "Engineer",
  "advancedAbilities": "Advanced Engineer",
  "legendaryAbilities": ["Tip Top Shape", "The Full Works"]
}
```

**After (separate record):**

```json
{
  "id": "2b3699e5-399b-4085-ad24-c497c94aa4db",
  "name": "Advanced Engineer",
  "advancedTree": "Advanced Engineer",
  "sourceTrees": ["Mech-Tech"],
  "legendaryAbilities": ["Tip Top Shape", "The Full Works"],
  "page": 26
}
```

---

### 3. **Hybrid Classes** (`classes.hybrid.json`)

#### **DROPPED FIELDS:**

| Old Field       | Reason Dropped                                         |
| --------------- | ------------------------------------------------------ |
| `type`          | No longer needed - file separation makes type implicit |
| `coreClasses`   | Relationship information removed                       |
| `coreAbilities` | Not needed in hybrid class definition                  |

#### **RENAMED FIELDS:**

| Old Name            | New Name       | Notes                                                                |
| ------------------- | -------------- | -------------------------------------------------------------------- |
| `advancedAbilities` | `advancedTree` | More accurate name - it's a single tree name, not multiple abilities |

#### **NEW FIELDS:**

| Field         | Type    | Description                                         |
| ------------- | ------- | --------------------------------------------------- |
| `sourceTrees` | `array` | Array of ability tree names that lead to this class |

#### **RETAINED FIELDS:**

- `id`, `name`, `source`, `description`, `page` - All standard metadata fields
- `legendaryAbilities` - Array of legendary ability names

#### **Example: Fabricator (Hybrid)**

**Before:**

```json
{
  "name": "Fabricator",
  "type": "hybrid",
  "coreClasses": ["Engineer", "Hacker"],
  "coreAbilities": ["Forging", "Electronics"],
  "advancedAbilities": "Fabricator",
  "legendaryAbilities": ["Droned Mech Conversion", "System Miniaturisation"]
}
```

**After:**

```json
{
  "name": "Fabricator",
  "advancedTree": "Fabricator",
  "sourceTrees": ["Electronics", "Forging"],
  "legendaryAbilities": ["Droned Mech Conversion", "System Miniaturisation"]
}
```

---

## Summary of All Field Changes

### Fields That Were **DROPPED** Entirely:

1. **`type`** - Implicit from file structure
2. **`hybridClasses`** - Removed from core classes
3. **`coreClasses`** - Removed from hybrid classes
4. **`coreAbilities`** (in hybrid classes) - Removed

### Fields That Were **RENAMED**:

1. **`coreAbilities`** → **`coreTrees`** (in core classes)
2. **`advancedAbilities`** → **`advancedTree`** (in hybrid and advanced classes)

### Fields That Were **MOVED**:

1. **`advancedAbilities`** - Moved from core classes to new advanced classes file (as `advancedTree`)
2. **`legendaryAbilities`** - Moved from core classes to new advanced classes file

### Fields That Were **ADDED**:

1. **`maxAbilities`** - Added to core classes (10 for most, 12 for Salvager)
2. **`advanceable`** - Added to core classes (boolean flag)
3. **`sourceTrees`** - Added to advanced and hybrid classes (array of ability tree names that lead to the class)

---

## Benefits of This Restructuring

### 1. **Separation of Concerns**

- Core class data is now purely about the base class
- Advanced progression is in its own file
- Hybrid classes are clearly distinct

### 2. **Simpler Schemas**

- No more polymorphic `oneOf` patterns
- Each schema is straightforward and focused
- Easier validation and type inference

### 3. **Better Data Modeling**

- Advanced classes are now first-class entities with their own records
- Clearer relationship between core and advanced progression
- Each file has a single, clear purpose

### 4. **Improved API**

- Three distinct model classes: `CoreClasses`, `AdvancedClasses`, `HybridClasses`
- Clearer querying: `SalvageUnionReference.CoreClasses.all()`
- Type safety: Each model has its own TypeScript type

### 5. **Maintainability**

- Easier to add new classes to the appropriate category
- No need to manage complex conditional logic based on `type` field
- Schema changes are isolated to the relevant file

---

## Migration Impact

### For Data Consumers:

**Before:**

```typescript
const classes = SalvageUnionReference.Classes.all()
const coreClasses = classes.filter((c) => c.type === 'core')
const engineer = classes.find((c) => c.name === 'Engineer')
const advancedTree = engineer.advancedAbilities // "Advanced Engineer"
```

**After:**

```typescript
const coreClasses = SalvageUnionReference.CoreClasses.all()
const hybridClasses = SalvageUnionReference.HybridClasses.all()
const advancedClasses = SalvageUnionReference.AdvancedClasses.all()

const engineer = SalvageUnionReference.CoreClasses.find(
  (c) => c.name === 'Engineer'
)
const advancedEngineer = SalvageUnionReference.AdvancedClasses.find(
  (c) => c.id === engineer.id
)
const advancedTree = advancedEngineer.advancedTree // "Advanced Engineer"
```

---

This restructuring represents a **fundamental architectural improvement** that makes the data more maintainable, the schemas simpler, and the API clearer for consumers of the Salvage Union reference data.
