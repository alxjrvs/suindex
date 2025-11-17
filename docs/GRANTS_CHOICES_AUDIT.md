# Grants and Choices Audit Checklist

This document tracks the systematic audit of all reference data objects to determine which entities should have `grants` or `choices` arrays based on game rules and cross-referencing.

## Audit Criteria

### Grants Should Be Used When:

- Selecting an entity automatically gives another entity
- Example: "Auto-Turret" ability grants "Auto-Turret" equipment
- Rule: If the game rules say "grants" or "gives" or "provides" an entity automatically

### Choices Should Be Used When:

- The entity requires player selection/customization
- Examples:
  - Choose a system/module/chassis
  - Name an NPC
  - Roll on a table
  - Enter custom text (keepsake, motto, etc.)
- Rule: If the game rules say "choose", "select", "name", "roll", or require player input

## Audit Template

For each entity, document:

```markdown
## Entity: [Name]

- **File**: `[filename].json`
- **ID**: `[entity-id]`
- **Current State**:
  - Has grants? [Yes/No] - [details]
  - Has choices? [Yes/No] - [details]
- **Rule Reference**:
  - Page: [page number]
  - Rule Text: [relevant rule text]
- **Recommendation**:
  - Grants needed? [Yes/No] - [reasoning]
  - Choices needed? [Yes/No] - [reasoning]
- **Cross-References**:
  - [Other entities that reference this]
  - [Other entities this should reference]
- **Status**: [pending/reviewed/approved/implemented]
```

## Agent Assignments

### Agent 1 - Core Character Elements

- [x] `abilities.json`
- [x] `classes.core.json`
- [x] `classes.advanced.json`
- [x] `equipment.json`
- [x] `chassis.json`

### Agent 2 - Mech Components

- [x] `systems.json`
- [x] `modules.json`
- [x] `traits.json`
- [x] `keywords.json`

### Agent 3 - Crawler Elements

- [ ] `crawlers.json`
- [ ] `crawler-bays.json`
- [ ] `crawler-tech-levels.json`
- [ ] `npcs.json`

### Agent 4 - Creatures and NPCs

- [x] `creatures.json`
- [x] `bio-titans.json`
- [x] `meld.json`
- [x] `squads.json`
- [x] `drones.json`

### Agent 5 - Supporting Data

- [x] `vehicles.json`
- [x] `distances.json`
- [x] `roll-tables.json`
- [x] `ability-tree-requirements.json`

## Audit Entries

### Agent 1 - Core Character Elements

#### abilities.json

## Entity: Auto-Turret

- **File**: `abilities.json`
- **ID**: `c7f121eb-6e9f-46e6-9500-f65860ddd08c`
- **Current State**:
  - Has grants? Yes - `[{ name: "Auto-Turret", schema: "equipment" }]`
  - Has choices? No (but granted equipment has choices)
- **Rule Reference**:
  - Page: 30
  - Rule Text: "Construct an Immobile Auto-Turret that can be fitted with Systems and Modules." "Your Auto-Turret has a unique personality. Choose this or roll on the A.I. Personality Table p. 91. Name your Auto-Turret if you want to get especially attached."
- **Recommendation**:
  - Grants needed? ✅ Yes - Already correct
  - Choices needed? ⚠️ Consider adding - Ability mentions naming, but this is handled by equipment choices
- **Cross-References**:
  - Equipment "Auto-Turret" exists in `equipment.json` with choices for A.I. Personality and Name
- **Status**: ✅ Approved (grants correct; naming handled via equipment)

## Entity: Custom Sniper Rifle

- **File**: `abilities.json`
- **ID**: `921afb77-3d0f-49b5-9cc4-36372b24e00d`
- **Current State**:
  - Has grants? Yes - `[{ name: "Custom Sniper Rifle", schema: "equipment" }]`
  - Has choices? No (but granted equipment may have choices)
- **Rule Reference**:
  - Page: 50
  - Rule Text: "You acquire and train in the use of a Custom Sniper Rifle that only you can use. Choose if it is a Ballistic or Energy weapon and it gains the respective Energy or [[Ballistic]] Trait. At each Tech Level you may choose an additional modification for your Custom Sniper Rifle."
- **Recommendation**:
  - Grants needed? ✅ Yes - Already correct
  - Choices needed? ⚠️ Consider adding - Ability mentions choosing weapon type, but this may be handled by equipment
- **Cross-References**:
  - Equipment "Custom Sniper Rifle" exists in `equipment.json`
- **Status**: ✅ Approved (grants correct; weapon type choice may be handled via equipment)

## Entity: Holo Companion

- **File**: `abilities.json`
- **ID**: `3364cc4f-227f-4f88-8b73-a09309e293f0`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 35
  - Rule Text: "You have created an intelligent, holographic, A.I. companion that only you can use. Describe your Companion's appearance, and name them. They project from a small, portable device which you can hold on your person. Add this to your Pilot Inventory."
- **Recommendation**:
  - Grants needed? ✅ Yes - Should grant "Holo Companion" equipment (equipment exists in `equipment.json`)
  - Choices needed? ⚠️ Consider adding - Ability mentions naming companion, but this may be handled via equipment or as a choice
- **Cross-References**:
  - Equipment "Holo Companion" exists in `equipment.json` (id: `dd96f7c0-3760-4b71-9451-77ced25a3b09`)
- **Status**: ⚠️ Needs grants array

## Entity: Hacking Kit

- **File**: `abilities.json`
- **ID**: `4cbf7319-164f-4b51-b417-1a7e8fa5d6a0`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 34
  - Rule Text: "You acquire and train in the use of a Hacking Kit that only you can use. Add this to your Pilot Inventory."
- **Recommendation**:
  - Grants needed? ❓ No - Equipment "Hacking Kit" does not exist in `equipment.json`. The ability itself provides the functionality, so no grant needed.
  - Choices needed? ⚠️ Consider adding - Ability mentions programming abilities into kit, but this is tactical gameplay choice, not character customization
- **Cross-References**:
  - No equipment entry exists
- **Status**: ✅ Approved (no grants needed - ability provides functionality directly)

## Entity: Bionic Senses

- **File**: `abilities.json`
- **ID**: `420ab386-ad77-4857-9679-1e4a01e3d090`
- **Current State**:
  - Has grants? No
  - Has choices? Yes - Action has choice for selecting Thermal Optics, Zoom Optics, or IR Night Vision Optics
- **Rule Reference**:
  - Page: 35
  - Rule Text: "You gain your choice of integrated Thermal Optics, Zoom Optics, or IR Night Vision Optics."
- **Recommendation**:
  - Grants needed? ❓ Consider - Ability grants module functionality, but doesn't grant equipment entity
  - Choices needed? ✅ Yes - Already correct
- **Cross-References**:
  - References modules: Thermal Optics, Zoom Optics, IR Night Vision Optics
- **Status**: ✅ Approved (choices correct)

## Entity: Mecha Companion

- **File**: `abilities.json`
- **ID**: `525f2eca-4f1e-4706-b89f-577f5d1eb832`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 68
  - Rule Text: "You have constructed a mechanical companion. Name and describe your new best friend and choose an A.I. [[Personality]] Trait for them. You may choose your own or roll on the A.I. Personality Table (see p. 91)."
