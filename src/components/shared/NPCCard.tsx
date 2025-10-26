import { Box, Flex, VStack } from '@chakra-ui/react'
import { SheetInput } from './SheetInput'
import { SheetTextarea } from './SheetTextarea'
import type { CrawlerNPC } from '../../types/common'
import NumericStepper from '../NumericStepper'
import { Text } from '../base/Text'
import { useRef, useEffect, useState, useMemo } from 'react'
import { getTiltRotation } from '../../utils/tiltUtils'

export function NPCCard({
  onUpdateName,
  position,
  onUpdateNotes,
  description,
  npc,
  maxHP,
  onUpdateDamage,
  tilted = false,
  disabled = false,
}: {
  npc: CrawlerNPC
  onUpdateName: (value: string) => void
  position: string
  description: string
  maxHP: number
  onUpdateNotes: (value: string) => void
  onUpdateDamage: (value: number) => void
  tilted?: boolean
  disabled?: boolean
}) {
  const textRef = useRef<HTMLParagraphElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState(16)

  useEffect(() => {
    const adjustFontSize = () => {
      if (!textRef.current || !containerRef.current) return

      const maxHeight = 72
      const maxWidth = containerRef.current.offsetWidth
      let currentSize = 16 // Start with 16px

      // Reset to max size first
      textRef.current.style.fontSize = `${currentSize}px`

      // Shrink until it fits
      while (
        (textRef.current.scrollHeight > maxHeight || textRef.current.scrollWidth > maxWidth) &&
        currentSize > 8
      ) {
        currentSize -= 0.5
        textRef.current.style.fontSize = `${currentSize}px`
      }

      setFontSize(currentSize)
    }

    adjustFontSize()
    window.addEventListener('resize', adjustFontSize)
    return () => window.removeEventListener('resize', adjustFontSize)
  }, [description])

  // Generate tilt rotations for each element
  const descriptionRotation = useMemo(() => (tilted ? getTiltRotation() : 0), [tilted])
  const hpRotation = useMemo(() => (tilted ? getTiltRotation() : 0), [tilted])
  const nameRotation = useMemo(() => (tilted ? getTiltRotation() : 0), [tilted])
  const notesRotation = useMemo(() => (tilted ? getTiltRotation() : 0), [tilted])

  return (
    <VStack gap={2} alignItems="stretch" mt={2} w="full">
      <Flex ref={containerRef} gap={3} alignItems="stretch" maxH="72px">
        <Box
          transform={tilted ? `rotate(${descriptionRotation}deg)` : undefined}
          transition="transform 0.3s ease"
        >
          <Text
            ref={textRef}
            fontStyle="italic"
            flex="1"
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            maxH="72px"
            lineHeight={1.2}
            style={{ fontSize: `${fontSize}px` }}
          >
            {description}
          </Text>
        </Box>
        {maxHP > 0 && (
          <Box
            transform={tilted ? `rotate(${hpRotation}deg)` : undefined}
            transition="transform 0.3s ease"
          >
            <NumericStepper
              label="NPC HP"
              max={maxHP}
              min={0}
              value={maxHP - (npc?.damage || 0)}
              onChange={(value) => onUpdateDamage(maxHP - value)}
              disabled={disabled}
            />
          </Box>
        )}
      </Flex>

      <Box
        transform={tilted ? `rotate(${nameRotation}deg)` : undefined}
        transition="transform 0.3s ease"
      >
        <SheetInput
          value={npc.name}
          onChange={(value) => onUpdateName(value)}
          placeholder={`Enter ${position} name...`}
          suffixText={`the ${position}`}
          disabled={disabled}
        />
      </Box>

      <Box
        transform={tilted ? `rotate(${notesRotation}deg)` : undefined}
        transition="transform 0.3s ease"
      >
        <SheetTextarea
          label="Notes"
          value={npc.notes}
          onChange={(value) => onUpdateNotes(value)}
          placeholder="Enter operator notes..."
          height="20"
          disabled={disabled}
        />
      </Box>
    </VStack>
  )
}
