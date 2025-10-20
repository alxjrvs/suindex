import StatDisplay from './StatDisplay'

interface NumericStepperProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max: number
  step?: number
}

export default function NumericStepper({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
}: NumericStepperProps) {
  const handleIncrement = () => {
    if (value < max) {
      onChange(Math.min(value + step, max))
    }
  }

  const handleDecrement = () => {
    if (value > min) {
      onChange(Math.max(value - step, min))
    }
  }

  return (
    <div className="flex items-end gap-2">
      <StatDisplay label={label} value={`${value}/${max}`} />
      <div className="flex flex-col gap-1 pb-2.5">
        <button
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-5 h-5 bg-[#e8e5d8] rounded text-[#2d3e36] text-xs font-bold flex items-center justify-center hover:bg-[#d8d5c8] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#e8e5d8]"
        >
          ▲
        </button>
        <button
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-5 h-5 bg-[#e8e5d8] rounded text-[#2d3e36] text-xs font-bold flex items-center justify-center hover:bg-[#d8d5c8] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#e8e5d8]"
        >
          ▼
        </button>
      </div>
    </div>
  )
}
