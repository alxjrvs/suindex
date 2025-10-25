import { useMemo } from 'react'
import { SalvageUnionReference } from 'salvageunion-reference'
import type {
  SURefClass,
  SURefAbility,
  SURefEquipment,
  SURefCrawler,
  SURefCrawlerBay,
  SURefCrawlerTechLevel,
  SURefChassis,
  SURefSystem,
  SURefModule,
} from 'salvageunion-reference'

type DataType =
  | 'classes'
  | 'abilities'
  | 'equipment'
  | 'crawlers'
  | 'crawlerBays'
  | 'crawlerTechLevels'
  | 'chassis'
  | 'systems'
  | 'modules'

/**
 * Generic hook for loading and memoizing SalvageUnionReference data
 * Eliminates repeated SalvageUnionReference.X.all() calls across components
 *
 * @example
 * ```tsx
 * const { classes, abilities, equipment } = useSalvageUnionData('classes', 'abilities', 'equipment')
 * ```
 */
export function useSalvageUnionData(...dataTypes: DataType[]) {
  return useMemo(() => {
    const result: Record<string, unknown> = {}

    for (const type of dataTypes) {
      switch (type) {
        case 'classes':
          result.classes = SalvageUnionReference.Classes.all() as SURefClass[]
          break
        case 'abilities':
          result.abilities = SalvageUnionReference.Abilities.all() as SURefAbility[]
          break
        case 'equipment':
          result.equipment = SalvageUnionReference.Equipment.all() as SURefEquipment[]
          break
        case 'crawlers':
          result.crawlers = SalvageUnionReference.Crawlers.all() as SURefCrawler[]
          break
        case 'crawlerBays':
          result.crawlerBays = SalvageUnionReference.CrawlerBays.all() as SURefCrawlerBay[]
          break
        case 'crawlerTechLevels':
          result.crawlerTechLevels =
            SalvageUnionReference.CrawlerTechLevels.all() as SURefCrawlerTechLevel[]
          break
        case 'chassis':
          result.chassis = SalvageUnionReference.Chassis.all() as SURefChassis[]
          break
        case 'systems':
          result.systems = SalvageUnionReference.Systems.all() as SURefSystem[]
          break
        case 'modules':
          result.modules = SalvageUnionReference.Modules.all() as SURefModule[]
          break
      }
    }

    return result
  }, [dataTypes])
}
