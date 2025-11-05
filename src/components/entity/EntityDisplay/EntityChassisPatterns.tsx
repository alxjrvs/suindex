import { VStack, Tabs } from '@chakra-ui/react'
import { useSearchParams } from 'react-router-dom'
import { Text } from '../../base/Text'
import { EntitySubheader } from './EntitySubheader'
import { EntityChassisPattern } from './EntityChassisPattern'
import { useEntityDisplayContext } from './useEntityDisplayContext'

export function EntityChassisPatterns() {
  const { data, spacing } = useEntityDisplayContext()
  const [searchParams, setSearchParams] = useSearchParams()

  if (!('patterns' in data) || !data.patterns || data.patterns.length === 0) return null

  // Get the first pattern as default value
  const defaultPattern = data.patterns[0].name.replace(/\s+Pattern$/i, '')

  // Get pattern from URL or use default
  const patternParam = searchParams.get('pattern')
  const selectedPattern = patternParam || defaultPattern

  // Handle tab change - update URL
  const handlePatternChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('pattern', value)
    setSearchParams(newParams, { replace: true })
  }

  return (
    <VStack p={spacing.contentPadding} gap={4} alignItems="stretch">
      <EntitySubheader label="Patterns" />

      <Tabs.Root value={selectedPattern} onValueChange={(e) => handlePatternChange(e.value)}>
        <Tabs.List borderBottom="3px solid" borderColor="su.black">
          {data.patterns.map((pattern) => {
            const displayName = pattern.name.replace(/\s+Pattern$/i, '')
            const isLegalStarting = 'legalStarting' in pattern && pattern.legalStarting

            return (
              <Tabs.Trigger
                key={pattern.name}
                value={displayName}
                fontSize="lg"
                fontWeight="bold"
                _selected={{
                  bg: 'su.green',
                  color: 'su.white',
                  borderBottomColor: 'su.green',
                }}
              >
                {displayName}
                {isLegalStarting && (
                  <Text as="span" ml={2} fontSize="2xl">
                    ★
                  </Text>
                )}
              </Tabs.Trigger>
            )
          })}
        </Tabs.List>

        {data.patterns.map((pattern) => {
          const displayName = pattern.name.replace(/\s+Pattern$/i, '')
          return (
            <Tabs.Content key={pattern.name} value={displayName}>
              <EntityChassisPattern pattern={pattern} />
            </Tabs.Content>
          )
        })}
      </Tabs.Root>
    </VStack>
  )
}
