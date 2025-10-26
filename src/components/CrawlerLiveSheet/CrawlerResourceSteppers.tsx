import { Flex, Grid } from '@chakra-ui/react'
import NumericStepper from '../NumericStepper'
import { RoundedBox } from '../shared/RoundedBox'
import type { CrawlerLiveSheetState } from './types'

interface CrawlerResourceSteppersProps {
  scrapTlOne: number
  scrapTlTwo: number
  scrapTlThree: number
  scrapTlFour: number
  scrapTlFive: number
  scrapTlSix: number
  updateEntity: (updates: Partial<CrawlerLiveSheetState>) => void
  disabled?: boolean
}

export function CrawlerResourceSteppers({
  scrapTlOne,
  scrapTlTwo,
  scrapTlThree,
  scrapTlFour,
  scrapTlFive,
  scrapTlSix,
  updateEntity,
  disabled = false,
}: CrawlerResourceSteppersProps) {
  return (
    <RoundedBox
      title="SCRAP"
      bg="bg.builder.crawler"
      disabled={disabled}
      justifyContent="flex-start"
    >
      <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
        <Flex justifyContent="start" alignItems="end">
          <NumericStepper
            label="TL1"
            value={scrapTlOne}
            onChange={(value) => updateEntity({ scrap_tl_one: value })}
            min={0}
            disabled={disabled}
          />
        </Flex>
        <Flex justifyContent="start" alignItems="end">
          <NumericStepper
            label="TL2"
            value={scrapTlTwo}
            onChange={(value) => updateEntity({ scrap_tl_two: value })}
            min={0}
            disabled={disabled}
          />
        </Flex>
        <Flex justifyContent="start" alignItems="end">
          <NumericStepper
            label="TL3"
            value={scrapTlThree}
            onChange={(value) => updateEntity({ scrap_tl_three: value })}
            min={0}
            disabled={disabled}
          />
        </Flex>
        <Flex justifyContent="start" alignItems="end">
          <NumericStepper
            label="TL4"
            value={scrapTlFour}
            onChange={(value) => updateEntity({ scrap_tl_four: value })}
            min={0}
            disabled={disabled}
          />
        </Flex>
        <Flex justifyContent="start" alignItems="end">
          <NumericStepper
            label="TL5"
            value={scrapTlFive}
            onChange={(value) => updateEntity({ scrap_tl_five: value })}
            min={0}
            disabled={disabled}
          />
        </Flex>
        <Flex justifyContent="start" alignItems="end">
          <NumericStepper
            label="TL6"
            value={scrapTlSix}
            onChange={(value) => updateEntity({ scrap_tl_six: value })}
            min={0}
            disabled={disabled}
          />
        </Flex>
      </Grid>
    </RoundedBox>
  )
}
