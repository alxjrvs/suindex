import { DataValue } from '~/types'
import { ReferencesHydrator } from './referencesHydrator'
import { ComponentLike, TechLevel } from './types'
import { ComponentAction } from './componentAction'

export class BaseComponentLike<T extends ComponentLike> {
  static rulesKey = 'Not implemented'

  static async fetch() {
    if (this.rulesKey === 'Not implemented') {
      throw new Error('rulesKey not implemented')
    }
    return ReferencesHydrator.getRules(this.rulesKey)
  }

  static async all() {
    const data = await this.fetch()
    return data.map((d: any) => new this(d))
  }

  protected data: T
  constructor(data: T) {
    this.data = data
  }
  get name() {
    return this.data.name
  }
  get description() {
    return this.data.description
  }

  get techLevel(): TechLevel | undefined {
    if (!this.data.techLevel) return undefined
    return this.data.techLevel as TechLevel
  }

  get traits() {
    if (!this.data.traits) return []
    return this.data.traits.map((t) => {
      return `${t.type.trimEnd()}${t.amount !== undefined ? `(${t.amount})` : ''}`
    })
  }

  get details() {
    const details: DataValue[] = []

    if (this.activationCost) {
      details.push({ value: this.activationCost, cost: true })
    }

    if (this.actionType) {
      details.push({ value: this.actionType })
    }

    if (this.range) {
      details.push({ value: this.range })
    }

    if (this.damage) {
      details.push({ value: this.damage })
    }

    if (this.traits.length > 0) {
      this.traits.forEach((t) => {
        details.push({ value: t })
      })
    }

    return details
  }

  get activationCost() {
    if (!this.data.activationCost) return undefined
    const cost =
      String(this.data.activationCost).toLowerCase() === 'variable'
        ? 'X'
        : this.data.activationCost
    return `${cost}${this.activationCurrency}`
  }

  get range() {
    if (!this.data.range) return undefined
    return `Range:${this.data.range}`
  }

  get damage() {
    if (!this.data.damage) return undefined
    return `Damage:${this.data.damage.amount}${this.data.damage.type}`
  }

  get actionType() {
    if (!this.data.actionType) return undefined
    if (this.data.actionType.includes('action')) {
      return this.data.actionType
    }
    return `${this.data.actionType} Action`
  }

  get notes() {
    if (!this.data.notes) return undefined
    return this.data.notes
  }

  get salvageValue() {
    if (!this.data.salvageValue) return undefined
    return this.data.salvageValue
  }

  get slotsRequired() {
    if (!this.data.slotsRequired) return undefined
    return this.data.slotsRequired
  }

  get actions() {
    if (!this.data.actions) return []
    return this.data.actions.map(
      (a) => new ComponentAction(a, this.activationCurrency)
    )
  }

  get activationCurrency(): string {
    throw new Error('Not implemented')
  }
}
