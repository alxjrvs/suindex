import { useMemo, useCallback } from 'react'
import { Box, VStack } from '@chakra-ui/react'
import type { SURefCrawlerBay } from 'salvageunion-reference'
import type { HydratedBay } from '../../types/hydrated'
import { RoundedBox } from '../shared/RoundedBox'
import { NPCCard } from '../shared/NPCCard'
import { BayInfo } from './BayInfo'
import { StatDisplay } from '../StatDisplay'
import { SheetDisplay } from '../shared/SheetDisplay'
import { getTiltRotation } from '../../utils/tiltUtils'
import { useUpdateEntity, useManageEntityChoices } from '../../hooks/suentity'

interface BayCardProps {
  bay: HydratedBay
  disabled?: boolean
  readOnly?: boolean
}

export function BayCard({ bay, disabled = false, readOnly = false }: BayCardProps) {
  const updateEntity = useUpdateEntity()
  const handleUpdateChoice = useManageEntityChoices(bay.id)

  const bayRef = bay.ref as SURefCrawlerBay

  const metadata = useMemo(() => {
    return (
      bay.metadata || {
        damaged: false,
        npc: { name: '', notes: '', hitPoints: null, damage: 0 },
      }
    )
  }, [bay.metadata])

  const titleRotation = useMemo(() => getTiltRotation(), [])
  const bayInfoRotation = useMemo(() => getTiltRotation(), [])

  const handleToggleDamaged = useCallback(() => {
    const currentMetadata = bay.metadata || {
      damaged: false,
      npc: { name: '', notes: '', hitPoints: null, damage: 0 },
    }
    updateEntity.mutate({
      id: bay.id,
      updates: {
        metadata: {
          ...currentMetadata,
          damaged: !currentMetadata.damaged,
        },
      },
    })
  }, [bay.id, bay.metadata, updateEntity])

  const handleUpdateNPC = useCallback(
    (updates: Partial<{ npc: typeof metadata.npc }>) => {
      if (!updates.npc) return
      const currentMetadata = metadata || {
        damaged: false,
        npc: { name: '', notes: '', hitPoints: null, damage: 0 },
      }
      updateEntity.mutate({
        id: bay.id,
        updates: {
          metadata: {
            ...currentMetadata,
            npc: updates.npc,
          },
        },
      })
    },
    [bay.id, updateEntity, metadata]
  )

  return (
    <RoundedBox
      bg={metadata.damaged ? 'su.grey' : 'su.crawlerPink'}
      justifyContent="flex-start"
      title={bayRef.name}
      titleRotation={metadata.damaged ? titleRotation : 0}
      disabled={disabled}
      rightContent={
        !readOnly ? (
          <StatDisplay
            label={metadata.damaged ? 'Repair' : 'Damage'}
            value={metadata.damaged ? '+' : '-'}
            onClick={handleToggleDamaged}
            bg={metadata.damaged ? 'su.orange' : 'su.brick'}
            valueColor="su.white"
            disabled={disabled}
          />
        ) : undefined
      }
    >
      <Box position="relative" w="full">
        {metadata.damaged && bayRef.damagedEffect && (
          <Box
            position="absolute"
            top="50%"
            left={0}
            right={0}
            transform="translateY(-50%)"
            zIndex={1}
            px={2}
            filter="drop-shadow(0 0 4px rgba(0, 0, 0, 0.8))"
          >
            <SheetDisplay label="Damaged Effect" value={bayRef.damagedEffect} />
          </Box>
        )}

        <VStack gap={2} alignItems="stretch" w="full">
          <Box opacity={metadata.damaged ? 0.5 : 1} transition="opacity 0.3s ease">
            <NPCCard
              npc={metadata.npc}
              choices={bay.choices}
              referenceBay={bayRef}
              description={bayRef.npc.description || ''}
              maxHP={bayRef.npc.hitPoints || 0}
              onUpdateChoice={readOnly ? undefined : handleUpdateChoice}
              onUpdateBay={readOnly ? undefined : handleUpdateNPC}
              position={bayRef.npc.position || 'NPC'}
              tilted={metadata.damaged}
              disabled={disabled}
            />
          </Box>

          <Box
            transform={metadata.damaged ? `rotate(${bayInfoRotation}deg)` : undefined}
            transition="transform 0.3s ease"
            opacity={metadata.damaged ? 0.5 : 1}
          >
            <BayInfo bayRef={bayRef} bayEntityId={bay.id} />
          </Box>
        </VStack>
      </Box>
    </RoundedBox>
  )
}
