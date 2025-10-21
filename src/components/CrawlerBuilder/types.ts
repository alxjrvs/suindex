export interface CrawlerBayState {
  id: string
  bayId: string
  name: string
  operator: string
  operatorPosition: string
  description: string
}

export interface CargoItem {
  id: string
  amount: number
  description: string
}

export interface CrawlerState {
  name: string
  crawlerTypeId: string | null
  description: string
  currentSP: number
  techLevel: number
  upgrade: number
  currentScrap: number
  bays: CrawlerBayState[]
  storageBayOperator: string
  storageBayDescription: string
  cargo: CargoItem[]
  notes: string
}
