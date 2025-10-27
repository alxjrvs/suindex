import { useState, useMemo } from 'react'
import { Button, Flex, Text, VStack, NativeSelectRoot, NativeSelectField } from '@chakra-ui/react'
import Modal from '../Modal'

interface ScrapConversionModalProps {
  isOpen: boolean
  onClose: () => void
  scrapTlOne: number
  scrapTlTwo: number
  scrapTlThree: number
  scrapTlFour: number
  scrapTlFive: number
  scrapTlSix: number
  onConvert: (updates: {
    scrap_tl_one?: number
    scrap_tl_two?: number
    scrap_tl_three?: number
    scrap_tl_four?: number
    scrap_tl_five?: number
    scrap_tl_six?: number
  }) => void
}

type TechLevel = 1 | 2 | 3 | 4 | 5 | 6

export function ScrapConversionModal({
  isOpen,
  onClose,
  scrapTlOne,
  scrapTlTwo,
  scrapTlThree,
  scrapTlFour,
  scrapTlFive,
  scrapTlSix,
  onConvert,
}: ScrapConversionModalProps) {
  const [fromTL, setFromTL] = useState<TechLevel | null>(null)
  const [toTL, setToTL] = useState<TechLevel | null>(null)

  // Map tech levels to their scrap counts
  const scrapByTL: Record<TechLevel, number> = useMemo(
    () => ({
      1: scrapTlOne,
      2: scrapTlTwo,
      3: scrapTlThree,
      4: scrapTlFour,
      5: scrapTlFive,
      6: scrapTlSix,
    }),
    [scrapTlOne, scrapTlTwo, scrapTlThree, scrapTlFour, scrapTlFive, scrapTlSix]
  )

  // Calculate which FROM tech levels are available (have at least 1 scrap)
  const availableFromTLs = useMemo(() => {
    return ([1, 2, 3, 4, 5, 6] as TechLevel[]).filter((tl) => scrapByTL[tl] > 0)
  }, [scrapByTL])

  // Calculate which TO tech levels are valid based on FROM selection
  const availableToTLs = useMemo(() => {
    if (!fromTL) return []

    const fromScrapCount = scrapByTL[fromTL]
    const fromValueInTL1 = fromScrapCount * fromTL

    // Can convert to any TL where we have enough value
    return ([1, 2, 3, 4, 5, 6] as TechLevel[]).filter((tl) => {
      if (tl === fromTL) return false // Can't convert to same level
      return fromValueInTL1 >= tl // Need at least enough value for 1 scrap of target TL
    })
  }, [fromTL, scrapByTL])

  // Calculate conversion result
  const conversionResult = useMemo(() => {
    if (!fromTL || !toTL) return null

    const fromScrapCount = scrapByTL[fromTL]
    const fromValueInTL1 = fromScrapCount * fromTL

    // How many of the target TL can we make?
    const toScrapCount = Math.floor(fromValueInTL1 / toTL)

    // How much TL1 value is left over?
    const remainderInTL1 = fromValueInTL1 % toTL

    return {
      fromScrapCount,
      toScrapCount,
      remainderInTL1,
    }
  }, [fromTL, toTL, scrapByTL])

  const handleConvert = () => {
    if (!fromTL || !toTL || !conversionResult) return

    // Build the updates object
    const updates: Record<string, number> = {}

    // Zero out the FROM tech level
    updates[`scrap_tl_${getTLFieldName(fromTL)}`] = 0

    // Add to the TO tech level
    const currentToScrap = scrapByTL[toTL]
    updates[`scrap_tl_${getTLFieldName(toTL)}`] = currentToScrap + conversionResult.toScrapCount

    // Add remainder to TL1 if any
    if (conversionResult.remainderInTL1 > 0) {
      const currentTL1 = scrapByTL[1]
      updates[`scrap_tl_one`] = currentTL1 + conversionResult.remainderInTL1
    }

    onConvert(updates)
    handleClose()
  }

  const handleClose = () => {
    setFromTL(null)
    setToTL(null)
    onClose()
  }

  const getTLFieldName = (tl: TechLevel): string => {
    const names = ['one', 'two', 'three', 'four', 'five', 'six']
    return names[tl - 1]
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Convert Scrap"
      backgroundColor="bg.builder.crawler"
    >
      <Flex gap={6} align="stretch" w="full">
        {/* FROM Selection */}
        <VStack gap={2} align="stretch" w="full">
          <Text fontWeight="bold" fontFamily="mono">
            FROM Tech Level
          </Text>
          <NativeSelectRoot>
            <NativeSelectField
              value={fromTL?.toString() ?? ''}
              onChange={(e) => {
                const value = e.target.value
                setFromTL(value ? (parseInt(value) as TechLevel) : null)
                setToTL(null) // Reset TO when FROM changes
              }}
            >
              <option value="">Select tech level...</option>
              {([1, 2, 3, 4, 5, 6] as TechLevel[]).map((tl) => {
                const scrapCount = scrapByTL[tl]
                const isAvailable = availableFromTLs.includes(tl)
                return (
                  <option key={tl} value={tl} disabled={!isAvailable}>
                    TL{tl} ({scrapCount} scrap)
                  </option>
                )
              })}
            </NativeSelectField>
          </NativeSelectRoot>
        </VStack>

        {/* TO Selection */}
        <VStack gap={2} align="stretch" w="full">
          <Text fontWeight="bold" fontFamily="mono">
            TO Tech Level
          </Text>
          <NativeSelectRoot disabled={!fromTL}>
            <NativeSelectField
              value={toTL?.toString() ?? ''}
              onChange={(e) => {
                const value = e.target.value
                setToTL(value ? (parseInt(value) as TechLevel) : null)
              }}
            >
              <option value="">Select tech level...</option>
              {([1, 2, 3, 4, 5, 6] as TechLevel[]).map((tl) => {
                const isAvailable = availableToTLs.includes(tl)
                return (
                  <option key={tl} value={tl} disabled={!isAvailable}>
                    TL{tl}
                  </option>
                )
              })}
            </NativeSelectField>
          </NativeSelectRoot>
        </VStack>

        {/* Conversion Preview */}
        {conversionResult && (
          <VStack gap={2} align="stretch" p={4} bg="bg.muted" borderRadius="md" borderWidth="1px">
            <Text fontWeight="bold" fontFamily="mono" fontSize="sm">
              Conversion Preview:
            </Text>
            <Flex justify="space-between">
              <Text fontFamily="mono" fontSize="sm">
                Convert:
              </Text>
              <Text fontFamily="mono" fontSize="sm" fontWeight="bold">
                {conversionResult.fromScrapCount} × TL{fromTL}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontFamily="mono" fontSize="sm">
                Receive:
              </Text>
              <Text fontFamily="mono" fontSize="sm" fontWeight="bold">
                {conversionResult.toScrapCount} × TL{toTL}
              </Text>
            </Flex>
            {conversionResult.remainderInTL1 > 0 && (
              <Flex justify="space-between">
                <Text fontFamily="mono" fontSize="sm">
                  Remainder:
                </Text>
                <Text fontFamily="mono" fontSize="sm" fontWeight="bold" color="orange.500">
                  {conversionResult.remainderInTL1} × TL1
                </Text>
              </Flex>
            )}
          </VStack>
        )}
      </Flex>
      <Flex gap={2} justifyContent="flex-end" pt={4}>
        <Button
          onClick={handleClose}
          bg="su.brick"
          color="su.white"
          px={4}
          py={2}
          fontWeight="bold"
          _hover={{ opacity: 0.9 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConvert}
          disabled={!fromTL || !toTL}
          bg="su.green"
          color="su.black"
          px={4}
          py={2}
          fontWeight="bold"
          _hover={{ opacity: 0.9 }}
          _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
        >
          Convert
        </Button>
      </Flex>
    </Modal>
  )
}
