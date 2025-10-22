import { EntityDisplay } from './shared/EntityDisplay'
import type { NPC } from 'salvageunion-reference'

interface NPCDisplayProps {
  data: NPC
}

export function NPCDisplay({ data }: NPCDisplayProps) {
  return <EntityDisplay data={data} actionHeaderBgColor="su.green" actionHeaderTextColor="white" />
}
