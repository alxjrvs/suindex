import { EntityDisplay } from '../../shared/EntityDisplay'
import type { SURefNPC } from 'salvageunion-reference'

interface NPCDisplayProps {
  data: SURefNPC
}

export function NPCDisplay({ data }: NPCDisplayProps) {
  return <EntityDisplay data={data} actionHeaderBgColor="su.green" actionHeaderTextColor="white" />
}
