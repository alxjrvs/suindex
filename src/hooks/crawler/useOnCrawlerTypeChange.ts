import { useCallback } from 'react'
import { useUpdateCrawler } from './useCrawlers'
import { useHydratedCrawler } from './useHydratedCrawler'

export function useOnCrawlerTypeChange(id: string) {
  const { crawler } = useHydratedCrawler(id)

  const updateCrawler = useUpdateCrawler()
  return useCallback(
    async (crawlerTypeId: string | null) => {
      if (!id || !crawler) return

      // If null or empty, just update to null
      if (!crawlerTypeId) {
        updateCrawler.mutate({ id, updates: { crawler_type_id: null } })
        return
      }

      // If there's already a crawler type selected and user is changing it, confirm
      if (crawler.crawler_type_id && crawler.crawler_type_id !== crawlerTypeId) {
        const confirmed = window.confirm(
          'Changing the crawler type will reset tech level and scrap. Continue?'
        )

        if (confirmed) {
          updateCrawler.mutate({
            id,
            updates: {
              crawler_type_id: crawlerTypeId,
              tech_level: 1,
              scrap_tl_one: 0,
              scrap_tl_two: 0,
              scrap_tl_three: 0,
              scrap_tl_four: 0,
              scrap_tl_five: 0,
              scrap_tl_six: 0,
            },
          })
        }
      } else {
        // First time selection
        updateCrawler.mutate({
          id,
          updates: {
            crawler_type_id: crawlerTypeId,
          },
        })
      }
    },
    [id, crawler, updateCrawler]
  )
}
