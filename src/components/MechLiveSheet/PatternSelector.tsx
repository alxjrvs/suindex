import { useState, useMemo } from 'react'
import { VStack, Flex, Badge, Text } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { SheetInput } from '../shared/SheetInput'
import type { SURefChassis } from 'salvageunion-reference'

interface PatternSelectorProps {
  pattern: string
  selectedChassis: SURefChassis | undefined
  onChange: (patternName: string) => void
}

export function PatternSelector({ pattern, selectedChassis, onChange }: PatternSelectorProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredPatterns = useMemo(() => {
    if (!selectedChassis?.patterns || !pattern) return selectedChassis?.patterns || []
    return selectedChassis.patterns.filter((p) =>
      p.name.toLowerCase().includes(pattern.toLowerCase())
    )
  }, [selectedChassis, pattern])

  return (
    <SheetInput
      label="Pattern"
      value={pattern}
      onChange={(value) => {
        onChange(value)
        setShowSuggestions(true)
      }}
      onFocus={() => setShowSuggestions(true)}
      onBlur={() => {
        setTimeout(() => setShowSuggestions(false), 200)
      }}
      disabled={!selectedChassis}
      placeholder="Enter or select a pattern..."
    >
      {showSuggestions && selectedChassis && filteredPatterns.length > 0 && (
        <VStack
          position="absolute"
          zIndex={10}
          w="full"
          mt={11}
          bg="bg.input"
          borderWidth="2px"
          borderColor="fg.input"
          borderRadius="2xl"
          shadow="lg"
          maxH="60"
          overflowY="auto"
          gap={0}
          alignItems="stretch"
        >
          {filteredPatterns.map((p, index) => (
            <Button
              key={p.name}
              variant="ghost"
              onClick={() => {
                onChange(p.name)
                setShowSuggestions(false)
              }}
              w="full"
              textAlign="left"
              p={3}
              _hover={{ bg: 'su.lightBlue' }}
              fontWeight="semibold"
              color="fg.input"
              borderBottomWidth={index < filteredPatterns.length - 1 ? '1px' : 0}
              borderBottomColor="fg.input"
              borderRadius={0}
              justifyContent="flex-start"
              h="auto"
            >
              <Flex alignItems="center" gap={2}>
                <Text>{p.name}</Text>
                {'legalStarting' in p && (
                  <Badge
                    bg="su.green"
                    color="su.white"
                    fontSize="xs"
                    fontWeight="bold"
                    px={2}
                    py={1}
                  >
                    LEGAL STARTING PATTERN
                  </Badge>
                )}
              </Flex>
            </Button>
          ))}
        </VStack>
      )}
    </SheetInput>
  )
}
