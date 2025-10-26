import { useState, useMemo } from 'react'
import { Button, Flex, Grid } from '@chakra-ui/react'
import NumericStepper from '../NumericStepper'
import { RoundedBox } from '../shared/RoundedBox'
import type { CrawlerLiveSheetState } from './types'
import { StatDisplay } from '../StatDisplay'
import { ScrapConversionModal } from './ScrapConversionModal'

interface CrawlerResourceSteppersProps {
  crawler: CrawlerLiveSheetState
  updateEntity: (updates: Partial<CrawlerLiveSheetState>) => void
  disabled?: boolean
}

export function CrawlerResourceSteppers({
  crawler,
  updateEntity,
  disabled = false,
}: CrawlerResourceSteppersProps) {
  const { scrap_tl_one, scrap_tl_two, scrap_tl_three, scrap_tl_four, scrap_tl_five, scrap_tl_six } =
    crawler

  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false)

  const totalInTl1 = useMemo(() => {
    return (
      (scrap_tl_one ?? 0) +
      (scrap_tl_two ?? 0) * 2 +
      (scrap_tl_three ?? 0) * 3 +
      (scrap_tl_four ?? 0) * 4 +
      (scrap_tl_five ?? 0) * 5 +
      (scrap_tl_six ?? 0) * 6
    )
  }, [scrap_tl_one, scrap_tl_two, scrap_tl_three, scrap_tl_four, scrap_tl_five, scrap_tl_six])

  const handleConvert = (updates: Partial<CrawlerLiveSheetState>) => {
    updateEntity(updates)
  }

  return (
    <>
      <RoundedBox
        title="SCRAP"
        bg="bg.builder.crawler"
        disabled={disabled}
        justifyContent="flex-start"
        rightContent={<StatDisplay label="Total (TL1)" value={totalInTl1} disabled={disabled} />}
      >
        <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
          <Flex justifyContent="start" alignItems="end">
            <NumericStepper
              label="TL1"
              value={scrap_tl_one ?? 0}
              onChange={(value) => updateEntity({ scrap_tl_one: value })}
              min={0}
              disabled={disabled}
            />
          </Flex>
          <Flex justifyContent="start" alignItems="end">
            <NumericStepper
              label="TL2"
              value={scrap_tl_two ?? 0}
              onChange={(value) => updateEntity({ scrap_tl_two: value })}
              min={0}
              disabled={disabled}
            />
          </Flex>
          <Flex justifyContent="start" alignItems="end">
            <NumericStepper
              label="TL3"
              value={scrap_tl_three ?? 0}
              onChange={(value) => updateEntity({ scrap_tl_three: value })}
              min={0}
              disabled={disabled}
            />
          </Flex>
          <Flex justifyContent="start" alignItems="end">
            <NumericStepper
              label="TL4"
              value={scrap_tl_four ?? 0}
              onChange={(value) => updateEntity({ scrap_tl_four: value })}
              min={0}
              disabled={disabled}
            />
          </Flex>
          <Flex justifyContent="start" alignItems="end">
            <NumericStepper
              label="TL5"
              value={scrap_tl_five ?? 0}
              onChange={(value) => updateEntity({ scrap_tl_five: value })}
              min={0}
              disabled={disabled}
            />
          </Flex>
          <Flex justifyContent="start" alignItems="end">
            <NumericStepper
              label="TL6"
              value={scrap_tl_six ?? 0}
              onChange={(value) => updateEntity({ scrap_tl_six: value })}
              min={0}
              disabled={disabled}
            />
          </Flex>
        </Grid>

        <Button
          w="full"
          mt={4}
          bg="su.black"
          color="su.white"
          _hover={{ bg: 'su.brick' }}
          fontWeight="bold"
          py={2}
          borderRadius="lg"
          onClick={() => setIsConversionModalOpen(true)}
          disabled={disabled || totalInTl1 <= 1}
        >
          CONVERT
        </Button>
      </RoundedBox>

      <ScrapConversionModal
        isOpen={isConversionModalOpen}
        onClose={() => setIsConversionModalOpen(false)}
        scrapTlOne={scrap_tl_one ?? 0}
        scrapTlTwo={scrap_tl_two ?? 0}
        scrapTlThree={scrap_tl_three ?? 0}
        scrapTlFour={scrap_tl_four ?? 0}
        scrapTlFive={scrap_tl_five ?? 0}
        scrapTlSix={scrap_tl_six ?? 0}
        onConvert={handleConvert}
      />
    </>
  )
}
