import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

// Salvage Union color palette - raw values
export const suColors = {
  blue: 'rgb(143, 195, 216)',
  green: 'rgb(122, 151, 138)',
  orange: 'rgb(239, 137, 79)',
  lightOrange: 'rgb(245, 193, 163)',
  lightBlue: 'rgb(199, 223, 231)',
  oneBlue: 'rgb(115, 201, 230)',
  twoBlue: 'rgb(87, 169, 200)',
  threeBlue: 'rgb(68, 135, 162)',
  fourBlue: 'rgb(48, 107, 128)',
  fiveBlue: 'rgb(30, 83, 100)',
  sixBlue: 'rgb(6, 52, 65)',
  pink: 'rgb(206, 88, 152)',
  brick: 'rgb(168, 89, 71)',
  black: 'rgb(40, 32, 25)',
  white: 'rgb(251, 248, 243)',
}

// Tech level color mapping
export const techLevelColors: Record<number, string> = {
  1: suColors.oneBlue,
  2: suColors.twoBlue,
  3: suColors.threeBlue,
  4: suColors.fourBlue,
  5: suColors.fiveBlue,
  6: suColors.sixBlue,
}

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        su: {
          blue: { value: suColors.blue },
          green: { value: suColors.green },
          orange: { value: suColors.orange },
          lightOrange: { value: suColors.lightOrange },
          lightBlue: { value: suColors.lightBlue },
          oneBlue: { value: suColors.oneBlue },
          twoBlue: { value: suColors.twoBlue },
          threeBlue: { value: suColors.threeBlue },
          fourBlue: { value: suColors.fourBlue },
          fiveBlue: { value: suColors.fiveBlue },
          sixBlue: { value: suColors.sixBlue },
          pink: { value: suColors.pink },
          brick: { value: suColors.brick },
          black: { value: suColors.black },
          white: { value: suColors.white },
        },
      },
      fonts: {
        heading: { value: "'Fira Code', Monaco, Consolas, 'Ubuntu Mono', monospace" },
        body: { value: "'Fira Code', Monaco, Consolas, 'Ubuntu Mono', monospace" },
        mono: { value: "'Fira Code', Monaco, Consolas, 'Ubuntu Mono', monospace" },
      },
    },
    semanticTokens: {
      colors: {
        // Background colors
        'bg.canvas': { value: '{colors.su.white}' },
        'bg.surface': { value: '{colors.su.lightBlue}' },
        'bg.muted': { value: '{colors.su.lightOrange}' },

        // Text colors
        'fg.default': { value: '{colors.su.black}' },
        'fg.muted': { value: '{colors.su.black}' },
        'fg.inverted': { value: '{colors.su.white}' },

        // Border colors
        'border.default': { value: '{colors.su.black}' },

        // Brand colors
        'brand.solid': { value: '{colors.su.orange}' },
        'brand.muted': { value: '{colors.su.lightOrange}' },
      },
    },
  },
  globalCss: {
    body: {
      bg: 'bg.canvas',
      color: 'fg.default',
      fontFamily: 'body',
    },
    code: {
      fontFamily: 'mono',
    },
  },
})

export const system = createSystem(defaultConfig, config)
