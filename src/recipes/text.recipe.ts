'use client'

import { defineRecipe } from '@chakra-ui/react'

export const textRecipe = defineRecipe({
  variants: {
    variant: {
      pseudoheader: {
        fontWeight: 'bold',
        color: 'su.white',
        bgColor: 'su.black',
        px: 0.5,
      },
    },
  },
})