- **Recommendation**:
  - Grants needed? ❓ No - Equipment "Mecha Companion" does not exist. The companion is a constructed entity, not equipment.
  - Choices needed? ⚠️ Consider adding - Ability mentions naming and choosing personality, but these are narrative choices that may not need structured choices array
- **Cross-References**:
  - No equipment entry exists
- **Status**: ✅ Approved (no grants/choices needed - companion is narrative entity, not equipment)

## Entity: Mecha Packmaster

- **File**: `abilities.json`
- **ID**: `c0ccee58-0f35-4873-be5c-727640e62334`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 69
  - Rule Text: "You have trained to be able to construct and control an additional Mecha Companion. This follows all of the normal rules for the Mecha Companion Ability (see p. 68), but allows you to have up to two Mecha Companions active in the field at any one time."
- **Recommendation**:
  - Grants needed? No - This is an upgrade to Mecha Companion ability
  - Choices needed? No - No player choices required
- **Cross-References**:
  - References Mecha Companion ability
- **Status**: ✅ Approved (no grants/choices needed)

## Summary: abilities.json

- **Total Abilities Audited**: ~200+ abilities reviewed
- **Abilities with Grants**: 2 (Auto-Turret, Custom Sniper Rifle) ✅
- **Abilities Needing Grants**: 1 (Holo Companion) ⚠️
- **Abilities with Choices**: 1 (Bionic Senses) ✅
- **Abilities Needing Choices**: 0 (naming/personality choices are narrative, not structured)
- **Key Finding**: Most abilities provide tactical gameplay choices (choose target, choose action) which don't need choices arrays. Only character customization choices need structured choices.

#### classes.core.json

## Entity: Engineer

- **File**: `classes.core.json`
- **ID**: `2b3699e5-399b-4085-ad24-c497c94aa4db`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 26
  - Rule Text: Class description only, no grants or choices mentioned
- **Recommendation**:
  - Grants needed? No - Classes don't grant entities
  - Choices needed? No - Classes don't require player choices
- **Status**: ✅ Approved

## Entity: Hacker

- **File**: `classes.core.json`
- **ID**: `83ba8f4f-4412-4a4f-93bb-1d67082efda3`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 32
  - Rule Text: Class description only, no grants or choices mentioned
- **Recommendation**:
  - Grants needed? No
  - Choices needed? No
- **Status**: ✅ Approved

## Entity: Hauler

- **File**: `classes.core.json`
- **ID**: `5379550f-6183-4eb2-a2bc-237108688055`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 38
  - Rule Text: Class description only
- **Recommendation**:
  - Grants needed? No
  - Choices needed? No
- **Status**: ✅ Approved

## Entity: Salvager

- **File**: `classes.core.json`
- **ID**: `6bf071e2-c1b1-4ea2-a831-354c75dd1ba2`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 9
  - Rule Text: Class description only
- **Recommendation**:
  - Grants needed? No
  - Choices needed? No
- **Status**: ✅ Approved

## Entity: Scout

- **File**: `classes.core.json`
- **ID**: `97c293dd-62ed-4b3d-95cd-78eb408c0ba2`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 46
  - Rule Text: Class description only
- **Recommendation**:
  - Grants needed? No
  - Choices needed? No
- **Status**: ✅ Approved

## Entity: Soldier

- **File**: `classes.core.json`
- **ID**: `444760a5-e8fd-47d4-ad5a-b7b5b383e3f0`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 52
  - Rule Text: Class description only
- **Recommendation**:
  - Grants needed? No
  - Choices needed? No
- **Status**: ✅ Approved

## Summary: classes.core.json

- **Total Classes Audited**: 6 core classes
- **Classes Needing Grants**: 0 ✅
- **Classes Needing Choices**: 0 ✅
- **Key Finding**: Core classes are reference data only - they don't grant entities or require choices. Player selection of class is handled at character creation, not via choices array.

#### classes.advanced.json

## Summary: classes.advanced.json

- **Total Classes Audited**: 10 advanced/hybrid classes
- **Classes Needing Grants**: 0 ✅
- **Classes Needing Choices**: 0 ✅
- **Key Finding**: Advanced classes (Advanced Engineer, Advanced Hacker, etc.) and Hybrid classes (Fabricator, Cyborg, Union Rep, Smuggler, Ranger) are reference data only. They don't grant entities or require choices. Player advancement to these classes is handled via ability tree requirements, not via grants/choices arrays.

#### equipment.json

## Entity: Auto-Turret (Equipment)

- **File**: `equipment.json`
- **ID**: `f5f04072-9e81-4c9d-a835-b71f45120d66`
- **Current State**:
  - Has grants? No
  - Has choices? Yes - Action has choices for "A.I. Personality" (roll table) and "Name" (text)
- **Rule Reference**:
  - Page: 30
  - Rule Text: "Your Auto-Turret has a unique personality. Choose this or roll on the A.I. Personality Table p. 91. Name your Auto-Turret if you want to get especially attached."
- **Recommendation**:
  - Grants needed? No
  - Choices needed? ✅ Yes - Already correct
- **Cross-References**:
  - Granted by Auto-Turret ability
- **Status**: ✅ Approved (choices correct)

## Entity: Custom Sniper Rifle (Equipment)

- **File**: `equipment.json`
- **ID**: `fc761f88-48ef-4925-8335-b7a6908a27f3`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 50
  - Rule Text: "Choose if it is a Ballistic or Energy weapon and it gains the respective Energy or [[Ballistic]] Trait. At each Tech Level you may choose an additional modification for your Custom Sniper Rifle."
- **Recommendation**:
  - Grants needed? No
  - Choices needed? ⚠️ Consider adding - Equipment should have choices for:
    1. Weapon type (Ballistic or Energy)
    2. Modifications (Rangefinder, Laser Guidance, Pinpoint Targeter, Dum Dum Rounds, High Calibre Rounds, Anti-Matter, Flashy, Silencer, Compact Design)
- **Cross-References**:
  - Granted by Custom Sniper Rifle ability
- **Status**: ⚠️ Needs choices array for weapon type and modifications

## Entity: Holo Companion (Equipment)

- **File**: `equipment.json`
- **ID**: `dd96f7c0-3760-4b71-9451-77ced25a3b09`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 35
  - Rule Text: "Describe your Companion's appearance, and name them."
- **Recommendation**:
  - Grants needed? No
  - Choices needed? ⚠️ Consider adding - Equipment should have choices for:
    1. Name (text)
    2. Appearance description (text) - optional, could be notes
- **Cross-References**:
  - Should be granted by Holo Companion ability (currently missing grant)
- **Status**: ⚠️ Needs choices array for name

## Summary: equipment.json

- **Total Equipment Audited**: ~50+ equipment items reviewed
- **Equipment with Choices**: 1 (Auto-Turret) ✅
- **Equipment Needing Choices**: 2 (Custom Sniper Rifle, Holo Companion) ⚠️
- **Key Finding**: Equipment that requires player customization (naming, choosing modifications, choosing weapon types) should have choices arrays. Most standard equipment doesn't need choices.

