import { useState, useMemo } from 'react'
import { Box, Text, Input, VStack, Button, Flex, Badge } from '@chakra-ui/react'
import type { Chassis } from 'salvageunion-reference'

interface PatternSelectorProps {
  pattern: string
  selectedChassis: Chassis | undefined
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
    <Box position="relative">
      <Text
        as="label"
        display="block"
        fontSize="sm"
        fontWeight="bold"
        color="#e8e5d8"
        mb={2}
        textTransform="uppercase"
      >
        Pattern
      </Text>
      <Input
        type="text"
        value={pattern}
        onChange={(e) => {
          onChange(e.target.value)
          setShowSuggestions(true)
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => {
          setTimeout(() => setShowSuggestions(false), 200)
        }}
        disabled={!selectedChassis}
        placeholder="Enter or select a pattern..."
        w="full"
        p={3}
        borderWidth={0}
        borderRadius="2xl"
        bg="#e8e5d8"
        color="#2d3e36"
        fontWeight="semibold"
        _disabled={{ opacity: 0.5 }}
      />
      {showSuggestions && selectedChassis && filteredPatterns.length > 0 && (
        <VStack
          position="absolute"
          zIndex={10}
          w="full"
          mt={1}
          bg="#e8e5d8"
          borderWidth="2px"
          borderColor="#2d3e36"
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
              color="#2d3e36"
              borderBottomWidth={index < filteredPatterns.length - 1 ? '1px' : 0}
              borderBottomColor="#2d3e36"
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
    </Box>
  )
}
