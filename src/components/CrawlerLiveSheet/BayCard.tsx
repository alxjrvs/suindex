import { useMemo } from 'react'
import { Box, VStack } from '@chakra-ui/react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type { CrawlerBay } from '../../types/database'
import { RoundedBox } from '../shared/RoundedBox'
import { NPCCard } from '../shared/NPCCard'
import { BayInfo } from './BayInfo'
import { StatDisplay } from '../StatDisplay'
import { SheetDisplay } from '../shared/SheetDisplay'
import { getTiltRotation } from '../../utils/tiltUtils'

interface BayCardProps {
  bay: CrawlerBay
  onUpdate: (updates: Partial<CrawlerBay>) => void
}

export function BayCard({ bay, onUpdate }: BayCardProps) {
  const referenceBay = useMemo(() => {
    const allBays = SalvageUnionReference.CrawlerBays.all()
    return allBays.find((b) => b.id === bay.bayId)
  }, [bay.bayId])

  const titleRotation = useMemo(() => getTiltRotation(), [])
  const bayInfoRotation = useMemo(() => getTiltRotation(), [])

  return (
    <RoundedBox
      bg={bay.damaged ? 'su.grey' : 'su.crawlerPink'}
      borderWidth="4px"
      borderRadius="2xl"
      justifyContent="flex-start"
      padding={4}
      title={bay.name}
      titleRotation={bay.damaged ? titleRotation : 0}
      rightContent={
        <StatDisplay
          label={bay.damaged ? 'Repair' : 'Damage'}
          value={bay.damaged ? '+' : '-'}
          onClick={() => onUpdate({ damaged: !bay.damaged })}
          bg={bay.damaged ? 'su.brick' : 'su.orange'}
          valueColor="su.white"
        />
      }
    >
      <Box position="relative" w="full">
        {bay.damaged && referenceBay?.damagedEffect && (
          <Box
            position="absolute"
            top="50%"
            left={0}
            right={0}
            transform="translateY(-50%)"
            zIndex={10}
            px={2}
            filter="drop-shadow(0 0 4px rgba(0, 0, 0, 0.8))"
          >
            <SheetDisplay label="Damaged Effect" value={referenceBay.damagedEffect} />
          </Box>
        )}

        <VStack gap={2} alignItems="stretch" w="full">
          <Box opacity={bay.damaged ? 0.5 : 1} transition="opacity 0.3s ease">
            <NPCCard
              npc={bay.npc!}
              description={referenceBay?.npc.description || ''}
              maxHP={referenceBay?.npc.hitPoints || 0}
              onUpdateDamage={(value) => onUpdate({ npc: { ...bay.npc!, damage: value } })}
              onUpdateName={(value) => onUpdate({ npc: { ...bay.npc!, name: value } })}
              onUpdateNotes={(value) => onUpdate({ npc: { ...bay.npc!, notes: value } })}
              position={referenceBay?.npc.position || 'NPC'}
              tilted={bay.damaged}
            />
          </Box>

          <Box
            transform={bay.damaged ? `rotate(${bayInfoRotation}deg)` : undefined}
            transition="transform 0.3s ease"
            opacity={bay.damaged ? 0.5 : 1}
          >
            <BayInfo referenceBay={referenceBay} />
          </Box>
        </VStack>
      </Box>
    </RoundedBox>
  )
}
