import type { SURefMetaEntity } from 'salvageunion-reference'
import {
  getSlotsRequired,
  getSalvageValue,
  getStructurePoints,
  getEnergyPoints,
  getHeatCapacity,
  getSystemSlots,
  getModuleSlots,
  getCargoCapacity,
  getHitPoints,
} from 'salvageunion-reference'

export interface StatConfig {
  /** Getter function to extract stat value from entity */
  getter: (data: SURefMetaEntity) => number | undefined
  /** Label for compact mode */
  compactLabel: string
  /** Label for normal mode */
  normalLabel: string
  /** Bottom label for compact mode (empty string to hide) */
  compactBottomLabel: string
  /** Bottom label for normal mode */
  normalBottomLabel: string
}

/**
 * Configuration for all entity stats displayed in EntityStats component.
 * Order matters - stats will be rendered in this order.
 */
export const ENTITY_STATS_CONFIG: StatConfig[] = [
  {
    getter: getSlotsRequired,
    compactLabel: 'Slots',
    normalLabel: 'Slots',
    compactBottomLabel: '',
    normalBottomLabel: 'Required',
  },
  {
    getter: getStructurePoints,
    compactLabel: 'SP',
    normalLabel: 'Structure',
    compactBottomLabel: '',
    normalBottomLabel: 'Points',
  },
  {
    getter: getHitPoints,
    compactLabel: 'HP',
    normalLabel: 'Hit',
    compactBottomLabel: '',
    normalBottomLabel: 'Points',
  },
  {
    getter: getEnergyPoints,
    compactLabel: 'EP',
    normalLabel: 'Energy',
    compactBottomLabel: '',
    normalBottomLabel: 'Points',
  },
  {
    getter: getSalvageValue,
    compactLabel: 'SV',
    normalLabel: 'Salvge',
    compactBottomLabel: '',
    normalBottomLabel: 'Value',
  },
  {
    getter: getSystemSlots,
    compactLabel: 'Sys',
    normalLabel: 'System',
    compactBottomLabel: 'Slts',
    normalBottomLabel: 'Slots',
  },
  {
    getter: getModuleSlots,
    compactLabel: 'Mod',
    normalLabel: 'Module',
    compactBottomLabel: 'Slts',
    normalBottomLabel: 'Slots',
  },
  {
    getter: getCargoCapacity,
    compactLabel: 'Crgo',
    normalLabel: 'Cargo',
    compactBottomLabel: 'Cap',
    normalBottomLabel: 'Capacity',
  },
  {
    getter: getHeatCapacity,
    compactLabel: 'Heat',
    normalLabel: 'Heat',
    compactBottomLabel: 'Cap',
    normalBottomLabel: 'Capacity',
  },
]

/**
 * Apply label formatting (prefix, zero handling)
 */
export function applyStatLabel(
  value: number | string | undefined,
  prefix: string = ''
): string | undefined {
  if (value === undefined) return undefined
  if (value === 0) return '-'
  return `${prefix}${value}`
}
