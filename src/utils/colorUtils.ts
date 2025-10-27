// Define a palette of bolder, more saturated colors that still work well with black text
const LIGHT_COLORS = [
  'rgb(255, 180, 180)', // Bold pink
  'rgb(255, 200, 150)', // Bold peach
  'rgb(255, 240, 150)', // Bold yellow
  'rgb(180, 255, 180)', // Bold green
  'rgb(180, 220, 255)', // Bold blue
  'rgb(220, 180, 255)', // Bold purple
  'rgb(255, 180, 220)', // Bold magenta
  'rgb(200, 255, 200)', // Bright green
  'rgb(255, 220, 180)', // Bold cream
  'rgb(180, 210, 255)', // Bright blue
  'rgb(255, 200, 220)', // Bold blush
  'rgb(220, 255, 180)', // Bright lime
  'rgb(230, 200, 255)', // Bold lavender
  'rgb(255, 235, 180)', // Bold ivory
  'rgb(200, 230, 255)', // Bright alice blue
  'rgb(255, 200, 180)', // Coral
  'rgb(180, 255, 220)', // Mint
  'rgb(255, 220, 200)', // Apricot
]

/**
 * Generate a random bold color that works well with black text
 * Returns an RGB color string
 */
export function generateRandomLightColor(): string {
  // Pick a random color from the palette
  return LIGHT_COLORS[Math.floor(Math.random() * LIGHT_COLORS.length)]
}

/**
 * Generate a unique color that hasn't been used yet
 * @param usedColors - Array of colors already in use
 * @returns A color that hasn't been used, or a random color if all have been used
 */
export function generateUniqueColor(usedColors: string[]): string {
  // Find colors that haven't been used yet
  const availableColors = LIGHT_COLORS.filter((color) => !usedColors.includes(color))

  // If there are unused colors, pick one randomly
  if (availableColors.length > 0) {
    return availableColors[Math.floor(Math.random() * availableColors.length)]
  }

  // If all colors have been used, just return a random one
  return generateRandomLightColor()
}
