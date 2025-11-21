import type { SURefCrawlerBay } from 'salvageunion-reference'
import { BayInfo as UnifiedBayInfo } from '@/components/shared/BayInfo'

interface BayInfoProps {
  bayRef: SURefCrawlerBay
  bayEntityId: string
}

export function BayInfo({ bayRef, bayEntityId }: BayInfoProps) {
  return <UnifiedBayInfo mode="entity" bayRef={bayRef} bayEntityId={bayEntityId} />
}
