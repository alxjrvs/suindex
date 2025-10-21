import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../../lib/supabase'
import type { Tables } from '../../types/database'
import { SalvageUnionReference } from 'salvageunion-reference'
import CrawlerCard from '../CrawlerCard'
import { NewCrawlerModal } from './NewCrawlerModal'

type CrawlerRow = Tables<'crawlers'>

export function CrawlersGrid() {
  const navigate = useNavigate()
  const [crawlers, setCrawlers] = useState<CrawlerRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadCrawlers()
  }, [])

  const loadCrawlers = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Fetch crawlers owned by the user
      const { data: crawlersData, error: crawlersError } = await supabase
        .from('crawlers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (crawlersError) throw crawlersError

      setCrawlers((crawlersData || []) as CrawlerRow[])
    } catch (err) {
      console.error('Error loading crawlers:', err)
      setError(err instanceof Error ? err.message : 'Failed to load crawlers')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCrawler = () => {
    setIsModalOpen(true)
  }

  const handleCrawlerClick = (crawlerId: string) => {
    navigate(`/dashboard/crawlers/${crawlerId}`)
  }

  const handleModalSuccess = () => {
    loadCrawlers()
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-xl text-[var(--color-su-brick)]">Loading crawlers...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <button
            onClick={loadCrawlers}
            className="bg-[var(--color-su-brick)] hover:opacity-90 text-[var(--color-su-white)] font-bold py-2 px-6 rounded-lg transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // If no crawlers, show the centered "Create Crawler" button
  if (crawlers.length === 0) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--color-su-black)] mb-8">Your Crawlers</h2>
            <p className="text-lg text-[var(--color-su-brick)] mb-8">
              You don't have any crawlers yet. Create your first crawler to get started!
            </p>
            <button
              onClick={handleCreateCrawler}
              className="bg-[#c97d9e] hover:opacity-90 text-[var(--color-su-white)] font-bold py-4 px-8 rounded-lg text-xl transition-opacity shadow-lg"
            >
              Create Crawler
            </button>
          </div>
        </div>

        <NewCrawlerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      </div>
    )
  }

  // Show crawlers grid
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-su-black)]">Your Crawlers</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Existing crawlers */}
        {crawlers.map((crawler) => {
          const crawlerTypeName = crawler.crawler_type_id
            ? (SalvageUnionReference.Crawlers.all().find((c) => c.id === crawler.crawler_type_id)
                ?.name ?? 'Unknown')
            : 'Unknown'

          const maxSP = crawler.tech_level
            ? (SalvageUnionReference.CrawlerTechLevels.all().find(
                (tl) => tl.techLevel === crawler.tech_level
              )?.structurePoints ?? 20)
            : 20

          return (
            <button
              key={crawler.id}
              onClick={() => handleCrawlerClick(crawler.id)}
              className="hover:scale-105 transition-transform"
            >
              <CrawlerCard
                name={crawler.name}
                typeName={crawlerTypeName}
                maxSP={maxSP}
                currentDamage={crawler.current_damage ?? 0}
              />
            </button>
          )
        })}

        {/* Create Crawler cell */}
        <button
          onClick={handleCreateCrawler}
          className="bg-[#f5c1a3] border-2 border-dashed border-[#c97d9e] rounded-lg p-6 hover:bg-[#c97d9e] hover:border-solid transition-all h-48 flex flex-col items-center justify-center group"
        >
          <div className="text-6xl text-[#c97d9e] group-hover:text-[var(--color-su-white)] mb-2">
            +
          </div>
          <div className="text-xl font-bold text-[#c97d9e] group-hover:text-[var(--color-su-white)]">
            Create Crawler
          </div>
        </button>
      </div>

      <NewCrawlerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}
