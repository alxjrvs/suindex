import { useMemo } from 'react'
import { DiceRollButton } from '../shared/DiceRollButton'
import { rollTable } from '@randsum/salvageunion'
import type { Class } from 'salvageunion-reference'

interface PilotInfoInputsProps {
  callsign: string
  motto: string
  mottoUsed: boolean
  keepsake: string
  keepsakeUsed: boolean
  background: string
  backgroundUsed: boolean
  appearance: string
  classId: string | null
  advancedClassId: string | null
  allClasses: Class[]
  disabled?: boolean
  onCallsignChange: (value: string) => void
  onMottoChange: (value: string) => void
  onMottoUsedChange: (value: boolean) => void
  onKeepsakeChange: (value: string) => void
  onKeepsakeUsedChange: (value: boolean) => void
  onBackgroundChange: (value: string) => void
  onBackgroundUsedChange: (value: boolean) => void
  onAppearanceChange: (value: string) => void
  onClassChange: (classId: string) => void
  onAdvancedClassChange: (classId: string) => void
}

export function PilotInfoInputs({
  callsign,
  motto,
  mottoUsed,
  keepsake,
  keepsakeUsed,
  background,
  backgroundUsed,
  appearance,
  classId,
  advancedClassId,
  allClasses,
  disabled = false,
  onCallsignChange,
  onMottoChange,
  onMottoUsedChange,
  onKeepsakeChange,
  onKeepsakeUsedChange,
  onBackgroundChange,
  onBackgroundUsedChange,
  onAppearanceChange,
  onClassChange,
  onAdvancedClassChange,
}: PilotInfoInputsProps) {
  // Filter to only show basic (core) classes
  const basicClasses = useMemo(() => {
    return allClasses
      .filter((cls) => cls.type === 'core')
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [allClasses])
  const handleMottoRoll = () => {
    const {
      result: { label },
    } = rollTable('Motto')

    onMottoChange(label)
  }

  const handleKeepsakeRoll = () => {
    const {
      result: { label },
    } = rollTable('Keepsake')
    onKeepsakeChange(label)
  }

  const handleAppearanceRoll = () => {
    const {
      result: { label },
    } = rollTable('Pilot Appearance')
    onAppearanceChange(label)
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Callsign */}
      <div>
        <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase">Callsign</label>
        <input
          type="text"
          value={callsign}
          onChange={(e) => onCallsignChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter callsign"
          className="w-full p-3 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Motto */}
      <div>
        <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase flex items-center justify-between">
          <span>Motto</span>
          <label className="flex items-center gap-2 text-xs normal-case font-normal">
            <span>Used</span>
            <input
              type="checkbox"
              checked={mottoUsed}
              onChange={(e) => onMottoUsedChange(e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={motto}
            onChange={(e) => onMottoChange(e.target.value)}
            disabled={disabled}
            placeholder="Enter motto"
            className="w-full p-3 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <DiceRollButton
            onClick={handleMottoRoll}
            disabled={disabled}
            ariaLabel="Roll on the Motto table"
            title="Roll on the Motto table"
          />
        </div>
      </div>

      {/* Class and Advanced Class - Together take same width as Callsign */}
      <div className="flex gap-4">
        {/* Class */}
        <div className="flex-1">
          <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase">Class</label>
          <select
            value={classId || ''}
            onChange={(e) => onClassChange(e.target.value)}
            disabled={disabled}
            className="w-full p-3 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select a class...</option>
            {basicClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {/* Advanced Class */}
        <div className="flex-1">
          <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase">
            Advanced Class
          </label>
          <select
            value={advancedClassId || ''}
            onChange={(e) => onAdvancedClassChange(e.target.value)}
            disabled={true}
            className="w-full p-3 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select an advanced class...</option>
          </select>
        </div>
      </div>

      {/* Keepsake */}
      <div>
        <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase flex items-center justify-between">
          <span>Keepsake</span>
          <label className="flex items-center gap-2 text-xs normal-case font-normal">
            <span>Used</span>
            <input
              type="checkbox"
              checked={keepsakeUsed}
              onChange={(e) => onKeepsakeUsedChange(e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={keepsake}
            onChange={(e) => onKeepsakeChange(e.target.value)}
            disabled={disabled}
            placeholder="Enter keepsake"
            className="flex-1 p-3 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <DiceRollButton
            onClick={handleKeepsakeRoll}
            disabled={disabled}
            ariaLabel="Roll on the Keepsake table"
            title="Roll on the Keepsake table"
          />
        </div>
      </div>

      {/* Appearance */}
      <div>
        <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase">Appearance</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={appearance}
            onChange={(e) => onAppearanceChange(e.target.value)}
            disabled={disabled}
            placeholder="Enter appearance"
            className="flex-1 p-3 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <DiceRollButton
            onClick={handleAppearanceRoll}
            disabled={disabled}
            ariaLabel="Roll on the Pilot Appearance table"
            title="Roll on the Pilot Appearance table"
          />
        </div>
      </div>

      {/* Background */}
      <div>
        <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase flex items-center justify-between">
          <span>Background</span>
          <label className="flex items-center gap-2 text-xs normal-case font-normal">
            <span>Used</span>
            <input
              type="checkbox"
              checked={backgroundUsed}
              onChange={(e) => onBackgroundUsedChange(e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>
        </label>
        <input
          type="text"
          value={background}
          onChange={(e) => onBackgroundChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter background"
          className="w-full p-3 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  )
}
