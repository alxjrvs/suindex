import { Flex, Grid } from '@chakra-ui/react'
import NumericStepper from '../NumericStepper'
import { StatDisplay } from '../StatDisplay'
import { RoundedBox } from '../shared/RoundedBox'
import type { CrawlerLiveSheetState } from './types'

interface CrawlerResourceSteppersProps {
  currentDamage: number
  maxSP: number
  techLevel: number
  upkeep: string
  upgrade: number
  maxUpgrade: number
  currentScrap: number
  updateEntity: (updates: Partial<CrawlerLiveSheetState>) => void
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
  updateEntity,
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
            onChange={(newSP) => updateEntity({ current_damage: maxSP - newSP })}
            max={maxSP}
            min={0}
            disabled={disabled}
          />
        </Flex>
        <Flex justifyContent="start" alignItems="end">
          <NumericStepper
            label="TL"
            value={techLevel}
            onChange={(value) => updateEntity({ techLevel: value })}
            min={1}
            disabled={disabled}
          />
        </Flex>
        <Flex justifyContent="start" alignItems="end">
          <NumericStepper
            label="UPGRADE"
            value={upgrade}
            onChange={(value) => updateEntity({ upgrade: value })}
            max={maxUpgrade}
            disabled={disabled}
          />
        </Flex>
        <Flex justifyContent="start" alignItems="end">
          <NumericStepper
            label="SCRAP"
            value={currentScrap}
            onChange={(value) => updateEntity({ current_scrap: value })}
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