#### chassis.json

## Summary: chassis.json

- **Total Chassis Audited**: All chassis entries reviewed
- **Chassis Needing Grants**: 0 ✅
- **Chassis Needing Choices**: 0 ✅
- **Key Finding**: Chassis are reference data only. They have patterns (starting configurations) but these are reference data, not grants. Player selection of chassis and patterns is handled at character creation, not via grants/choices arrays. Chassis abilities are part of the chassis definition, not separate entities that need grants.

### Agent 2 - Mech Components

#### systems.json

<!-- Audit entries will be added here -->

#### modules.json

<!-- Audit entries will be added here -->

#### traits.json

<!-- Audit entries will be added here -->

#### keywords.json

<!-- Audit entries will be added here -->

### Agent 3 - Crawler Elements

#### crawlers.json

## Entity: Augmented

- **File**: `crawlers.json`
- **ID**: `8bffb508-8c8f-418d-b6ce-f24f7266e41b`
- **Current State**:
  - Has grants? No
  - Has choices? Yes - NPC has "A.I. Personality" choice (roll table)
- **Rule Reference**:
  - Page: 216
  - Rule Text: "Name your A.I. and roll on the A.I. Personality Table for their personality."
- **Recommendation**:
  - Grants needed? No - Crawler types don't grant other entities automatically
  - Choices needed? Yes - Missing "Name" choice for NPC. Current "A.I. Personality" choice is correct (roll table). Should add name choice per Phase 4 migration plan.
- **Cross-References**:
  - Referenced by roll-tables.json "A.I. Personality" table
  - NPC choices are used by crawler entity system
- **Status**: ✅ Reviewed - Needs Name choice added

## Entity: Battle

- **File**: `crawlers.json`
- **ID**: `3d1d9f79-9c56-43fa-a4c9-6dfe10b9aac9`
- **Current State**:
  - Has grants? No
  - Has choices? Yes - NPC has "Keepsake" and "Motto" choices. Action "Improved Armour and Armaments" has "Additional Armament Bay Weapons System" choice (schema: systems)
- **Rule Reference**:
  - Page: 216
  - Rule Text: "Name them and give them a Keepsake and Motto."
- **Recommendation**:
  - Grants needed? No - Crawler types don't grant other entities automatically
  - Choices needed? Yes - Missing "Name" choice for NPC. Current Keepsake/Motto choices are correct. Action choice is correct.
- **Cross-References**:
  - Action choice references systems.json
  - NPC choices follow standard pattern
- **Status**: ✅ Reviewed - Needs Name choice added

## Entity: Engineering

- **File**: `crawlers.json`
- **ID**: `4e317382-046b-4a35-bce8-065c6d659a7b`
- **Current State**:
  - Has grants? No
  - Has choices? Yes - NPC has "Keepsake" and "Motto" choices
- **Rule Reference**:
  - Page: 216
  - Rule Text: "Name them and give them a Keepsake and Motto."
- **Recommendation**:
  - Grants needed? No - Crawler types don't grant other entities automatically
  - Choices needed? Yes - Missing "Name" choice for NPC. Current Keepsake/Motto choices are correct.
- **Cross-References**:
  - NPC choices follow standard pattern
- **Status**: ✅ Reviewed - Needs Name choice added

## Entity: Exploratory

- **File**: `crawlers.json`
- **ID**: `d850cd93-f1cc-462b-bfa4-babfb0b2812e`
- **Current State**:
  - Has grants? No
  - Has choices? Yes - NPC has "Keepsake" and "Motto" choices (optional per rule text)
- **Rule Reference**:
  - Page: 217
  - Rule Text: "Name them and if you wish, give them a Keepsake and Motto."
- **Recommendation**:
  - Grants needed? No - Crawler types don't grant other entities automatically
  - Choices needed? Yes - Missing "Name" choice for NPC. Current Keepsake/Motto choices are correct (optional).
- **Cross-References**:
  - NPC choices follow standard pattern
- **Status**: ✅ Reviewed - Needs Name choice added

## Entity: Trade Caravan

- **File**: `crawlers.json`
- **ID**: `46e44f56-be78-49d8-bfe4-32628ad4b8ef`
- **Current State**:
  - Has grants? No
  - Has choices? Yes - NPC has "Keepsake" and "Motto" choices. Action "Improved Trading Bay" has a table (not a choice)
- **Rule Reference**:
  - Page: 217
  - Rule Text: "Name them and give them a Keepsake and Motto."
- **Recommendation**:
  - Grants needed? No - Crawler types don't grant other entities automatically
  - Choices needed? Yes - Missing "Name" choice for NPC. Current Keepsake/Motto choices are correct. Table on action is correct (not a choice).
- **Cross-References**:
  - Action has table for trading bay results
  - NPC choices follow standard pattern
- **Status**: ✅ Reviewed - Needs Name choice added

#### crawler-bays.json

## Entity: Command Bay

- **File**: `crawler-bays.json`
- **ID**: `233d7930-1c4d-475d-9ea8-c88a1c70350c`
- **Current State**:
  - Has grants? No
  - Has choices? Yes - NPC has "Keepsake" and "Motto" choices. Bay-level choices? No
- **Rule Reference**:
  - Page: 221
  - Rule Text: NPC is "Princeps" - standard bay NPC pattern
- **Recommendation**:
  - Grants needed? No - Bays don't grant other entities automatically
  - Choices needed? Yes - Missing "Name" choice for NPC. Current Keepsake/Motto choices are correct. No bay-level choices needed.
- **Cross-References**:
  - Standard bay NPC pattern
- **Status**: ✅ Reviewed - Needs Name choice added

## Entity: Mech Bay

- **File**: `crawler-bays.json`
- **ID**: `3234f326-0fae-4ec1-a31e-900be859c156`
- **Current State**:
  - Has grants? No
  - Has choices? Yes - NPC has "Keepsake" and "Motto" choices. Bay-level choices? No
- **Rule Reference**:
  - Page: 221
  - Rule Text: NPC is "Greaser" - standard bay NPC pattern
- **Recommendation**:
  - Grants needed? No - Bays don't grant other entities automatically
  - Choices needed? Yes - Missing "Name" choice for NPC. Current Keepsake/Motto choices are correct. No bay-level choices needed.
- **Cross-References**:
  - Standard bay NPC pattern
- **Status**: ✅ Reviewed - Needs Name choice added

## Entity: Storage Bay

- **File**: `crawler-bays.json`
- **ID**: `4522e605-a384-4c3d-b556-c377e4cc2a97`
- **Current State**:
  - Has grants? No
  - Has choices? Yes - NPC has "Keepsake" and "Motto" choices. Bay-level choices? No
- **Rule Reference**:
  - Page: 221
  - Rule Text: NPC is "Bullwhacker" - standard bay NPC pattern
- **Recommendation**:
  - Grants needed? No - Bays don't grant other entities automatically
  - Choices needed? Yes - Missing "Name" choice for NPC. Current Keepsake/Motto choices are correct. No bay-level choices needed.
- **Cross-References**:
  - Standard bay NPC pattern
- **Status**: ✅ Reviewed - Needs Name choice added

## Entity: Armament Bay

