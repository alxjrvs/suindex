import { Flex, Grid, VStack } from '@chakra-ui/react'
import { SheetInput } from '../shared/SheetInput'
import { SheetSelect } from '../shared/SheetSelect'
import { SheetTextarea } from '../shared/SheetTextarea'
import type { SURefCrawler } from 'salvageunion-reference'
import { RoundedBox } from '../shared/RoundedBox'
import type { CrawlerLiveSheetState } from './types'
import NumericStepper from '../NumericStepper'
import { StatDisplay } from '../StatDisplay'
import UpkeepStepper from '../UpkeepStepper'
import { useMemo, useState, useEffect } from 'react'

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
  onScrapFlash?: (techLevels: number[]) => void
  onTechLevelUpgradeFlash?: () => void
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
  onScrapFlash,
  onTechLevelUpgradeFlash,
}: CrawlerHeaderInputsProps) {
  const currentUpgrade = crawler.upgrade ?? 0
  const currentTechLevel = crawler.tech_level || 1
  const isMaxUpgrade = currentUpgrade === maxUpgrade
  const isTechLevel6 = currentTechLevel === 6
  const [flashUpkeep, setFlashUpkeep] = useState(false)
  const [flashTL, setFlashTL] = useState(false)
  const [flashUpgradeDisplay, setFlashUpgradeDisplay] = useState(false)
  const [flashSP, setFlashSP] = useState(false)

  const handleUpgradeToNextTechLevel = () => {
    if (isMaxUpgrade && currentTechLevel < 6) {
      // Trigger all flash animations
      setFlashUpkeep(true)
      setFlashTL(true)
      setFlashUpgradeDisplay(true)
      setFlashSP(true)

      // Notify parent to flash header stats
      if (onTechLevelUpgradeFlash) {
        onTechLevelUpgradeFlash()
      }

      updateEntity({
        tech_level: currentTechLevel + 1,
        upgrade: 0,
      })
    }
  }

  // Build scrapByTL object
  const scrapByTL = useMemo(
    () => ({
      1: crawler.scrap_tl_one ?? 0,
      2: crawler.scrap_tl_two ?? 0,
      3: crawler.scrap_tl_three ?? 0,
      4: crawler.scrap_tl_four ?? 0,
      5: crawler.scrap_tl_five ?? 0,
      6: crawler.scrap_tl_six ?? 0,
    }),
    [
      crawler.scrap_tl_one,
      crawler.scrap_tl_two,
      crawler.scrap_tl_three,
      crawler.scrap_tl_four,
      crawler.scrap_tl_five,
      crawler.scrap_tl_six,
    ]
  )

  const handleUpgradeChange = (
    newValue: number,
    scrapUpdates?: Record<string, number>,
    affectedTLs?: number[]
  ) => {
    const updates: Partial<CrawlerLiveSheetState> = { upgrade: newValue }

    // If scrap updates are provided, merge them
    if (scrapUpdates) {
      Object.assign(updates, scrapUpdates)

      // Trigger flash animations
      setFlashUpkeep(true)
      if (affectedTLs && onScrapFlash) {
        onScrapFlash(affectedTLs)
      }
    }

    updateEntity(updates)
  }

  // Reset flash states
  useEffect(() => {
    if (flashUpkeep) {
      const timer = setTimeout(() => setFlashUpkeep(false), 3100)
      return () => clearTimeout(timer)
    }
  }, [flashUpkeep])

  useEffect(() => {
    if (flashTL) {
      const timer = setTimeout(() => setFlashTL(false), 3100)
      return () => clearTimeout(timer)
    }
  }, [flashTL])

  useEffect(() => {
    if (flashUpgradeDisplay) {
      const timer = setTimeout(() => setFlashUpgradeDisplay(false), 3100)
      return () => clearTimeout(timer)
    }
  }, [flashUpgradeDisplay])

  useEffect(() => {
    if (flashSP) {
      const timer = setTimeout(() => setFlashSP(false), 3100)
      return () => clearTimeout(timer)
    }
  }, [flashSP])

  return (
    <RoundedBox
      title="Crawler"
      bg="bg.builder.crawler"
      flex="1"
      disabled={disabled}
      leftContent={
        isMaxUpgrade && !isTechLevel6 ? (
          <StatDisplay
            label="UPGRADE"
            value={currentTechLevel + 1}
            onClick={handleUpgradeToNextTechLevel}
            disabled={disabled}
            bg="su.brick"
            valueColor="su.white"
            ariaLabel={`Upgrade to Tech Level ${currentTechLevel + 1}`}
            flash={flashTL}
          />
        ) : (
          <StatDisplay label="TL" value={currentTechLevel} disabled={disabled} flash={flashTL} />
        )
      }
      rightContent={
        <Flex gap="2">
          <StatDisplay disabled={disabled} label="UPKEEP" value={upkeep} flash={flashUpkeep} />
          <UpkeepStepper
            label="UPGRADE"
            value={currentUpgrade}
            onChange={handleUpgradeChange}
            max={isTechLevel6 ? undefined : maxUpgrade}
            disabled={disabled}
            techLevel={currentTechLevel}
            scrapByTL={scrapByTL}
            flash={flashUpgradeDisplay}
          />
          <NumericStepper
            label="SP"
            value={currentSP}
            onChange={(newSP) => updateEntity({ current_damage: maxSP - newSP })}
            max={maxSP}
            min={0}
            disabled={disabled}
            flash={flashSP}
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
