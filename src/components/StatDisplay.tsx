interface StatDisplayProps {
  label: string
  value: string | number
  labelId?: string
}

export function StatDisplay({ label, value, labelId }: StatDisplayProps) {
  return (
    <div className="flex flex-col items-center">
      <label className="text-xs font-bold text-[#e8e5d8] mb-1 block" id={labelId}>
        {label}
      </label>
      <div className="w-16 h-16 border-0 rounded-2xl bg-[#e8e5d8] flex items-center justify-center pt-1">
        <span className="text-lg font-bold text-[#2d3e36]">{value}</span>
      </div>
    </div>
  )
}
