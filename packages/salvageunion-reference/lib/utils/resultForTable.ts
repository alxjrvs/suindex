import type { SURefMetaTable } from '../types/index.js'

/**
 * Result type for table roll resolution
 */
export type TableRollResult = { success: boolean; result: string; key: string }

/**
 * Resolves a d20 roll against a table to get the result string
 *
 * @param table - The roll table data (SURefRollTable['table'] | SURefSystem['table'] | undefined)
 * @param roll - The d20 roll result (1-20)
 * @returns Object with success flag and either the result string or error message
 *
 * @example
 * const rollTable = SalvageUnionReference.RollTables.findByName('Core Mechanic');
 * const result = resultForTable(rollTable?.table, 15);
 * if (result.success) {
 *   console.log(result.result); // "Success: You have achieved your goal..."
 * } else {
 *   console.error(result.error);
 * }
 */
export function resultForTable(table: SURefMetaTable | undefined, roll: number): TableRollResult {
  if (!table) {
    return {
      success: false,
      result: 'Table data is undefined',
      key: '',
    }
  }

  if (roll < 1 || roll > 20) {
    return {
      success: false,
      result: `Roll must be between 1 and 20, got ${roll}`,
      key: '',
    }
  }

  const tableData = table as Record<string, unknown>
  const numericKeys = Object.keys(tableData).filter((k) => /^\d+(-\d+)?$/.test(k))

  // Detect if this is a flat table (has all 20 individual keys)
  if (numericKeys.length === 20 && numericKeys.every((k) => !k.includes('-'))) {
    const key = roll.toString()
    const result = tableData[key]
    if (result && typeof result === 'string') {
      return {
        success: true,
        result,
        key,
      }
    }
    return {
      success: false,
      result: `No result found for roll ${roll} in flat table`,
      key: '',
    }
  }

  return findRangeResult(tableData, roll)
}

/**
 * Finds the result for a given roll in a range-based table
 * Automatically detects the range structure from available keys
 */
function findRangeResult(rollTable: Record<string, unknown>, roll: number): TableRollResult {
  const exactKey = roll.toString()
  const exactResult = rollTable[exactKey]
  if (exactResult && typeof exactResult === 'string') {
    return {
      success: true,
      result: exactResult,
      key: exactKey,
    }
  }

  // Get all numeric range keys (e.g., "2-5", "11-19")
  const rangeKeys = Object.keys(rollTable).filter((k) => k.includes('-'))

  for (const rangeKey of rangeKeys) {
    if (rollInRange(roll, rangeKey)) {
      const result = rollTable[rangeKey]
      if (result && typeof result === 'string') {
        return {
          success: true,
          result,
          key: rangeKey,
        }
      }
    }
  }

  return {
    success: false,
    result: `No result found for roll ${roll}`,
    key: '',
  }
}

/**
 * Checks if a roll falls within a range string
 * Handles formats like "1", "2-5", "11-19", etc.
 */
function rollInRange(roll: number, range: string): boolean {
  // Single value
  if (!range.includes('-')) {
    return roll === parseInt(range, 10)
  }

  // Range format "X-Y"
  const [minStr, maxStr] = range.split('-')
  const min = parseInt(minStr, 10)
  const max = parseInt(maxStr, 10)

  return roll >= min && roll <= max
}
