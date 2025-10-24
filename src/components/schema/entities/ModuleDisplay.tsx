import { EntityDisplay } from '../../shared/EntityDisplay'
import type { SURefModule } from 'salvageunion-reference'

interface ModuleDisplayProps {
  data: SURefModule
}

export function ModuleDisplay({ data }: ModuleDisplayProps) {
  return <EntityDisplay data={data} />
}
