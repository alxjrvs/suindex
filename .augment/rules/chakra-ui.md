---
type: 'context_file'
paths: ['src/components/**/*.tsx', 'src/theme.ts', 'src/recipes/**/*.ts']
---

# Chakra UI Styling

## Theme System

- **Config**: `src/theme.ts`
- **Colors**: Use `su.*` tokens from theme (e.g., `su.orange`, `su.lightBlue`)
- **Recipes**: Custom variants in `src/recipes/` (text, heading, button)

## Color Palette

```typescript
// Salvage Union colors (from src/theme.ts)
su.orange      // Primary orange
su.lightBlue   // Light blue backgrounds
su.green       // Mech/chassis green
su.pink        // Legendary abilities
su.brick       // Advanced/hybrid classes
su.black       // Text
su.white       // Backgrounds

// Tech level colors
su.oneBlue through su.sixBlue  // TL1-6 blues
```

## Component Usage

```typescript
import { Box, Flex, VStack, Grid } from '@chakra-ui/react'

// ✅ Use Chakra props for styling
<Box bg="su.lightBlue" p={4} borderRadius="md">
  <Text color="su.black" fontSize="lg">Content</Text>
</Box>

// ✅ Responsive props
<Flex direction={{ base: 'column', lg: 'row' }} gap={4}>
```

## Custom Components

- **Text**: `src/components/base/Text.tsx` (with recipe variants)
- **Heading**: `src/components/base/Heading.tsx` (with recipe variants)
- **Variants**: `pseudoheader`, `pseudoheaderInverse`

## Spacing

- Use Chakra spacing scale: `p={4}`, `gap={6}`, `mb={3}`
- Compact mode: Reduce spacing by ~50% (`compact ? 2 : 4`)

## Documentation

- **Chakra UI v3**: https://www.chakra-ui.com/docs/get-started/overview
- **Styling props**: https://www.chakra-ui.com/docs/styled-system/style-props
