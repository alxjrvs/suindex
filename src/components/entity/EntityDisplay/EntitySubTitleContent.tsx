import { DetailsList } from '../../shared/DetailsList'
import type { EntityDisplaySubProps } from './types'

export function EntitySubTitleElement({ data, schemaName, compact }: EntityDisplaySubProps) {
  return <DetailsList data={data} schemaName={schemaName} compact={compact} />
}
