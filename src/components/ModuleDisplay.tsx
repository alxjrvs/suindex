import { EntityDisplay } from './shared/EntityDisplay'
import type { Module } from 'salvageunion-reference'

interface ModuleDisplayProps {
  data: Module
}

export function ModuleDisplay({ data }: ModuleDisplayProps) {
  return <EntityDisplay data={data} />
}
