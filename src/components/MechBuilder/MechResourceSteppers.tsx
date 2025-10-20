import NumericStepper from '../NumericStepper'
import type { Chassis } from 'salvageunion-reference'

interface MechResourceSteppersProps {
  stats: Chassis['stats'] | undefined
  currentSP: number
  currentEP: number
  currentHeat: number
  onSPChange: (value: number) => void
  onEPChange: (value: number) => void
  onHeatChange: (value: number) => void
}

export function MechResourceSteppers({
  stats,
  currentSP,
  currentEP,
  currentHeat,
  onSPChange,
  onEPChange,
  onHeatChange,
}: MechResourceSteppersProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <NumericStepper
        label="SP"
        value={currentSP}
        onChange={onSPChange}
        max={stats?.structure_pts || 0}
      />
      <NumericStepper
        label="EP"
        value={currentEP}
        onChange={onEPChange}
        max={stats?.energy_pts || 0}
      />
      <NumericStepper
        label="HEAT"
        value={currentHeat}
        onChange={onHeatChange}
        max={stats?.heat_cap || 0}
      />
    </div>
  )
}
