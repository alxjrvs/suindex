# Grants and Choices Patterns Reference

This document catalogs the current usage patterns of `grants` and `choices` arrays in the reference data files. This serves as a reference for understanding existing patterns before conducting the comprehensive audit.

## Overview

- **Grants**: Automatic entity creation when parent entity is selected
- **Choices**: Player selections that customize entities

## Current Grants Patterns

### Location: `abilities.json`

**Pattern**: Abilities that grant equipment automatically

1. **Auto-Turret** (Ability)
   - **ID**: `c7f121eb-6e9f-46e6-9500-f65860ddd08c`
   - **Grants**: `[{ name: "Auto-Turret", schema: "equipment" }]`
   - **Pattern**: Ability grants equipment with the same name

2. **Custom Sniper Rifle** (Ability)
   - **ID**: `921afb77-3d0f-49b5-9cc4-36372b24e00d` (referenced in plan)
   - **Grants**: `[{ name: "Custom Sniper Rifle", schema: "equipment" }]`
   - **Pattern**: Ability grants equipment with the same name

**Summary**: 
- 2 abilities currently have `grants` arrays
- All grant equipment items
- Grant name matches ability name

## Current Choices Patterns

### Location: `abilities.json`

**Pattern**: Abilities with choices for player customization

1. **Bionic Senses** (Ability)
   - **ID**: `1e6183d7-0b67-40ab-91f4-134090c8846b`
   - **Choices**: On action (not top-level)
   - **Choice Type**: Schema-based (`schema: ["modules"]`)
   - **Choice Details**: 
     - `schemaEntities`: ["Thermal Optics", "Zoom Optics", "IR Night Vision Optics"]
     - Player selects one module from the list

**Note**: Choices can appear on actions within abilities, not just at the top level.

### Location: `systems.json`

**Pattern**: Systems with choices for customization

1. **Industrial Body Kit** (System)
   - **ID**: Found in systems.json
   - **Choices**: On action
   - **Choice Type**: Schema-based with constraints
   - **Choice Details**:
     - `schema: ["chassis"]`
     - `constraints: { field: "techLevel", min: 1, max: 2 }`
     - Player selects a chassis with tech level 1-2

2. **Melee Weapon** (System)
   - **Choices**: On action
   - **Choice Type**: Custom text or schema-based
   - Player customizes melee weapon

3. **Turret Personality** (System - Auto-Turret related)
   - **Choices**: On action
   - **Choice Type**: Roll table
   - **Choice Details**:
     - `rollTable: "A.I. Personality"`
     - Player rolls on table for personality

4. **Chassis Choice** (System)
   - **Choices**: On action
   - **Choice Type**: Schema-based with constraints
   - **Choice Details**:
     - `schema: ["chassis"]`
     - `constraints` (tech level restrictions)

**Summary**:
- Choices appear on actions within systems
- Types: Schema-based (with constraints), roll tables, custom text
- Constraints used for tech level restrictions

### Location: `equipment.json`

**Pattern**: Equipment with choices

1. **Auto-Turret** (Equipment)
   - **ID**: `f5f04072-9e81-4c9d-a835-b71f45120d66`
   - **Choices**: On action
   - **Choice Types**:
     - **A.I. Personality**: Roll table (`rollTable: "A.I. Personality"`)
     - **Name**: Custom text
   - **Pattern**: Equipment that represents a deployable entity has choices for naming and personality

**Summary**:
- Equipment can have choices on actions
- Common patterns: Name (custom text), Personality (roll table)

### Location: `crawler-bays.json`

**Pattern**: Crawler bays with NPC choices

**All Bays** have NPCs with choices:
- **Keepsake**: Custom text choice
- **Motto**: Custom text choice

**Specific Bays**:
1. **Armament Bay**
   - **Top-level choice**: `Armament Bay Weapons System`
     - `schema: ["systems"]`
     - Player selects a weapons system to mount
   - **NPC choices**: Keepsake, Motto

2. **All Other Bays** (Command, Mech, Storage, Crafting, Trading, Med, Pilot, Armoury, Cantina)
   - **NPC choices only**: Keepsake, Motto

