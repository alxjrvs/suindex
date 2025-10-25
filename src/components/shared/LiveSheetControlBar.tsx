import { useMemo } from 'react'
import { SheetSelect } from './SheetSelect'
import { ControlBarContainer } from './ControlBarContainer'
import { LinkButton } from './LinkButton'
import { useEntityRelationships } from '../../hooks/useEntityRelationships'
import type { Database } from '../../types/database'

type TableName = keyof Database['public']['Tables']

export interface ControlBarConfig {
  table: TableName
  selectFields: string
  nameField: string
  label: string
  backgroundColor: string
  linkLabel: string
  linkPath: (id: string) => string
}

interface LiveSheetControlBarProps {
  config: ControlBarConfig
  relationId?: string | null
  savedRelationId?: string | null
  onRelationChange: (id: string | null) => void
  hasPendingChanges?: boolean
}

/**
 * Generic control bar component for LiveSheet pages.
 * Handles loading related entities and displaying a selector with link button.
 *
 * @example
 * ```tsx
 * <LiveSheetControlBar
 *   config={PILOT_CONTROL_BAR_CONFIG}
 *   relationId={pilot.crawler_id}
 *   savedRelationId={savedCrawlerId}
 *   onRelationChange={(crawlerId) => updatePilot({ crawler_id: crawlerId })}
 *   hasPendingChanges={hasPendingChanges}
 * />
 * ```
 */
export function LiveSheetControlBar({
  config,
  relationId,
  savedRelationId,
  onRelationChange,
  hasPendingChanges = false,
}: LiveSheetControlBarProps) {
  const { items, loading } = useEntityRelationships<Record<string, string>>({
    table: config.table,
    selectFields: config.selectFields,
    orderBy: config.nameField,
  })

  // Map items to { id, name } format for SheetSelect
  const options = useMemo(
    () => items.map((item) => ({ id: item.id, name: item[config.nameField] })),
    [items, config.nameField]
  )

  return (
    <ControlBarContainer
      backgroundColor={config.backgroundColor}
      hasPendingChanges={hasPendingChanges}
      leftContent={
        <SheetSelect
          label={config.label}
          value={relationId ?? null}
          loading={loading}
          options={options}
          onChange={onRelationChange}
          placeholder={`No ${config.label}`}
        />
      }
      rightContent={
        savedRelationId && (
          <LinkButton to={config.linkPath(savedRelationId)} label={config.linkLabel} />
        )
      }
    />
  )
}
