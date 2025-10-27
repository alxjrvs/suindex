/**
 * Generate a random bold color that works well with black text
 * Returns an RGB color string
 */
export function generateRandomLightColor(): string {
  // Define a palette of bolder, more saturated colors that still work well with black text
  const lightColors = [
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

  // Pick a random color from the palette
  return lightColors[Math.floor(Math.random() * lightColors.length)]
}
