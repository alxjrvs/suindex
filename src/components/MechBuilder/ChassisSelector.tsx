import type { Chassis } from 'salvageunion-reference'

interface ChassisSelectorProps {
  chassisId: string | null
  allChassis: Chassis[]
  onChange: (chassisId: string) => void
}

export function ChassisSelector({ chassisId, allChassis, onChange }: ChassisSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase">Chassis</label>
      <select
        value={chassisId || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold"
      >
        <option value="">Select a chassis...</option>
        {allChassis.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  )
}
