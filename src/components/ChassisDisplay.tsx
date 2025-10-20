import { Frame } from './shared/Frame'
import { StatList } from './shared/StatList'
import type { Chassis } from 'salvageunion-reference'

interface ChassisDisplayProps {
  data: Chassis
}

export function ChassisDisplay({ data }: ChassisDisplayProps) {
  const stats = data.stats

  return (
    <div className="space-y-6">
      {/* Main Chassis Info */}
      <Frame
        header={data.name}
        techLevel={stats.tech_level}
        description={data.description}
        showSidebar={false}
        headerContent={
          <div className="ml-auto pb-6" style={{ overflow: 'visible' }}>
            <StatList
              stats={[
                { label: 'Structure Pts.', value: stats.structure_pts },
                { label: 'Energy Pts.', value: stats.energy_pts },
                { label: 'Heat Cap.', value: stats.heat_cap },
                { label: 'System Slots', value: stats.system_slots },
                { label: 'Module Slots', value: stats.module_slots },
                { label: 'Cargo Cap.', value: stats.cargo_cap },
                { label: 'Tech Level', value: stats.tech_level },
                { label: 'Salvage Value', value: stats.salvage_value },
              ]}
              notes={'notes' in stats && typeof stats.notes === 'string' ? stats.notes : undefined}
              up={false}
            />
          </div>
        }
      >
        {/* Chassis Abilities */}
        {data.chassis_abilities && data.chassis_abilities.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-[var(--color-su-black)] uppercase">
              Chassis Abilities
            </h4>
            <div className="border border-[var(--color-su-black)] p-3 space-y-3">
              {data.chassis_abilities.map((ability, index) => (
                <div key={index} className="space-y-2">
                  <div>
                    {ability.name && (
                      <span className="font-bold text-[var(--color-su-black)]">
                        {ability.name}:{' '}
                      </span>
                    )}
                    <span className="text-[var(--color-su-black)]">{ability.description}</span>
                  </div>

                  {'options' in ability && ability.options && ability.options.length > 0 && (
                    <div className="ml-4 space-y-1">
                      {ability.options.map((option: any, optIndex: number) => (
                        <div key={optIndex} className="text-[var(--color-su-black)]">
                          <span className="font-bold">
                            {option.label}
                            {option.label.includes('•') || option.label.length === 0 ? '' : ':'}
                          </span>{' '}
                          {option.value}
                        </div>
                      ))}
                    </div>
                  )}

                  {'stats' in ability && ability.stats && (
                    <div className="mt-2" style={{ overflow: 'visible' }}>
                      <StatList
                        stats={[
                          {
                            label: 'Structure Pts.',
                            value: ability.stats.structure_pts,
                          },
                          {
                            label: 'Energy Pts.',
                            value: ability.stats.energy_pts,
                          },
                          { label: 'Heat Cap.', value: ability.stats.heat_cap },
                          {
                            label: 'System Slots',
                            value: ability.stats.system_slots,
                          },
                          {
                            label: 'Module Slots',
                            value: ability.stats.module_slots,
                          },
                          {
                            label: 'Cargo Cap.',
                            value: ability.stats.cargo_cap,
                          },
                          {
                            label: 'Tech Level',
                            value: ability.stats.tech_level,
                          },
                          {
                            label: 'Salvage Value',
                            value: ability.stats.salvage_value,
                          },
                        ]}
                        notes={'notes' in ability.stats ? ability.stats.notes : undefined}
                        up={true}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Frame>

      {/* Patterns */}
      {data.patterns && data.patterns.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-[var(--color-su-black)] uppercase">Patterns</h3>
          {data.patterns.map((pattern, index) => (
            <div
              key={index}
              className="bg-[var(--color-su-light-blue)] border border-[var(--color-su-black)] rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center gap-2">
                <h4 className="text-xl font-bold text-[var(--color-su-black)]">{pattern.name}</h4>
                {'legalStarting' in pattern && pattern.legalStarting && (
                  <span className="bg-[var(--color-su-military-green)] text-[var(--color-su-white)] text-xs font-bold px-2 py-1 rounded">
                    LEGAL STARTING
                  </span>
                )}
              </div>
              <p className="text-[var(--color-su-black)]">{pattern.description}</p>

              {pattern.systems && pattern.systems.length > 0 && (
                <div>
                  <h5 className="font-bold text-[var(--color-su-brick)] mb-2">Systems:</h5>
                  <ul className="list-disc ml-6 space-y-1">
                    {pattern.systems.map((system, sysIndex) => (
                      <li key={sysIndex} className="text-[var(--color-su-black)]">
                        {system}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pattern.modules && pattern.modules.length > 0 && (
                <div>
                  <h5 className="font-bold text-[var(--color-su-brick)] mb-2">Modules:</h5>
                  <ul className="list-disc ml-6 space-y-1">
                    {pattern.modules.map((module, modIndex) => (
                      <li key={modIndex} className="text-[var(--color-su-black)]">
                        {module}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
