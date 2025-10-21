import { StatDisplay } from './StatDisplay'

interface CrawlerCardProps {
  name: string
  typeName: string
  maxSP: number
  currentDamage: number
}

export function CrawlerCard({ name, typeName, maxSP, currentDamage }: CrawlerCardProps) {
  const currentSP = maxSP - currentDamage
  const spDisplay = `${currentSP}/${maxSP}`

  return (
    <div className="bg-[#c97d9e] border-4 border-[#c97d9e] rounded-3xl p-4 shadow-lg flex items-center justify-between h-[120px]">
      <div className="flex-1 pr-4">
        <div className="text-xl font-bold text-[var(--color-su-white)] leading-tight">{name}</div>
        <div className="text-sm text-[var(--color-su-white)] opacity-90 mt-1">
          <span className="capitalize">{typeName}</span> Crawler
        </div>
      </div>
      <div className="min-w-[80px]">
        <StatDisplay label="SP" value={spDisplay} />
      </div>
    </div>
  )
}

export default CrawlerCard
