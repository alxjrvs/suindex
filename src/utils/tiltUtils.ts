import { roll } from '@randsum/roller'

// Generate a random tilt rotation between -3 and 3 degrees
export function getTiltRotation(): number {
  const result = roll('1d7')
  return result.total - 4
}