**Summary**:
- All bays have NPCs with Keepsake and Motto choices
- Some bays have additional top-level choices (e.g., Armament Bay)
- NPC choices are nested under `npc.choices`

### Location: `crawlers.json`

**Pattern**: Crawler types with NPC and action choices

1. **Augmented** (Crawler Type)
   - **NPC**: Union Crawler A.I.
   - **NPC Choices**: 
     - **A.I. Personality**: Roll table (`rollTable: "A.I. Personality"`)
   - **Note**: No Name choice currently (should be added per plan)

2. **Battle** (Crawler Type)
   - **NPC**: Grizzled Veteran
   - **NPC Choices**: Keepsake, Motto
   - **Action Choices**: 
     - **Additional Armament Bay Weapons System**: `schema: ["systems"]`
   - **Note**: No Name choice currently (should be added per plan)

3. **Engineering** (Crawler Type)
   - **NPC**: Research Engineer
   - **NPC Choices**: Keepsake, Motto
   - **Note**: No Name choice currently (should be added per plan)

4. **Exploratory** (Crawler Type)
   - **NPC**: Wasteland Explorer
   - **NPC Choices**: Keepsake, Motto
   - **Note**: No Name choice currently (should be added per plan)

5. **Trade Caravan** (Crawler Type)
   - **NPC**: Savvy Trader
   - **NPC Choices**: Keepsake, Motto
   - **Note**: No Name choice currently (should be added per plan)

**Summary**:
- All crawler types have NPCs
- Most NPCs have Keepsake and Motto choices
- Some crawlers have action-level choices (e.g., Battle crawler)
- **Missing**: Name choices for NPCs (to be added per Phase 4)

## Choice Types Summary

1. **Schema-Based Choices**
   - `schema: ["systems"]`, `schema: ["modules"]`, `schema: ["chassis"]`, etc.
   - Player selects from entities in specified schema(s)
   - May include `schemaEntities` to limit options
   - May include `constraints` for filtering (e.g., tech level)

2. **Roll Table Choices**
   - `rollTable: "A.I. Personality"` or other table names
   - Player rolls on table for random outcome

3. **Custom Text Choices**
   - No `schema` or `rollTable` specified
   - Player enters free-form text
   - Examples: Name, Keepsake, Motto

4. **Nested Choices**
   - Choices can appear on actions within entities
   - Choices can be nested under NPCs (`npc.choices`)

## Files Currently Using Grants/Choices

### Files with Grants:
- `abilities.json` (2 entities)

### Files with Choices:
- `abilities.json` (choices on actions)
- `systems.json` (choices on actions)
- `equipment.json` (choices on actions)
- `crawler-bays.json` (top-level choices + NPC choices)
- `crawlers.json` (NPC choices + action choices)

### Files NOT Currently Using Grants/Choices:
- `ability-tree-requirements.json`
- `bio-titans.json`
- `chassis.json`
- `classes.advanced.json`
- `classes.core.json`
- `crawler-tech-levels.json`
- `creatures.json`
- `distances.json`
- `drones.json`
- `keywords.json`
- `meld.json`
- `modules.json`
- `npcs.json`
- `roll-tables.json`
- `squads.json`
- `traits.json`
- `vehicles.json`

## Key Observations

1. **Grants are rare**: Only 2 entities currently use grants (both abilities granting equipment)

2. **Choices are common**: Used across multiple entity types for customization

3. **Nested structure**: Choices can appear:
   - At top level of entity
   - On actions within entities
   - Under NPCs (`npc.choices`)

4. **NPC naming gap**: NPCs currently don't have Name choices, but names are stored in metadata (to be migrated per Phase 4)

5. **Action-level choices**: Many choices are defined on actions rather than top-level, which is valid but less discoverable

## Next Steps

1. Audit all 22 data files to identify missing grants/choices
2. Cross-reference with game rules to verify completeness
3. Add missing Name choices for NPCs (Phase 4)
4. Document any new patterns discovered during audit


