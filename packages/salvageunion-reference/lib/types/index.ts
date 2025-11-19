/**
 * Auto-generated TypeScript type exports
 * DO NOT EDIT MANUALLY
 */

// Import types for use in union types
import type {
  SURefAbility,
  SURefMetaAbilityTreeRequirement,
  SURefBioTitan,
  SURefChassis,
  SURefMetaChassisAbility,
  SURefAdvancedClass,
  SURefCoreClass,
  SURefCrawlerBay,
  SURefMetaCrawlerTechLevel,
  SURefCrawler,
  SURefCreature,
  SURefDistance,
  SURefDrone,
  SURefEquipment,
  SURefKeyword,
  SURefMeld,
  SURefModule,
  SURefNPC,
  SURefRollTable,
  SURefSquad,
  SURefSystem,
  SURefTrait,
  SURefVehicle,
} from './schemas.js'

// Export all enum types
export type * from './enums.js'

// Export all common types
export type * from './common.js'

// Export all object types
export type * from './objects.js'

// Export all schema types
export type * from './schemas.js'

// Re-export specific commonly used types for convenience
export type {
  SURefSchemaName,
  SURefTree,
  SURefActionType,
  SURefDamageType,
  SURefRange,
  SURefSource,
  SURefClassType,
  SURefContentType,
} from './enums.js'

export type {
  SURefId,
  SURefName,
  SURefTechLevel,
  SURefSalvageValue,
  SURefHitPoints,
  SURefStructurePoints,
  SURefPositiveInteger,
  SURefNonNegativeInteger,
  SURefActivationCost,
  SURefAssetUrl,
} from './common.js'

export type {
  SURefMetaTrait,
  SURefMetaStats,
  SURefMetaChassisStats,
  SURefMetaEquipmentStats,
  SURefMetaDataValue,
  SURefMetaChoice,
  SURefMetaNpc,
  SURefMetaSystemModule,
  SURefMetaTable,
  SURefMetaAdvancedClass,
  SURefMetaAction,
  SURefMetaGrant,
  SURefMetaChoices,
  SURefMetaContent,
  SURefMetaContentBlock,
  SURefMetaPattern,
  SURefMetaSystems,
  SURefMetaModules,
  SURefMetaTraits,
  SURefMetaBaseEntity,
  SURefMetaCombatEntity,
  SURefMetaMechanicalEntity,
  SURefMetaSchemaName,
} from './objects.js'

// Union type of all entity types (excludes meta schemas)
export type SURefEntity =
  | SURefAbility
  | SURefBioTitan
  | SURefChassis
  | SURefAdvancedClass
  | SURefCoreClass
  | SURefCrawlerBay
  | SURefCrawler
  | SURefCreature
  | SURefDistance
  | SURefDrone
  | SURefEquipment
  | SURefKeyword
  | SURefMeld
  | SURefModule
  | SURefNPC
  | SURefRollTable
  | SURefSquad
  | SURefSystem
  | SURefTrait
  | SURefVehicle

// Union type of all meta entity types (entities with common base properties)
// Includes meta schemas and chassis abilities
export type SURefMetaEntity =
  | SURefAbility
  | SURefMetaAbilityTreeRequirement
  | SURefBioTitan
  | SURefChassis
  | SURefMetaChassisAbility
  | SURefAdvancedClass
  | SURefCoreClass
  | SURefCrawlerBay
  | SURefMetaCrawlerTechLevel
  | SURefCrawler
  | SURefCreature
  | SURefDistance
  | SURefDrone
  | SURefEquipment
  | SURefKeyword
  | SURefMeld
  | SURefModule
  | SURefNPC
  | SURefRollTable
  | SURefSquad
  | SURefSystem
  | SURefTrait
  | SURefVehicle
