import type { Chassis } from 'salvageunion-reference'

interface ChassisAbilitiesProps {
  chassis: Chassis | undefined
}

export function ChassisAbilities({ chassis }: ChassisAbilitiesProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase">
        Chassis Ability
      </label>
      <div className="space-y-3">
        {(
          chassis?.chassis_abilities || [
            {
              name: '',
              description: 'No chassis selected.',
              options: [{ label: '', value: '' }],
            },
          ]
        ).map((ability, idx) => (
          <div key={idx} className="bg-[#e8e5d8] border-2 border-[#2d3e36] rounded-2xl p-4">
            {ability.name && (
              <h3 className="font-bold text-[#2d3e36] text-lg mb-2">{ability.name}</h3>
            )}
            {ability.description && (
              <p className="text-[#2d3e36] leading-relaxed">{ability.description}</p>
            )}
            {'options' in ability &&
              ability.options &&
              Array.isArray(ability.options) &&
              ability.options.length > 0 && (
                <div className="mt-3 ml-4 space-y-1">
                  {ability.options.map((option, optIndex) => (
                    <div key={optIndex} className="text-[#2d3e36]">
                      <span className="font-bold">
                        {option.label}
                        {option.label.includes('•') || option.label.length === 0 ? '' : ':'}
                      </span>{' '}
                      {option.value}
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  )
}
