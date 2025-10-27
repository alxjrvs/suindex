import { Flex, Grid, VStack } from '@chakra-ui/react'
import { SheetInput } from '../shared/SheetInput'
import { SheetSelect } from '../shared/SheetSelect'
import { SheetTextarea } from '../shared/SheetTextarea'
import type { SURefCrawler } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'
import type { CrawlerLiveSheetState } from './types'
import NumericStepper from '../NumericStepper'
import { StatDisplay } from '../StatDisplay'

interface CrawlerHeaderInputsProps {
  name: string
  crawlerTypeId: string | null
  description: string
  allCrawlers: SURefCrawler[]
  updateEntity: (updates: Partial<CrawlerLiveSheetState>) => void
  onCrawlerTypeChange: (value: string | null) => void
  disabled?: boolean
  maxSP: number
  currentSP: number
  crawler: CrawlerLiveSheetState
  upkeep: string
  maxUpgrade: number
}

export function CrawlerHeaderInputs({
  name,
  upkeep,
  maxUpgrade,
  crawlerTypeId,
  description,
  allCrawlers,
  updateEntity,
  maxSP,
  currentSP,
  crawler,
  onCrawlerTypeChange,
  disabled = false,
}: CrawlerHeaderInputsProps) {
  const currentUpgrade = crawler.upgrade ?? 0
  const currentTechLevel = crawler.tech_level || 1
  const isMaxUpgrade = currentUpgrade === maxUpgrade
  const isTechLevel6 = currentTechLevel === 6

  const handleUpgradeToNextTechLevel = () => {
    if (isMaxUpgrade && currentTechLevel < 6) {
      updateEntity({
        tech_level: currentTechLevel + 1,
        upgrade: 0,
      })
    }
  }

  return (
    <RoundedBox
      title="Crawler"
      bg="bg.builder.crawler"
      flex="1"
      disabled={disabled}
      leftContent={<StatDisplay label="TL" value={currentTechLevel} disabled={disabled} />}
      rightContent={
        <Flex gap="2">
          <StatDisplay disabled={disabled} label="UPKEEP" value={upkeep} />
          {isMaxUpgrade && !isTechLevel6 ? (
            <StatDisplay
              label="UPGRADE"
              value={`TL${currentTechLevel + 1}`}
              onClick={handleUpgradeToNextTechLevel}
              disabled={disabled}
              bg="su.green"
              valueColor="su.white"
              ariaLabel={`Upgrade to Tech Level ${currentTechLevel + 1}`}
            />
          ) : (
            <NumericStepper
              label="UPGRADE"
              value={currentUpgrade}
              onChange={(value) => updateEntity({ upgrade: value })}
              max={isTechLevel6 ? undefined : maxUpgrade}
              disabled={disabled}
            />
          )}
          <NumericStepper
            label="SP"
            value={currentSP}
            onChange={(newSP) => updateEntity({ current_damage: maxSP - newSP })}
            max={maxSP}
            min={0}
            disabled={disabled}
          />
        </Flex>
      }
    >
      <VStack gap={4} alignItems="stretch" w="full" h="full" flex="1">
        <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4} w="full">
          <SheetInput
            label="Name"
            value={name}
            onChange={(value) => updateEntity({ name: value })}
            placeholder="Enter crawler name..."
            disabled={disabled}
          />

          <SheetSelect label="Type" value={crawlerTypeId} onChange={onCrawlerTypeChange}>
            <option value="">Select crawler type...</option>
            {allCrawlers.map((crawler) => (
              <option key={crawler.id} value={crawler.id}>
                {crawler.name}
              </option>
            ))}
          </SheetSelect>
        </Grid>

        <Flex flex="1" direction="column" minH="0" w="full">
          <SheetTextarea
            label="Description"
            value={description}
            onChange={(value) => updateEntity({ description: value })}
            placeholder="Enter crawler description..."
            disabled={disabled}
            height="full"
          />
        </Flex>
      </VStack>
    </RoundedBox>
  )
}
