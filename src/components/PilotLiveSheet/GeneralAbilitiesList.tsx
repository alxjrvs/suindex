import { useMemo } from 'react'
import { Box } from '@chakra-ui/react'
import { SalvageUnionReference } from 'salvageunion-reference'
import { AbilityDisplay } from '../schema/entities/AbilityDisplay'

export function GeneralAbilitiesList() {
  // Get all abilities with level === "G" (Generic)
  const genericAbilities = useMemo(() => {
    return SalvageUnionReference.Abilities.all()
      .filter((ability) => String(ability.level).toUpperCase() === 'G')
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  return (
    <Box
      css={{
        columnCount: 3,
        columnGap: '1rem',
        '@media (max-width: 768px)': {
          columnCount: 1,
        },
        '@media (min-width: 769px) and (max-width: 1024px)': {
          columnCount: 2,
        },
      }}
      w="full"
    >
      {genericAbilities.map((ability) => (
        <Box
          key={ability.id}
          css={{
            breakInside: 'avoid',
            marginBottom: '1rem',
            // Prevent clipping of rounded corners and shadows
            padding: '2px',
          }}
          position="relative"
          overflow="visible"
        >
          <AbilityDisplay hideLevel data={ability} compact />
        </Box>
      ))}
    </Box>
  )
}
