import NumericStepper from '../NumericStepper'

interface PilotResourceSteppersProps {
  maxHP: number
  currentHP: number
  maxAP: number
  currentAP: number
  currentTP: number
  onHPChange: (value: number) => void
  onAPChange: (value: number) => void
  onTPChange: (value: number) => void
  disabled?: boolean
}

export function PilotResourceSteppers({
  maxHP,
  currentHP,
  maxAP,
  currentAP,
  currentTP,
  onHPChange,
  onAPChange,
  onTPChange,
  disabled = false,
}: PilotResourceSteppersProps) {
  return (
    <div className="bg-[var(--color-su-orange)] border-8 border-[var(--color-su-orange)] rounded-3xl p-6 shadow-lg">
      <div className="flex flex-col items-center space-y-2">
        <NumericStepper
          label="HP"
          value={currentHP}
          onChange={onHPChange}
          max={maxHP}
          disabled={disabled}
        />
        <NumericStepper
          label="AP"
          value={currentAP}
          onChange={onAPChange}
          max={maxAP}
          disabled={disabled}
        />
        <NumericStepper label="TP" value={currentTP} onChange={onTPChange} disabled={disabled} />
      </div>
    </div>
  )
}
