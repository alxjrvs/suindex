import type { SURefObjectContentBlock } from 'salvageunion-reference'

/**
 * Extract the string value from a paragraph content block
 * @param content - Array of content blocks
 * @returns The string value from the first paragraph block, or undefined if not found
 */
export function getParagraphString(
  content: SURefObjectContentBlock[] | undefined
): string | undefined {
  if (!content) return undefined
  const block = content.find((b) => !b.type || b.type === 'paragraph')
  if (!block) return undefined
  return typeof block.value === 'string' ? block.value : undefined
}
