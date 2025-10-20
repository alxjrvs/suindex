import type { ReactNode } from 'react'
import { DataList } from './DataList'
import type { DataValue } from '../../../types/common'

interface FrameProps {
  header: string
  headerColor?: string
  headerContent?: ReactNode
  level?: string | number
  techLevel?: number
  details?: DataValue[]
  description?: string
  notes?: string
  children?: ReactNode
  showSidebar?: boolean
  slotsRequired?: number
  salvageValue?: number
}

const techLevelColors: Record<number, string> = {
  1: 'var(--color-su-one-blue)',
  2: 'var(--color-su-two-blue)',
  3: 'var(--color-su-three-blue)',
  4: 'var(--color-su-four-blue)',
  5: 'var(--color-su-five-blue)',
  6: 'var(--color-su-six-blue)',
}

export function Frame({
  header,
  headerColor,
  headerContent,
  level,
  techLevel,
  details,
  description,
  notes,
  children,
  showSidebar = true,
  slotsRequired,
  salvageValue,
}: FrameProps) {
  const backgroundColor =
    headerColor || (techLevel ? techLevelColors[techLevel] : 'var(--color-su-orange)')

  return (
    <div
      className="bg-[var(--color-su-light-blue)] w-full rounded-lg shadow-lg"
      style={{ overflow: 'visible' }}
    >
      {/* Header */}
      <div className="p-3 z-10" style={{ backgroundColor, overflow: 'visible' }}>
        <div className="flex items-start gap-3" style={{ overflow: 'visible' }}>
          {level && (
            <div className="flex items-center justify-center min-w-[35px] max-w-[35px]">
              <span className="text-[var(--color-su-white)] text-2xl font-bold">{level}</span>
            </div>
          )}
          <div className="flex-1" style={{ overflow: 'visible' }}>
            <div className="flex justify-between items-start" style={{ overflow: 'visible' }}>
              {header && (
                <h3 className="text-2xl font-bold text-[var(--color-su-white)] max-w-[80%] flex-wrap">
                  {header}
                </h3>
              )}
              {headerContent}
            </div>
            <div className="min-h-[15px] mt-1">
              <DataList textColor="var(--color-su-white)" values={details || []} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex" style={{ backgroundColor }}>
        {/* Sidebar */}
        {showSidebar && (techLevel || slotsRequired || salvageValue) && (
          <div
            className="flex flex-col items-center justify-start pb-1 gap-1 min-w-[35px] max-w-[35px]"
            style={{ backgroundColor, overflow: 'visible' }}
          >
            {/* Tech Level - Black rounded square with white text */}
            {techLevel && (
              <div
                className="bg-[var(--color-su-black)] border border-[var(--color-su-black)] text-[var(--color-su-white)] font-bold text-center flex items-center justify-center"
                style={{
                  minWidth: '25px',
                  height: '25px',
                  borderRadius: '5px',
                  paddingTop: '2px',
                }}
                title="Tech level"
              >
                T{techLevel}
              </div>
            )}
            {/* Slots Required - Black triangle with white text */}
            {slotsRequired && (
              <div
                className="relative flex items-center justify-center"
                style={{ width: '30px', height: '25px' }}
                title="Slots"
              >
                <div
                  className="border-solid absolute"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '15px solid transparent',
                    borderRight: '15px solid transparent',
                    borderBottom: '25px solid var(--color-su-black)',
                    top: -2,
                    left: 0,
                  }}
                />
                <div
                  className="absolute text-[var(--color-su-white)] font-bold text-center flex items-center justify-center"
                  style={{
                    width: '30px',
                    top: '4coppx',
                  }}
                >
                  {slotsRequired}
                </div>
              </div>
            )}
            {/* Salvage Value - Black circle with white text */}
            {salvageValue && (
              <div
                className="bg-[var(--color-su-black)] text-[var(--color-su-white)] font-bold text-center flex items-center justify-center"
                style={{
                  width: '25px',
                  height: '25px',
                  borderRadius: '30px',
                  paddingTop: '4px',
                }}
                title="Salvage value"
              >
                {salvageValue}
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 bg-[var(--color-su-light-blue)] p-3 space-y-6">
          {description && (
            <p className="text-[var(--color-su-black)] font-medium leading-relaxed">
              {description}
            </p>
          )}

          {children}

          {notes && (
            <div className="border border-[var(--color-su-black)] p-3 rounded bg-[var(--color-su-white)]">
              <p className="text-[var(--color-su-black)]">{notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
