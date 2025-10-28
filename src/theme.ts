import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { headingRecipe } from './recipes/heading.recipe'
import { textRecipe } from './recipes/text.recipe'

// Salvage Union color palette - raw values
export const suColors = {
  blue: 'rgb(143, 195, 216)',
  gameBlue: 'rgb(125, 206, 235)', // Tech level 1 blue - for games
  green: 'rgb(122, 151, 138)',
  darkGreen: 'rgb(92, 121, 108)', // Slightly darker mech green
  orange: 'rgb(239, 137, 79)',
  darkOrange: 'rgb(200, 100, 50)', // Darker orange for advanced/hybrid abilities
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
  paleBrick: 'rgb(210, 160, 140)', // Pale brick for backgrounds
  black: 'rgb(40, 32, 25)',
  white: 'rgb(251, 248, 243)',
  grey: 'rgb(150, 150, 150)',
  lightGrey: 'rgb(100, 100, 100)',
  mediumGrey: 'rgb(130, 130, 130)',
  darkGrey: 'rgb(80, 80, 80)',
  deepPurple: 'rgb(60, 30, 80)', // Deep rich purple for legendary abilities
  // Derived colors for UI components
  inputBg: 'rgb(232, 229, 216)', // #e8e5d8
  inputText: 'rgb(45, 62, 54)', // #2d3e36
  crawlerPink: 'rgb(201, 125, 158)', // #c97d9e
  lightPeach: 'rgb(245, 193, 163)', // #f5c1a3
  // External brand colors
  discordBlurple: 'rgb(88, 101, 242)', // #5865F2
  discordBlurpleHover: 'rgb(71, 82, 196)', // #4752C4
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
    recipes: {
      heading: headingRecipe,
      text: textRecipe,
    },
    tokens: {
      colors: {
        su: {
          blue: { value: suColors.blue },
          gameBlue: { value: suColors.gameBlue },
          green: { value: suColors.green },
          darkGreen: { value: suColors.darkGreen },
          orange: { value: suColors.orange },
          darkOrange: { value: suColors.darkOrange },
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
          paleBrick: { value: suColors.paleBrick },
          black: { value: suColors.black },
          white: { value: suColors.white },
          grey: { value: suColors.grey },
          lightGrey: { value: suColors.lightGrey },
          mediumGrey: { value: suColors.mediumGrey },
          darkGrey: { value: suColors.darkGrey },
          deepPurple: { value: suColors.deepPurple },
          inputBg: { value: suColors.inputBg },
          inputText: { value: suColors.inputText },
          crawlerPink: { value: suColors.crawlerPink },
          lightPeach: { value: suColors.lightPeach },
          discordBlurple: { value: suColors.discordBlurple },
          discordBlurpleHover: { value: suColors.discordBlurpleHover },
        },
      },
      fonts: {
        heading: { value: "'Fira Code', Monaco, Consolas, 'Ubuntu Mono', monospace" },
        body: { value: "'Fira Code', Monaco, Consolas, 'Ubuntu Mono', monospace" },
        mono: { value: "'Fira Code', Monaco, Consolas, 'Ubuntu Mono', monospace" },
      },
      sizes: {
        // LiveSheet component sizes
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
        'bg.builder.crawler': { value: '{colors.su.gameBlue}' },
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
        'border.builder.crawler': { value: '{colors.su.gameBlue}' },

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
