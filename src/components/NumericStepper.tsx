import { StatDisplay } from './StatDisplay'

interface NumericStepperProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

export default function NumericStepper({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  disabled = false,
}: NumericStepperProps) {
  const handleIncrement = () => {
    if (max === undefined || value < max) {
      onChange(max !== undefined ? Math.min(value + step, max) : value + step)
    }
  }

  const handleDecrement = () => {
    if (value > min) {
      onChange(Math.max(value - step, min))
    }
  }

  const displayValue = max !== undefined ? `${value}/${max}` : `${value}`
  const labelId = `stepper-label-${label.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className="flex items-end gap-1" role="group" aria-labelledby={labelId}>
      <StatDisplay label={label} value={displayValue} labelId={labelId} />
      <div className="flex flex-col gap-1 pb-2.5">
        <button
          onClick={handleIncrement}
          disabled={disabled || (max !== undefined && value >= max)}
          className="w-5 h-5 bg-[#e8e5d8] rounded text-[#2d3e36] text-xs font-bold flex items-center justify-center hover:bg-[#d8d5c8] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#e8e5d8]"
          aria-label={`Increment ${label}`}
        >
          ▲
        </button>
        <button
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className="w-5 h-5 bg-[#e8e5d8] rounded text-[#2d3e36] text-xs font-bold flex items-center justify-center hover:bg-[#d8d5c8] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#e8e5d8]"
          aria-label={`Decrement ${label}`}
        >
          ▼
        </button>
      </div>
    </div>
  )
}
