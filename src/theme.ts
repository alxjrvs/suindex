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
  // Derived colors for UI components
  inputBg: 'rgb(232, 229, 216)', // #e8e5d8
  inputText: 'rgb(45, 62, 54)', // #2d3e36
  crawlerPink: 'rgb(201, 125, 158)', // #c97d9e
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
          inputBg: { value: suColors.inputBg },
          inputText: { value: suColors.inputText },
          crawlerPink: { value: suColors.crawlerPink },
        },
      },
      fonts: {
        heading: { value: "'Fira Code', Monaco, Consolas, 'Ubuntu Mono', monospace" },
        body: { value: "'Fira Code', Monaco, Consolas, 'Ubuntu Mono', monospace" },
        mono: { value: "'Fira Code', Monaco, Consolas, 'Ubuntu Mono', monospace" },
      },
      sizes: {
        // Builder component sizes
        'builder.border': { value: '8px' },
        'builder.border.sm': { value: '4px' },
        'builder.radius': { value: '24px' }, // rounded-3xl
        'builder.radius.md': { value: '16px' }, // rounded-2xl
        'builder.radius.sm': { value: '8px' }, // rounded-lg
        'builder.padding': { value: '24px' }, // p-6
        'builder.padding.md': { value: '16px' }, // p-4
        'builder.padding.sm': { value: '12px' }, // p-3
      },
    },
    semanticTokens: {
      colors: {
        // Background colors
        'bg.canvas': { value: '{colors.su.white}' },
        'bg.surface': { value: '{colors.su.lightBlue}' },
        'bg.muted': { value: '{colors.su.lightOrange}' },
        'bg.builder': { value: '{colors.su.green}' },
        'bg.builder.mech': { value: '{colors.su.green}' },
        'bg.builder.pilot': { value: '{colors.su.orange}' },
        'bg.builder.crawler': { value: '{colors.su.crawlerPink}' },
        'bg.input': { value: '{colors.su.inputBg}' },

        // Text colors
        'fg.default': { value: '{colors.su.black}' },
        'fg.muted': { value: '{colors.su.black}' },
        'fg.inverted': { value: '{colors.su.white}' },
        'fg.input': { value: '{colors.su.inputText}' },
        'fg.input.label': { value: '{colors.su.inputBg}' },

        // Border colors
        'border.default': { value: '{colors.su.black}' },
        'border.builder': { value: '{colors.su.green}' },
        'border.builder.pilot': { value: '{colors.su.orange}' },
        'border.builder.crawler': { value: '{colors.su.crawlerPink}' },

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
    h1: {
      color: 'su.white',
      bg: 'su.black',
      padding: '12px',
      fontWeight: 'bold',
      display: 'inline-block',
    },
    h2: {
      color: 'su.white',
      bg: 'su.black',
      fontWeight: 'bold',
      padding: '8px',
      display: 'inline-block',
    },
    h3: {
      color: 'su.black',
      fontWeight: 'bold',
      bg: 'transparent',
    },
    h4: {
      color: 'su.black',
      fontWeight: 'bold',
      bg: 'transparent',
    },
    h5: {
      color: 'su.black',
      bg: 'transparent',
    },
    h6: {
      color: 'su.black',
      bg: 'transparent',
    },
  },
})

export const system = createSystem(defaultConfig, config)

// Export heading styles for use in components
// Font sizes match HTML defaults: h1=2em, h2=1.5em, h3=1.17em, h4=1em, h5=0.83em, h6=0.67em
export const headingStyles = {
  h1: {
    color: 'su.white',
    bg: 'su.black',
    py: '12px',
    fontWeight: 'bold',
    fontSize: '2em',
  },
  h2: {
    color: 'su.white',
    bg: 'su.black',
    fontWeight: 'bold',
    fontSize: '1.5em',
  },
  h3: {
    color: 'su.black',
    bg: 'transparent',
    fontWeight: 'bold',
    fontSize: '1.17em',
  },
  h4: {
    color: 'su.black',
    bg: 'transparent',
    fontWeight: 'bold',
    fontSize: '1em',
  },
  h5: {
    color: 'su.black',
    bg: 'transparent',
    fontWeight: 'bold',
    fontSize: '0.83em',
  },
  h6: {
    color: 'su.black',
    bg: 'transparent',
    fontWeight: 'bold',
    fontSize: '0.67em',
  },
} as const
