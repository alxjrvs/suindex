import type { HydratedBay } from '@/types/hydrated'
import { BayCard as UnifiedBayCard } from '@/components/shared/BayCard'

interface BayCardProps {
  bay: HydratedBay
  disabled?: boolean
  readOnly?: boolean
}

export function BayCard({ bay, disabled = false, readOnly = false }: BayCardProps) {
  return <UnifiedBayCard mode="entity" bay={bay} disabled={disabled} readOnly={readOnly} />
}