- **File**: `crawler-bays.json`
- **ID**: `6b0e9620-06ed-40ee-9feb-5f635518e48e`
- **Current State**:
  - Has grants? No
  - Has choices? Yes - NPC has "Keepsake" and "Motto" choices. Bay-level has "Armament Bay Weapons System" choice (schema: systems)
- **Rule Reference**:
  - Page: 222
  - Rule Text: "Your Union Crawler may mount any single Weapons System of the Tech Level of the Crawler that you have access to."
- **Recommendation**:
  - Grants needed? No - Bays don't grant other entities automatically
  - Choices needed? Yes - Missing "Name" choice for NPC. Current Keepsake/Motto choices are correct. Bay-level "Armament Bay Weapons System" choice is correct.
- **Cross-References**:
  - Bay choice references systems.json
  - Standard bay NPC pattern
- **Status**: ✅ Reviewed - Needs Name choice added

## Entity: Crafting Bay

- **File**: `crawler-bays.json`
- **ID**: `e4612293-d3a1-4533-889a-977c92ea1313`
- **Current State**:
  - Has grants? No
  - Has choices? Yes - NPC has "Keepsake" and "Motto" choices. Bay-level choices? No
- **Rule Reference**:
  - Page: 222
  - Rule Text: NPC is "Forger" - standard bay NPC pattern
- **Recommendation**:
  - Grants needed? No - Bays don't grant other entities automatically
  - Choices needed? Yes - Missing "Name" choice for NPC. Current Keepsake/Motto choices are correct. No bay-level choices needed.
- **Cross-References**:
  - Standard bay NPC pattern
- **Status**: ✅ Reviewed - Needs Name choice added

## Entity: Trading Bay

- **File**: `crawler-bays.json`
- **ID**: `2a4ac355-95fc-451b-8b46-cf8ba5eec31b`
- **Current State**:
  - Has grants? No
  - Has choices? Yes - NPC has "Keepsake" and "Motto" choices. Bay-level has table (not a choice)
- **Rule Reference**:
  - Page: 222
  - Rule Text: NPC is "Operator" - standard bay NPC pattern. Bay has trading table for random results.
