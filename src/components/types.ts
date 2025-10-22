import type {
  System,
  Module,
  Equipment,
  BioTitan,
  NPC,
  Meld,
  Squad,
  Creature,
  Ability,
} from 'salvageunion-reference'

export type Action =
  | NonNullable<Ability['subAbilities']>[number]
  | NonNullable<System['actions']>[number]
  | NonNullable<Module['actions']>[number]
  | NonNullable<Equipment['actions']>[number]
  | BioTitan['abilities'][number]
  | NPC['abilities'][number]
  | NonNullable<Meld['abilities']>[number]
  | NonNullable<Squad['abilities']>[number]
  | Creature['abilities'][number]
