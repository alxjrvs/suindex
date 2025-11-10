import { useMemo, type ReactNode } from 'react'
import { EntityDetailDisplay } from '../components/entity/EntityDetailDisplay'

/**
 * Hook to parse text content for trait references and replace them with EntityDetailDisplay components
 *
 * Supports two bracket notation patterns:
 * 1. Simple traits: [[trait-name]] → EntityDetailDisplay with label="trait-name"
 * 2. Traits with parameters: [[[Trait Name] (parameter)]] → EntityDetailDisplay with label="trait-name", value="parameter"
 *
 * Performance: Uses useMemo to prevent re-parsing on every render
 * Returns original text as-is if no bracket notation found (common case)
 * EntityDetailDisplay uses useMemo to cache entity lookups for performance
 *
 * @param text - The text content to parse
 * @returns Original text string if no matches, or array of React nodes (strings and EntityDetailDisplay components) if matches found
 *
 * @example
 * const parsed = useParseTraitReferences("This has [[vulnerable]] trait")
 * // Returns: ["This has ", <EntityDetailDisplay label="vulnerable" schemaName="traits" />, " trait"]
 *
 * @example
 * const parsed = useParseTraitReferences("This has [[[explosive] (4)]] trait")
 * // Returns: ["This has ", <EntityDetailDisplay label="explosive" schemaName="traits" value="4" />, " trait"]
 *
 * @example
 * const parsed = useParseTraitReferences("No trait references here")
 * // Returns: "No trait references here" (original string, not parsed)
 */
export function useParseTraitReferences(text: string | undefined): ReactNode {
  return useMemo(() => {
    if (!text) {
      return null
    }

    // Early return if no bracket notation found - this is the common case
    if (!text.includes('[[')) {
      return text
    }

    const nodes: ReactNode[] = []
    let currentIndex = 0

    // Combined regex to match both patterns:
    // 1. [[[Trait Name] (parameter)]] - trait with parameter
    // 2. [[trait-name]] - simple trait
    const traitRegex = /\[\[\[([^\]]+)\]\s*\(([^)]+)\)\]\]|\[\[([^\]]+)\]\]/g

    let match: RegExpExecArray | null

    while ((match = traitRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        nodes.push(text.substring(currentIndex, match.index))
      }

      // Check which pattern matched
      if (match[1] !== undefined && match[2] !== undefined) {
        // Pattern 1: [[[Trait Name] (parameter)]]
        const traitName = match[1].trim()
        const paramValue = match[2].trim()

        nodes.push(
          <EntityDetailDisplay
            key={`trait-${match.index}`}
            label={traitName}
            schemaName="traits"
            value={paramValue}
            compact
          />
        )
      } else if (match[3] !== undefined) {
        // Pattern 2: [[trait-name]]
        const traitName = match[3].trim()

        nodes.push(
          <EntityDetailDisplay
            key={`trait-${match.index}`}
            label={traitName}
            schemaName="traits"
            compact
          />
        )
      }

      currentIndex = match.index + match[0].length
    }

    // Add remaining text after the last match
    if (currentIndex < text.length) {
      nodes.push(text.substring(currentIndex))
    }

    // If no matches were found, return the original text as-is
    return nodes.length === 0 ? text : nodes
  }, [text])
}
