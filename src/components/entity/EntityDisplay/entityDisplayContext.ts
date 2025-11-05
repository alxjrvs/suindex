import { createContext } from 'react'
import type { ReactNode } from 'react'
import type { ButtonProps } from '@chakra-ui/react'
import type { SURefMetaEntity, SURefMetaSchemaName } from 'salvageunion-reference'

/**
 * Spacing helpers based on compact mode
 */
export const getEntitySpacing = (compact: boolean) => ({
  /** Gap between small elements: 2 (compact) or 3 (normal) */
  smallGap: compact ? 2 : 3,
  /** Gap for minimal spacing: 0.5 (compact) or 1 (normal) */
  minimalGap: compact ? 0.5 : 1,
  /** Gap for single spacing: 1 (compact) or 2 (normal) */
  contentPadding: compact ? 1 : 2,
})

/**
 * Font size helpers based on compact mode
 */
export const getEntityFontSizes = (compact: boolean) => ({
  /** Extra small text */
  xs: compact ? '2xs' : 'xs',
  /** Small text */
  sm: compact ? 'xs' : 'sm',
  /** Medium text */
  md: compact ? 'sm' : 'md',
  /** Large text */
  lg: compact ? 'md' : 'lg',
})

export interface EntityDisplayContextValue {
  /** Entity data */
  data: SURefMetaEntity
  /** Schema name */
  schemaName: SURefMetaSchemaName
  /** Compact mode flag */
  compact: boolean
  /** Computed entity name */
  title: string
  /** Computed tech level */
  techLevel: number | undefined
  /** Computed header background color */
  headerBg: string
  /** Spacing values */
  spacing: ReturnType<typeof getEntitySpacing>
  /** Font size values */
  fontSize: ReturnType<typeof getEntityFontSizes>
  /** Content background color */
  contentBg: string
  /** Computed opacity values */
  opacity: { header: number; content: number }
  /** Whether to show extra content sections */
  shouldShowExtraContent: boolean
  /** Header click handler */
  handleHeaderClick: () => void
  /** Whether the component is expanded */
  isExpanded: boolean
  /** Whether the component is collapsible */
  collapsible: boolean
  /** Whether to hide actions */
  hideActions: boolean
  /** Whether to hide tech level */
  hideLevel: boolean
  /** Right label for header */
  rightLabel?: string
  /** Whether the component is disabled */
  disabled: boolean
  /** Button configuration */
  buttonConfig?: ButtonProps & { children: ReactNode }
  /** User choices for entity options */
  userChoices?: Record<string, string> | null
  /** Choice selection handler */
  onChoiceSelection?: (choiceId: string, value: string | undefined) => void
  /** Children to render in the content area */
  children?: ReactNode
}

export const EntityDisplayContext = createContext<EntityDisplayContextValue | null>(null)
