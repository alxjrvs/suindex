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
    <RoundedBox
      bg="bg.builder.crawler"
      borderColor="border.builder.crawler"
      matchBorder={false}
      borderWidth="4px"
    >
      <Grid gridTemplateColumns="repeat(3, 1fr)" gap={4}>
        <Flex justifyContent="start" alignItems="end">
          <NumericStepper
            label="SP"
            value={currentSP}
            onChange={(newSP) => onDamageChange(maxSP - newSP)}
            max={maxSP}
            min={0}
          />
        </Flex>
        <Flex justifyContent="start" alignItems="end">
          <NumericStepper label="TECH LVL" value={techLevel} onChange={onTechLevelChange} min={1} />
        </Flex>
        <Flex justifyContent="start" alignItems="end">
          <NumericStepper
            label="UPGRADE"
            value={upgrade}
            onChange={onUpgradeChange}
            max={maxUpgrade}
            step={5}
          />
        </Flex>
        <Flex justifyContent="start" alignItems="end">
          <NumericStepper
            label="TL1 SCRAP"
            value={currentScrap}
            onChange={onCurrentScrapChange}
            min={0}
          />
        </Flex>
        <Flex justifyContent="start" alignItems="end">
          <StatDisplay label="UPKEEP" value={upkeep} />
        </Flex>
      </Grid>
    </RoundedBox>
  )
}
