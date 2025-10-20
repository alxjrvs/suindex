import { Frame } from './shared/Frame'
import { StatList } from './shared/StatList'
import { AbilityCard } from './shared/AbilityCard'
import { DescriptionBox } from './shared/DescriptionBox'
import { PageReferenceDisplay } from './shared/PageReferenceDisplay'
import type { NPC } from 'salvageunion-reference'

interface NPCDisplayProps {
  data: NPC
}

export function NPCDisplay({ data }: NPCDisplayProps) {
  return (
    <Frame
      header={data.name}
      headerContent={
        <div className="ml-auto pb-6" style={{ overflow: 'visible' }}>
          <StatList
            stats={[
              {
                label: 'HP',
                value: data.hitPoints.toString(),
              },
            ]}
            up={false}
          />
        </div>
      }
      showSidebar={false}
    >
      {/* Description */}
      {data.description && <DescriptionBox description={data.description} />}

      {/* Abilities */}
      {data.abilities && data.abilities.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[var(--color-su-black)] uppercase">Abilities</h3>
          {data.abilities.map((ability, index) => (
            <AbilityCard key={index} ability={ability} />
          ))}
        </div>
      )}

      {/* Page Reference */}
      <PageReferenceDisplay source={data.source} page={data.page} />
    </Frame>
  )
}
