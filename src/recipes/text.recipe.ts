'use client'

import { defineRecipe } from '@chakra-ui/react'

export const textRecipe = defineRecipe({
  variants: {
    variant: {
      pseudoheader: {
        fontWeight: 'bold',
        color: 'su.white',
        bg: 'su.black',
        px: 0.5,
        display: 'inline-block',
        alignSelf: 'flex-start',
        lineHeight: 1,
      },
    },
  },
})
