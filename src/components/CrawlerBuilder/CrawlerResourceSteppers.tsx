import NumericStepper from '../NumericStepper'
import { StatDisplay } from '../StatDisplay'

interface CrawlerResourceSteppersProps {
  currentDamage: number
  maxSP: number
  techLevel: number
  upkeep: string
  upgrade: number
  maxUpgrade: number
  currentScrap: number
  onDamageChange: (value: number) => void
  onTechLevelChange: (value: number) => void
  onUpgradeChange: (value: number) => void
  onCurrentScrapChange: (value: number) => void
}

export function CrawlerResourceSteppers({
  currentDamage,
  maxSP,
  techLevel,
  upkeep,
  upgrade,
  maxUpgrade,
  currentScrap,
  onDamageChange,
  onTechLevelChange,
  onUpgradeChange,
  onCurrentScrapChange,
}: CrawlerResourceSteppersProps) {
  const currentSP = maxSP - currentDamage

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <div className="flex justify-start items-end">
        <NumericStepper
          label="SP"
          value={currentSP}
          onChange={(newSP) => onDamageChange(maxSP - newSP)}
          max={maxSP}
          min={0}
        />
      </div>
      <div className="flex justify-start items-end">
        <NumericStepper label="TECH LVL" value={techLevel} onChange={onTechLevelChange} min={1} />
      </div>
      <div className="flex justify-start items-end">
        <NumericStepper
          label="UPGRADE"
          value={upgrade}
          onChange={onUpgradeChange}
          max={maxUpgrade}
          step={5}
        />
      </div>
      <div className="flex justify-start items-end">
        <NumericStepper
          label="TL1 SCRAP"
          value={currentScrap}
          onChange={onCurrentScrapChange}
          min={0}
        />
      </div>
      <div className="flex justify-start items-end">
        <StatDisplay label="UPKEEP" value={upkeep} />
      </div>
    </div>
  )
}
