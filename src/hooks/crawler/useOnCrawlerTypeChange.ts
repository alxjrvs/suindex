import { useCallback } from 'react'
import { useUpdateCrawler } from './useCrawlers'
import { useHydratedCrawler } from './useHydratedCrawler'
import { useDeleteEntity, useCreateEntity } from '../suentity/useSUEntities'

export function useOnCrawlerTypeChange(id: string) {
  const { crawler, selectedCrawlerType } = useHydratedCrawler(id)
  const updateCrawler = useUpdateCrawler()
  const deleteEntity = useDeleteEntity()
  const createEntity = useCreateEntity()

  return useCallback(
    async (crawlerTypeId: string | null) => {
      if (!id || !crawler) return

      // If null or empty, delete the existing crawler type entity
      if (!crawlerTypeId) {
        if (selectedCrawlerType) {
          deleteEntity.mutate({ id: selectedCrawlerType.id, parentType: 'crawler', parentId: id })
        }
        return
      }

      const isChangingCrawlerType =
        selectedCrawlerType && selectedCrawlerType.schema_ref_id !== crawlerTypeId

      // If there's already a crawler type selected and user is changing it, confirm
      if (isChangingCrawlerType) {
        const confirmed = window.confirm(
          'Changing the crawler type will reset tech level and scrap. Continue?'
        )

        if (confirmed) {
          // Delete old crawler type entity
          deleteEntity.mutate({ id: selectedCrawlerType.id, parentType: 'crawler', parentId: id })

          // Create new crawler type entity
          createEntity.mutate({
            crawler_id: id,
            schema_name: 'crawlers',
            schema_ref_id: crawlerTypeId,
          })

          // Reset tech level and scrap
          updateCrawler.mutate({
            id,
            updates: {
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
      } else if (!selectedCrawlerType) {
        // First time selection - create crawler type entity
        createEntity.mutate({
          crawler_id: id,
          schema_name: 'crawlers',
          schema_ref_id: crawlerTypeId,
        })
      }
    },
    [id, crawler, selectedCrawlerType, updateCrawler, deleteEntity, createEntity]
  )
}
