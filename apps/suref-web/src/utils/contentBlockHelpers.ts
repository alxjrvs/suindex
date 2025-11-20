import type { SURefObjectContentBlock } from 'salvageunion-reference'

/**
 * Replace [(CHASSIS)] placeholder with actual chassis name, prefixed with "The"
 *
 * @param text - Text that may contain [(CHASSIS)] placeholders
 * @param chassisName - Optional chassis name to replace placeholders with
 * @returns Text with placeholders replaced, or original text if no chassis name provided
 */
export function replaceChassisPlaceholder(text: string | undefined, chassisName?: string): string {
  if (!text) return ''
  if (!chassisName) return text
  return text.replace(/\[\(CHASSIS\)\]/g, `The ${chassisName}`)
}

/**
 * Extract and parse string value from a content block
 *
 * @param block - Content block to extract string value from
 * @param chassisName - Optional chassis name to replace [(CHASSIS)] placeholders
 * @returns Parsed string value with placeholders replaced
 */
export function parseContentBlockString(
  block: SURefObjectContentBlock,
  chassisName?: string
): string {
  const blockValue = block.value
  const stringValue = typeof blockValue === 'string' ? blockValue : ''
  return replaceChassisPlaceholder(stringValue, chassisName)
}
