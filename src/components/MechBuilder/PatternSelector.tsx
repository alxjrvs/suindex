import { useState, useMemo } from 'react'
import type { Chassis } from 'salvageunion-reference'

interface PatternSelectorProps {
  pattern: string
  selectedChassis: Chassis | undefined
  onChange: (patternName: string) => void
}

export function PatternSelector({ pattern, selectedChassis, onChange }: PatternSelectorProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredPatterns = useMemo(() => {
    if (!selectedChassis?.patterns || !pattern) return selectedChassis?.patterns || []
    return selectedChassis.patterns.filter((p) =>
      p.name.toLowerCase().includes(pattern.toLowerCase())
    )
  }, [selectedChassis, pattern])

  return (
    <div className="relative">
      <label className="block text-sm font-bold text-[#e8e5d8] mb-2 uppercase">Pattern</label>
      <input
        type="text"
        value={pattern}
        onChange={(e) => {
          onChange(e.target.value)
          setShowSuggestions(true)
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => {
          setTimeout(() => setShowSuggestions(false), 200)
        }}
        disabled={!selectedChassis}
        placeholder="Enter or select a pattern..."
        className="w-full p-3 border-0 rounded-2xl bg-[#e8e5d8] text-[#2d3e36] font-semibold disabled:opacity-50"
      />
      {showSuggestions && selectedChassis && filteredPatterns.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-[#e8e5d8] border-2 border-[#2d3e36] rounded-2xl shadow-lg max-h-60 overflow-y-auto">
          {filteredPatterns.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                onChange(p.name)
                setShowSuggestions(false)
              }}
              className="w-full text-left p-3 hover:bg-[var(--color-su-light-blue)] transition-colors font-semibold text-[#2d3e36] border-b border-[#2d3e36] last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <span>{p.name}</span>
                {'legalStarting' in p && (
                  <span className="bg-[var(--color-su-military-green)] text-[var(--color-su-white)] text-xs font-bold px-2 py-1 rounded">
                    LEGAL STARTING PATTERN
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
