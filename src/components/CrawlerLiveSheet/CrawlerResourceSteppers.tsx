import { Flex, Grid } from '@chakra-ui/react'
import NumericStepper from '../NumericStepper'
import { StatDisplay } from '../StatDisplay'
import { RoundedBox } from '../shared/RoundedBox'

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
  disabled?: boolean
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
  disabled = false,
}: CrawlerResourceSteppersProps) {
  const currentSP = maxSP - currentDamage

  return (
    <RoundedBox bg="bg.builder.crawler" disabled={disabled} justifyContent="flex-start">
      <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
        <Flex justifyContent="start" alignItems="end">
          <NumericStepper
            label="SP"
            value={currentSP}
            onChange={(newSP) => onDamageChange(maxSP - newSP)}
            max={maxSP}
            min={0}
            disabled={disabled}
          />
        </Flex>
        <Flex justifyContent="start" alignItems="end">
          <NumericStepper
            label="TL"
            value={techLevel}
            onChange={onTechLevelChange}
            min={1}
            disabled={disabled}
          />
        </Flex>
        <Flex justifyContent="start" alignItems="end">
          <NumericStepper
            label="UPGRADE"
            value={upgrade}
            onChange={onUpgradeChange}
            max={maxUpgrade}
            disabled={disabled}
          />
        </Flex>
        <Flex justifyContent="start" alignItems="end">
          <NumericStepper
            label="SCRAP"
            value={currentScrap}
            onChange={onCurrentScrapChange}
            min={0}
            disabled={disabled}
          />
        </Flex>
        <Flex justifyContent="start" alignItems="end">
          <StatDisplay disabled={disabled} label="UPKEEP" value={upkeep} />
        </Flex>
      </Grid>
    </RoundedBox>
  )
}