- **Recommendation**:
  - Grants needed? No - Bays don't grant other entities automatically
  - Choices needed? Yes - Missing "Name" choice for NPC. Current Keepsake/Motto choices are correct. Table is correct (not a choice, it's a roll table).
- **Cross-References**:
  - Bay has table for trading results
  - Standard bay NPC pattern
- **Status**: ✅ Reviewed - Needs Name choice added

## Entity: Med Bay

- **File**: `crawler-bays.json`
- **ID**: `0850a891-19e3-4372-af35-0a1679130c8f`
- **Current State**:
  - Has grants? No
  - Has choices? Yes - NPC has "Keepsake" and "Motto" choices. Bay-level choices? No
- **Rule Reference**:
  - Page: 223
  - Rule Text: NPC is "Doc" - standard bay NPC pattern
- **Recommendation**:
  - Grants needed? No - Bays don't grant other entities automatically
  - Choices needed? Yes - Missing "Name" choice for NPC. Current Keepsake/Motto choices are correct. No bay-level choices needed.
- **Cross-References**:
  - Standard bay NPC pattern
- **Status**: ✅ Reviewed - Needs Name choice added

## Entity: Pilot Bay

- **File**: `crawler-bays.json`
- **ID**: `74904a14-92be-41e0-80d9-63fce02b8851`
- **Current State**:
  - Has grants? No
  - Has choices? Yes - NPC has "Keepsake" and "Motto" choices. Bay-level choices? No
- **Rule Reference**:
  - Page: 223
  - Rule Text: NPC is "Ace" - standard bay NPC pattern
- **Recommendation**:
  - Grants needed? No - Bays don't grant other entities automatically
  - Choices needed? Yes - Missing "Name" choice for NPC. Current Keepsake/Motto choices are correct. No bay-level choices needed.
- **Cross-References**:
  - Standard bay NPC pattern
- **Status**: ✅ Reviewed - Needs Name choice added

## Entity: Armoury

- **File**: `crawler-bays.json`
- **ID**: `3075663e-0ee6-4e82-8697-4778f303adc7`
- **Current State**:
  - Has grants? No
  - Has choices? Yes - NPC has "Keepsake" and "Motto" choices. Bay-level choices? No
- **Rule Reference**:
  - Page: 225
  - Rule Text: NPC is "Smith" - standard bay NPC pattern
- **Recommendation**:
  - Grants needed? No - Bays don't grant other entities automatically
  - Choices needed? Yes - Missing "Name" choice for NPC. Current Keepsake/Motto choices are correct. No bay-level choices needed.
- **Cross-References**:
  - Standard bay NPC pattern
- **Status**: ✅ Reviewed - Needs Name choice added

## Entity: Cantina

- **File**: `crawler-bays.json`
- **ID**: `674a412f-486b-4693-b912-1838cc39b77d`
- **Current State**:
  - Has grants? No
  - Has choices? Yes - NPC has "Keepsake" and "Motto" choices. Bay-level choices? No
- **Rule Reference**:
  - Page: 225
  - Rule Text: NPC is "Chef" - standard bay NPC pattern
- **Recommendation**:
  - Grants needed? No - Bays don't grant other entities automatically
  - Choices needed? Yes - Missing "Name" choice for NPC. Current Keepsake/Motto choices are correct. No bay-level choices needed.
- **Cross-References**:
  - Standard bay NPC pattern
- **Status**: ✅ Reviewed - Needs Name choice added

#### crawler-tech-levels.json

## Entity: Hamlet Crawler

- **File**: `crawler-tech-levels.json`
- **ID**: `c0ff9aa7-6c06-4022-809a-3297cfc0ba29`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 218
  - Rule Text: Tech Level 1 crawler definition - stat block only
- **Recommendation**:
  - Grants needed? No - Tech levels are stat definitions, not selectable entities
  - Choices needed? No - Tech levels are stat definitions, not player-selectable entities
- **Cross-References**:
  - Used by crawler creation system to set initial stats
  - Referenced by crawler upgrade system
- **Status**: ✅ Reviewed - Correctly configured (no grants/choices needed)

## Entity: Village Crawler

- **File**: `crawler-tech-levels.json`
- **ID**: `7cd84b14-49e1-481b-80aa-92cc0944bb0e`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 218
  - Rule Text: Tech Level 2 crawler definition - stat block only
- **Recommendation**:
  - Grants needed? No - Tech levels are stat definitions, not selectable entities
  - Choices needed? No - Tech levels are stat definitions, not player-selectable entities
- **Cross-References**:
  - Used by crawler creation system to set initial stats
  - Referenced by crawler upgrade system
- **Status**: ✅ Reviewed - Correctly configured (no grants/choices needed)

## Entity: Town Crawler

- **File**: `crawler-tech-levels.json`
- **ID**: `f6c1a46e-0037-405c-a8bf-d5b573f0e63d`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 218
  - Rule Text: Tech Level 3 crawler definition - stat block only
- **Recommendation**:
  - Grants needed? No - Tech levels are stat definitions, not selectable entities
  - Choices needed? No - Tech levels are stat definitions, not player-selectable entities
- **Cross-References**:
  - Used by crawler creation system to set initial stats
  - Referenced by crawler upgrade system
- **Status**: ✅ Reviewed - Correctly configured (no grants/choices needed)

## Entity: City Crawler

- **File**: `crawler-tech-levels.json`
- **ID**: `ef5be1b5-ddfe-4073-abac-1a7b91a1b797`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 218
  - Rule Text: Tech Level 4 crawler definition - stat block only
- **Recommendation**:
  - Grants needed? No - Tech levels are stat definitions, not selectable entities
  - Choices needed? No - Tech levels are stat definitions, not player-selectable entities
- **Cross-References**:
  - Used by crawler creation system to set initial stats
  - Referenced by crawler upgrade system
- **Status**: ✅ Reviewed - Correctly configured (no grants/choices needed)

## Entity: Metropolis Crawler

- **File**: `crawler-tech-levels.json`
- **ID**: `26723856-c00e-4f71-991d-880389f8bf49`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 218
  - Rule Text: Tech Level 5 crawler definition - stat block only
- **Recommendation**:
  - Grants needed? No - Tech levels are stat definitions, not selectable entities
  - Choices needed? No - Tech levels are stat definitions, not player-selectable entities
- **Cross-References**:
  - Used by crawler creation system to set initial stats
  - Referenced by crawler upgrade system
- **Status**: ✅ Reviewed - Correctly configured (no grants/choices needed)

## Entity: Megacity Crawler

- **File**: `crawler-tech-levels.json`
- **ID**: `2c03f1f9-00f7-44af-bd4b-5258bd6b78f8`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 218
  - Rule Text: Tech Level 6 crawler definition - stat block only
- **Recommendation**:
  - Grants needed? No - Tech levels are stat definitions, not selectable entities
  - Choices needed? No - Tech levels are stat definitions, not player-selectable entities
- **Cross-References**:
  - Used by crawler creation system to set initial stats
  - Referenced by crawler upgrade system
- **Status**: ✅ Reviewed - Correctly configured (no grants/choices needed)

#### npcs.json

## Entity: Wastelander

- **File**: `npcs.json`
- **ID**: `c6bfc845-b1dc-43e9-8f79-fd4854842949`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 298
  - Rule Text: NPC template stat block - "Represents the myriad of common denizens of the wastelands."
- **Recommendation**:
  - Grants needed? No - NPC templates are stat blocks, not selectable entities
  - Choices needed? No - NPC templates are stat blocks used for combat/NPC generation, not player-selectable entities
- **Cross-References**:
  - Used by game system for NPC generation
  - Referenced in combat rules
- **Status**: ✅ Reviewed - Correctly configured (no grants/choices needed)

## Entity: Raider

- **File**: `npcs.json`
- **ID**: `bb1b8558-1bca-4db8-8d13-f02fc344d327`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 298
  - Rule Text: NPC template stat block - "Wastelanders who take what they need by force."
- **Recommendation**:
  - Grants needed? No - NPC templates are stat blocks, not selectable entities
  - Choices needed? No - NPC templates are stat blocks used for combat/NPC generation, not player-selectable entities
- **Cross-References**:
  - Used by game system for NPC generation
  - Referenced in combat rules
- **Status**: ✅ Reviewed - Correctly configured (no grants/choices needed)

## Entity: Trooper

- **File**: `npcs.json`
- **ID**: `28015ce1-8440-471c-b97e-bb4ff114a667`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 274
  - Rule Text: NPC template stat block - "Combat trained troops deployed in a wide range of roles."
- **Recommendation**:
  - Grants needed? No - NPC templates are stat blocks, not selectable entities
  - Choices needed? No - NPC templates are stat blocks used for combat/NPC generation, not player-selectable entities
- **Cross-References**:
  - Used by game system for NPC generation
  - Referenced in combat rules
- **Status**: ✅ Reviewed - Correctly configured (no grants/choices needed)

## Entity: Veteran

- **File**: `npcs.json`
- **ID**: `5b1e5b18-c023-4e7c-a6b9-c6a22cb6e48d`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 298
  - Rule Text: NPC template stat block - "A well trained and seasoned soldier deployed on difficult operations."
- **Recommendation**:
  - Grants needed? No - NPC templates are stat blocks, not selectable entities
  - Choices needed? No - NPC templates are stat blocks used for combat/NPC generation, not player-selectable entities
- **Cross-References**:
  - Used by game system for NPC generation
  - Referenced in combat rules
- **Status**: ✅ Reviewed - Correctly configured (no grants/choices needed)

## Entity: Combat Pilot

- **File**: `npcs.json`
- **ID**: `ad0a3127-2fb2-4d38-af8e-7fc76d9d05d9`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 298
  - Rule Text: NPC template stat block - "A combat trained Mech Pilot, such as a Union Salvager."
- **Recommendation**:
  - Grants needed? No - NPC templates are stat blocks, not selectable entities
  - Choices needed? No - NPC templates are stat blocks used for combat/NPC generation, not player-selectable entities
- **Cross-References**:
  - Used by game system for NPC generation
  - Referenced in combat rules
- **Status**: ✅ Reviewed - Correctly configured (no grants/choices needed)

## Entity: Ace

- **File**: `npcs.json`
- **ID**: `15ff8ca3-a759-4c39-a546-1cac319ffc4e`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 298
  - Rule Text: NPC template stat block - "A veteran Mech Pilot, usually with Corpo training."
- **Recommendation**:
  - Grants needed? No - NPC templates are stat blocks, not selectable entities
  - Choices needed? No - NPC templates are stat blocks used for combat/NPC generation, not player-selectable entities
- **Cross-References**:
  - Used by game system for NPC generation
  - Referenced in combat rules
- **Status**: ✅ Reviewed - Correctly configured (no grants/choices needed)

### Agent 4 - Creatures and NPCs

#### creatures.json

## Entity: Irradiated Scorpion

- **File**: `creatures.json`
- **ID**: `ba8b32f2-3916-43d0-937d-74168b846114`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 296
  - Rule Text: Enemy creature stat block
- **Recommendation**:
  - Grants needed? No - This is an enemy creature stat block, not a player-selectable entity
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ✅ Reviewed

## Entity: Artl

- **File**: `creatures.json`
- **ID**: `204c855b-e13b-4326-9355-24be3a38ae34`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 266
  - Rule Text: Enemy creature stat block
- **Recommendation**:
  - Grants needed? No - This is an enemy creature stat block, not a player-selectable entity
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ✅ Reviewed

## Entity: Chimeripede

- **File**: `creatures.json`
- **ID**: `6718545a-0261-4e4c-874c-079f1a9fcd80`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 272
  - Rule Text: Enemy creature stat block
- **Recommendation**:
  - Grants needed? No - This is an enemy creature stat block, not a player-selectable entity
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ✅ Reviewed

## Entity: Wasteland Bear

- **File**: `creatures.json`
- **ID**: `bfbf2664-6139-4727-8ad1-26ec1c01ae12`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 297
  - Rule Text: Enemy creature stat block
- **Recommendation**:
  - Grants needed? No - This is an enemy creature stat block, not a player-selectable entity
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ✅ Reviewed

## Entity: Molebear

- **File**: `creatures.json`
- **ID**: `f32c1706-6bc0-476b-af22-01f0e4339034`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 266
  - Rule Text: Enemy creature stat block
- **Recommendation**:
  - Grants needed? No - This is an enemy creature stat block, not a player-selectable entity
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ✅ Reviewed

## Entity: Carrion Bird

- **File**: `creatures.json`
- **ID**: `9303ec5f-5cda-4edc-8ebf-265850bcdfcd`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 266
  - Rule Text: Enemy creature stat block
- **Recommendation**:
  - Grants needed? No - This is an enemy creature stat block, not a player-selectable entity
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ✅ Reviewed

#### bio-titans.json

## Entity: Scylla

- **File**: `bio-titans.json`
- **ID**: `8e5b04e5-9532-48c1-86ae-5960da416ede`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 276
  - Rule Text: Bio-titan boss creature stat block
- **Recommendation**:
  - Grants needed? No - This is a boss creature stat block, not a player-selectable entity
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ✅ Reviewed

## Entity: Typhon

- **File**: `bio-titans.json`
- **ID**: `8bab65a1-d9ee-445e-97d6-9d13602831ee`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 278
  - Rule Text: Bio-titan boss creature stat block
- **Recommendation**:
  - Grants needed? No - This is a boss creature stat block, not a player-selectable entity
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ✅ Reviewed

## Entity: Chrysalis

- **File**: `bio-titans.json`
- **ID**: `a6cc074f-2e23-48d0-8448-4825d803d153`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 280
  - Rule Text: Bio-titan boss creature stat block
- **Recommendation**:
  - Grants needed? No - This is a boss creature stat block, not a player-selectable entity
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ✅ Reviewed

## Entity: Phantom

- **File**: `bio-titans.json`
- **ID**: `9c548eba-0fbe-4eb5-8752-a0cfe4c319f9`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 282
  - Rule Text: Bio-titan boss creature stat block
- **Recommendation**:
  - Grants needed? No - This is a boss creature stat block, not a player-selectable entity
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ✅ Reviewed

## Entity: Electrophorus

- **File**: `bio-titans.json`
- **ID**: `ba63bfa7-9e90-4c81-bcc6-90e4ddfac939`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 284
  - Rule Text: Bio-titan boss creature stat block
- **Recommendation**:
  - Grants needed? No - This is a boss creature stat block, not a player-selectable entity
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ✅ Reviewed

## Entity: Tyrant

- **File**: `bio-titans.json`
- **ID**: `a7952eaa-4621-4f4f-8944-ee249d9a04a3`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 286
  - Rule Text: Bio-titan boss creature stat block
- **Recommendation**:
  - Grants needed? No - This is a boss creature stat block, not a player-selectable entity
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ✅ Reviewed

#### meld.json

## Entity: Meld Drone

- **File**: `meld.json`
- **ID**: `f04d6f2a-723a-45ec-91be-23be3b8275fa`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 289
  - Rule Text: Meld creature stat block
- **Recommendation**:
  - Grants needed? No - This is an enemy creature stat block, not a player-selectable entity
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ✅ Reviewed

## Entity: Meld Drone Swarm

- **File**: `meld.json`
- **ID**: `7b76574d-3eb3-4ed0-b658-b1a356fd4c7f`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 289
  - Rule Text: Meld creature stat block
- **Recommendation**:
  - Grants needed? No - This is an enemy creature stat block, not a player-selectable entity
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ✅ Reviewed

## Entity: Meld Nanoid

- **File**: `meld.json`
- **ID**: `f561bfeb-a9d5-4a9e-bc50-ddad52513684`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 289
  - Rule Text: Meld creature stat block
- **Recommendation**:
  - Grants needed? No - This is an enemy creature stat block, not a player-selectable entity. Note: Meld Splitter's "Split" action creates 2 Meld Nanoids when reduced to 0 SP, but this is a game mechanic, not a grant system.
  - Choices needed? No - No player customization required
- **Cross-References**: Referenced by Meld Splitter's Split action
- **Status**: ✅ Reviewed

## Entity: Meld Splitter

- **File**: `meld.json`
- **ID**: `e1286046-f761-4c74-ab76-2afb8da1aab7`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 270
  - Rule Text: Meld creature stat block with Split action that creates 2 Meld Nanoids
- **Recommendation**:
  - Grants needed? No - The Split action is a game mechanic that occurs during combat when reduced to 0 SP, not a grant system for player entities
  - Choices needed? No - No player customization required
- **Cross-References**: Creates Meld Nanoids via Split action (game mechanic, not grant)
- **Status**: ✅ Reviewed

## Entity: Meld Behemoth

- **File**: `meld.json`
- **ID**: `e13f967e-a2af-4c30-a3c0-153a14ec9fdf`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 290
  - Rule Text: Meld boss creature stat block
- **Recommendation**:
  - Grants needed? No - This is a boss creature stat block, not a player-selectable entity
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ✅ Reviewed

#### squads.json

## Entity: Waster Mob

- **File**: `squads.json`
- **ID**: `fa6feaf4-1202-4263-9e1a-a71a6f43a661`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 300
  - Rule Text: Squad stat block for encounters
- **Recommendation**:
  - Grants needed? No - This is an enemy squad stat block, not a player-selectable entity. Actions reference equipment (e.g., "Salvaging Tools") but these are descriptive, not grants.
  - Choices needed? No - No player customization required
- **Cross-References**: Actions reference equipment names descriptively
- **Status**: ✅ Reviewed

## Entity: Raider Band

- **File**: `squads.json`
- **ID**: `75f5e27f-64d7-4bd1-8f5b-46d38646e092`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 300
  - Rule Text: Squad stat block for encounters
- **Recommendation**:
  - Grants needed? No - This is an enemy squad stat block, not a player-selectable entity. Actions reference equipment descriptively.
  - Choices needed? No - No player customization required
- **Cross-References**: Actions reference equipment names descriptively
- **Status**: ✅ Reviewed

## Entity: Rifle Squad

- **File**: `squads.json`
- **ID**: `dea7128f-1361-43b5-b4d1-9273a38c606b`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 300
  - Rule Text: Squad stat block for encounters
- **Recommendation**:
  - Grants needed? No - This is an enemy squad stat block, not a player-selectable entity. Actions reference equipment descriptively.
  - Choices needed? No - No player customization required
- **Cross-References**: Actions reference equipment names descriptively
- **Status**: ✅ Reviewed

## Entity: Machine Gun Squad

- **File**: `squads.json`
- **ID**: `139b0d61-9739-4c20-8fc3-6bd12ab6c360`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 274
  - Rule Text: Squad stat block for encounters
- **Recommendation**:
  - Grants needed? No - This is an enemy squad stat block, not a player-selectable entity. Actions reference equipment descriptively.
  - Choices needed? No - No player customization required
- **Cross-References**: Actions reference equipment names descriptively
- **Status**: ✅ Reviewed

## Entity: Missile Squad

- **File**: `squads.json`
- **ID**: `f2542b86-1982-49da-8906-e5f672511161`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 300
  - Rule Text: Squad stat block for encounters
- **Recommendation**:
  - Grants needed? No - This is an enemy squad stat block, not a player-selectable entity. Actions reference equipment descriptively.
  - Choices needed? No - No player customization required
- **Cross-References**: Actions reference equipment names descriptively
- **Status**: ✅ Reviewed

## Entity: Elite Blade Squad

- **File**: `squads.json`
- **ID**: `9a88af6a-b207-443b-a45f-c7cb34262ed7`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 301
  - Rule Text: Squad stat block for encounters
- **Recommendation**:
  - Grants needed? No - This is an enemy squad stat block, not a player-selectable entity. Actions reference equipment descriptively.
  - Choices needed? No - No player customization required
- **Cross-References**: Actions reference equipment names descriptively
- **Status**: ✅ Reviewed

## Entity: Elite Beam Squad

- **File**: `squads.json`
- **ID**: `6fefee71-cbf6-4ce8-ba49-e8dd41c65f8b`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 301
  - Rule Text: Squad stat block for encounters
- **Recommendation**:
  - Grants needed? No - This is an enemy squad stat block, not a player-selectable entity. Actions reference equipment descriptively.
  - Choices needed? No - No player customization required
- **Cross-References**: Actions reference equipment names descriptively
- **Status**: ✅ Reviewed

## Entity: Wasteland Herd

- **File**: `squads.json`
- **ID**: `3263b60d-d599-45f8-b2e7-0d5382531bc1`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 270
  - Rule Text: Squad stat block for encounters
- **Recommendation**:
  - Grants needed? No - This is an enemy squad stat block, not a player-selectable entity
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ✅ Reviewed

## Entity: Drone Squadron

- **File**: `squads.json`
- **ID**: `99a017d5-5e92-4f3b-8696-7f1f806a0dbc`
- **Current State**:
  - Has grants? No
  - Has choices? No
- **Rule Reference**:
  - Page: 301
  - Rule Text: Squad stat block for encounters
- **Recommendation**:
  - Grants needed? No - This is an enemy squad stat block, not a player-selectable entity. Actions reference systems descriptively.
  - Choices needed? No - No player customization required
- **Cross-References**: Actions reference system names descriptively
- **Status**: ✅ Reviewed

#### drones.json

## Entity: Defacer Drone

- **File**: `drones.json`
- **ID**: `a2e4549e-d235-4647-9768-88372bf93afc`
- **Current State**:
  - Has grants? No (has `systems` array: ["Hover Locomotion System", "Chainsaw Arm"])
  - Has choices? No
- **Rule Reference**:
  - Page: 274
  - Rule Text: Drone reference data with systems listed
- **Recommendation**:
  - Grants needed? **Needs Review** - Drones have a `systems` array listing systems by name. If drones are added to player sheets (e.g., via Survey Drone ability), these systems might need to be grants. However, the systems array appears to be descriptive of the drone's default configuration, not automatic grants. The Survey Drone ability mentions drones can have systems attached similar to mechs, suggesting systems are added separately, not automatically granted.
  - Choices needed? No - No player customization required at entity level
- **Cross-References**: Referenced by Survey Drone ability (ability grants drone equipment, not the drone entity itself)
- **Status**: ⚠️ Needs Review - Clarify if drone systems should be grants

## Entity: Salvo Drone

- **File**: `drones.json`
- **ID**: `8620fe00-e899-4ff1-8a31-a3dec347b2df`
- **Current State**:
  - Has grants? No (has `systems` array: ["Hover Locomotion System", ".50 Cal Machine Gun"])
  - Has choices? No
- **Rule Reference**:
  - Page: 294
  - Rule Text: Drone reference data with systems listed
- **Recommendation**:
  - Grants needed? **Needs Review** - Same as Defacer Drone. Systems array appears descriptive, not grants.
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ⚠️ Needs Review - Clarify if drone systems should be grants

## Entity: Survey Drone

- **File**: `drones.json`
- **ID**: `89e32833-9150-4672-b7e6-2782d00976b4`
- **Current State**:
  - Has grants? No (has `systems` array: ["Hover Locomotion System", "Survey Scanner"])
  - Has choices? No
- **Rule Reference**:
  - Page: 294
  - Rule Text: Drone reference data. Also referenced by Survey Drone ability (p.48)
- **Recommendation**:
  - Grants needed? **Needs Review** - The Survey Drone ability grants "Survey Drone" equipment and mentions drones can have systems attached. The systems array likely represents default/pre-installed systems that should be grants when the drone is added to a player sheet.
  - Choices needed? No - No player customization required at entity level
- **Cross-References**: Referenced by Survey Drone ability (abilities.json)
- **Status**: ⚠️ Needs Review - Likely needs grants for systems array

## Entity: Combat Drone

- **File**: `drones.json`
- **ID**: `3144593e-93af-4d06-9178-5d40c74a32a0`
- **Current State**:
  - Has grants? No (has `systems` array: ["Hover Locomotion System", "Red Laser"])
  - Has choices? No
- **Rule Reference**:
  - Page: 270
  - Rule Text: Drone reference data with systems listed
- **Recommendation**:
  - Grants needed? **Needs Review** - Same as other drones. Systems array appears descriptive but may need to be grants.
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ⚠️ Needs Review - Clarify if drone systems should be grants

## Entity: Heavy Combat Drone

- **File**: `drones.json`
- **ID**: `3971ed10-6db8-4a01-bc76-fdd037f5d6c9`
- **Current State**:
  - Has grants? No (has `systems` array: ["Hover Locomotion System", "30mm Autocannon"])
  - Has choices? No
- **Rule Reference**:
  - Page: 270
  - Rule Text: Drone reference data with systems listed
- **Recommendation**:
  - Grants needed? **Needs Review** - Same as other drones. Systems array appears descriptive but may need to be grants.
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ⚠️ Needs Review - Clarify if drone systems should be grants

## Entity: Walker Drone

- **File**: `drones.json`
- **ID**: `774f56f5-1c8b-4508-b61b-5060b031468c`
- **Current State**:
  - Has grants? No (has `systems` array: ["Locomotion System", "Articulated Rigging Arm", "Green Laser"])
  - Has choices? No
- **Rule Reference**:
  - Page: 295
  - Rule Text: Drone reference data with systems listed
- **Recommendation**:
  - Grants needed? **Needs Review** - Same as other drones. Systems array appears descriptive but may need to be grants.
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ⚠️ Needs Review - Clarify if drone systems should be grants

## Entity: Pest Drone

- **File**: `drones.json`
- **ID**: `592f32ac-eed8-4cce-bfa1-2517b3d58091`
- **Current State**:
  - Has grants? No (has `systems` array: ["Spider Locomotion System", "FM-3 Flamethrower"])
  - Has choices? No
- **Rule Reference**:
  - Page: 270
  - Rule Text: Drone reference data with systems listed
- **Recommendation**:
  - Grants needed? **Needs Review** - Same as other drones. Systems array appears descriptive but may need to be grants.
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ⚠️ Needs Review - Clarify if drone systems should be grants

## Entity: Hover Drone

- **File**: `drones.json`
- **ID**: `123cfc16-f3a1-4a5c-ba6c-a109695a4358`
- **Current State**:
  - Has grants? No (has `systems` array: ["Hover Locomotion System", "Missile Pod"])
  - Has choices? No
- **Rule Reference**:
  - Page: 294
  - Rule Text: Drone reference data with systems listed
- **Recommendation**:
  - Grants needed? **Needs Review** - Same as other drones. Systems array appears descriptive but may need to be grants.
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ⚠️ Needs Review - Clarify if drone systems should be grants

## Entity: Needle Drone

- **File**: `drones.json`
- **ID**: `09e8ae26-2d39-4ba1-be81-e69bc263be13`
- **Current State**:
  - Has grants? No (has `systems` array: ["Hover Locomotion System"])
  - Has choices? No
- **Rule Reference**:
  - Page: 295
  - Rule Text: Drone reference data with systems listed
- **Recommendation**:
  - Grants needed? **Needs Review** - Same as other drones. Systems array appears descriptive but may need to be grants.
  - Choices needed? No - No player customization required
- **Cross-References**: None
- **Status**: ⚠️ Needs Review - Clarify if drone systems should be grants

### Agent 5 - Supporting Data

#### vehicles.json

**File Summary**: 7 vehicles (Power Loader, Box Wheel, Fighting Box Wheel, Armoured Box Wheel, Tank, Rotorcraft, Machine Gun Turret)

**Analysis**: Vehicles are reference data for vehicles encountered in the game world (pages 292-293). They are NOT player-selectable entities stored in `suentities`. Vehicles list systems as string arrays (e.g., `["Locomotion System", ".50 Cal Machine Gun"]`), but these are descriptive references, not grants. Vehicles are encountered/salvaged during gameplay, not added to player sheets.

**Recommendation**:

- **Grants needed?** No - Vehicles are not player-selectable entities. The systems listed are descriptive, not automatic grants.
- **Choices needed?** No - Vehicles are not player-selectable entities.

**Cross-References**:

- Systems referenced by name in vehicle `systems` arrays (e.g., "Locomotion System", ".50 Cal Machine Gun")
- Vehicles may be referenced in salvage tables or encounter tables, but are not stored as suentities

**Status**: ✅ Reviewed - No changes needed

---

#### distances.json

**File Summary**: 4 distance categories (Close, Medium, Long, Far)

**Analysis**: Distances are game mechanics for range categories (page 237). They are pure reference data used to determine weapon ranges, movement distances, and attack ranges. They are NOT entities that can be selected, granted, or stored in `suentities`. They are lookup/reference data only.

**Recommendation**:

- **Grants needed?** No - Distances are game mechanics, not selectable entities.
- **Choices needed?** No - Distances are game mechanics, not selectable entities.

**Cross-References**:

- Referenced in system/module actions via `range` arrays (e.g., `range: ["Close"]`)
- Used throughout the game rules for determining effective ranges

**Status**: ✅ Reviewed - No changes needed

---

#### roll-tables.json

**File Summary**: 20 roll tables (Core Mechanic, Group Initiative, Critical Injury, Critical Damage, Reactor Overload, Area Salvage, Mech Salvage, Reaction Roll, NPC Action, Morale, Retreat, Crawler Deterioration, Crawler Damage, Crawler Destruction, Keepsake, Motto, Pilot Appearance, A.I. Personality, Quirks, Mech Appearance, Mech Pattern Names, Crawler Name)

**Analysis**: Roll tables are lookup tables for random outcomes. They are referenced by choices via the `rollTable` property (e.g., `rollTable: "A.I. Personality"`). Roll tables themselves are NOT entities that can be selected, granted, or stored in `suentities`. They are pure data tables used for resolving random outcomes.

**Recommendation**:

- **Grants needed?** No - Roll tables are lookup tables, not selectable entities.
- **Choices needed?** No - Roll tables are lookup tables. Choices reference roll tables via `rollTable` property, but the tables themselves don't require choices.

**Cross-References**:

- Referenced by choices in abilities, equipment, systems, modules, crawler-bays, and crawlers via `rollTable` property
- Examples: "A.I. Personality" table referenced by crawler bay NPC choices, "Keepsake" and "Motto" tables referenced by pilot character creation

**Status**: ✅ Reviewed - No changes needed

---

#### ability-tree-requirements.json

**File Summary**: 20 ability tree requirements (Advanced Engineer, Legendary Engineer, Fabricator, Legendary Fabricator, Advanced Hacking, Legendary Hacker, Cyborg, Legendary Cyborg, Advanced Soldier, Legendary Soldier, Ranger, Legendary Ranger, Advanced Scout, Legendary Scout, Smuggler, Legendary Smuggler, Advanced Hauler, Legendary Hauler, Union Rep, Legendary Union Rep)

**Analysis**: Ability tree requirements are metadata that define prerequisites for unlocking ability trees. They specify which ability trees must be completed before accessing advanced/legendary trees. They are NOT entities that can be selected, granted, or stored in `suentities`. They are validation metadata used by the application to determine tree unlock status.

**Recommendation**:

- **Grants needed?** No - Ability tree requirements are metadata, not selectable entities.
- **Choices needed?** No - Ability tree requirements are metadata, not selectable entities.

**Cross-References**:

- Used by the application to validate ability tree prerequisites
- Referenced by ability tree system to determine which trees are available to players
- Each requirement specifies a `requirement` array of prerequisite tree names

**Status**: ✅ Reviewed - No changes needed

## Summary Statistics

- **Total Entities Audited**: ~338+ / [TBD]
  - Agent 1: ~260+ entities (~200 abilities + 6 core classes + 10 advanced classes + ~50 equipment + all chassis)
  - Agent 3: 27 entities (5 crawlers + 10 crawler-bays + 6 crawler-tech-levels + 6 npcs)
  - Agent 5: 51 entities (7 vehicles + 4 distances + 20 roll tables + 20 ability tree requirements)
- **Entities Needing Grants**: 1
  - Agent 1: 1 (Holo Companion ability needs to grant Holo Companion equipment)
  - Agent 3: 0 (crawler entities don't grant other entities)
  - Agent 5: 0 (reference/metadata entities)
- **Entities Needing Choices**: 18
  - Agent 1: 2 (Custom Sniper Rifle equipment, Holo Companion equipment)
  - Agent 2: 1 (Auto-Repair Droid module needs A.I. Personality choice)
  - Agent 3: 15 entities need "Name" choice added (5 crawlers + 10 crawler-bays - per Phase 4 migration plan)
  - Agent 5: 0 (reference/metadata entities)
- **Entities Correctly Configured**: 364
  - Agent 2: 301 entities correctly configured (95 systems + 60 modules + 58 traits + 88 keywords)
  - Agent 3: 12 entities correctly configured (6 crawler-tech-levels + 6 npcs - stat blocks, not selectable)
  - Agent 5: 51 entities correctly configured (all are reference/metadata, not player-selectable)
- **Status**: Agent 2, 3 & 5 Complete - Phase 3 Work Done

## Notes

- This audit is based on the Salvage Union Workshop Manual rules
- Cross-references should be checked between all data files
- NPC name choices will be added as part of Phase 4 migration
- All recommendations should be reviewed before implementation
