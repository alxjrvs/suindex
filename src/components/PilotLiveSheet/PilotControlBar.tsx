import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { FormSelect } from '../shared/FormSelect'
import { ControlBarContainer } from '../shared/ControlBarContainer'
import { LinkButton } from '../shared/LinkButton'

interface PilotControlBarProps {
  crawlerId?: string | null
  savedCrawlerId?: string | null
  onCrawlerChange: (crawlerId: string | null) => void
  hasPendingChanges?: boolean
}

export function PilotControlBar({
  crawlerId,
  savedCrawlerId,
  onCrawlerChange,
  hasPendingChanges = false,
}: PilotControlBarProps) {
  const [crawlers, setCrawlers] = useState<{ id: string; name: string; game_id: string | null }[]>(
    []
  )
  const [loadingCrawlers, setLoadingCrawlers] = useState(false)

  // Fetch crawlers
  useEffect(() => {
    const fetchCrawlers = async () => {
      try {
        setLoadingCrawlers(true)
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) return

        const { data } = await supabase
          .from('crawlers')
          .select('id, name, game_id')
          .eq('user_id', userData.user.id)
          .order('name')

        if (data) setCrawlers(data)
      } finally {
        setLoadingCrawlers(false)
      }
    }
    fetchCrawlers()
  }, [])

  return (
    <ControlBarContainer
      backgroundColor="bg.builder.pilot"
      hasPendingChanges={hasPendingChanges}
      leftContent={
        <FormSelect
          label="Crawler"
          value={crawlerId ?? null}
          loading={loadingCrawlers}
          options={crawlers}
          onChange={onCrawlerChange}
          placeholder="No Crawler"
        />
      }
      rightContent={
        savedCrawlerId && (
          <LinkButton to={`/dashboard/crawlers/${savedCrawlerId}`} label="→ Crawler" />
        )
      }
    />
  )
}
