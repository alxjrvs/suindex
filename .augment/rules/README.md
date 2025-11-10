# SUIndex Development Rules

Concise, actionable rules for the SUIndex project. Each file links to official documentation.

## Core Technologies

### Language & Runtime

- **[typescript.md](./typescript.md)** - Strict TypeScript configuration
- **[bun.md](./bun.md)** - Bun runtime and package management

### Build & Deploy

- **[vite.md](./vite.md)** - Vite build configuration
- **[deployment.md](./deployment.md)** - Netlify deployment via CI/CD

### Data & Backend

- **[salvageunion-reference.md](./salvageunion-reference.md)** - **SOURCE OF TRUTH** for all game data types
- **[supabase.md](./supabase.md)** - Database client and type generation

### Frontend

- **[react-patterns.md](./react-patterns.md)** - Component structure and state management
- **[chakra-ui.md](./chakra-ui.md)** - Styling system and theme
- **[testing.md](./testing.md)** - Test standards with bun:test + RTL

### Code Organization

- **[helpers-utils.md](./helpers-utils.md)** - Helper functions and utilities

## Quick Reference

### Commands

```bash
bun dev          # Start dev server
bun test         # Run tests
bun sanity       # Lint + format + typecheck
bun run build    # Production build
bun run gen:types # Generate Supabase types
```

### Key Principles

1. **Strict TypeScript** - No `any`, use `import type` for types
2. **Bun-native first** - Use Bun APIs over Node.js
3. **salvageunion-reference is source of truth** - Never create custom game data types
4. **Chakra UI for styling** - Use theme tokens (`su.*`)
5. **Extract helpers at 2+ uses** - Keep code DRY
6. **Test with bun:test** - Schema tests + LiveSheet tests

### File Structure

```
src/
├── components/
│   ├── base/              # Text, Heading (with recipes)
│   ├── shared/            # Reusable components
│   ├── entity/            # Entity display components
│   └── [Feature]/         # Feature-specific (MechLiveSheet, etc.)
├── hooks/                 # Custom React hooks
├── lib/
│   ├── api/              # Supabase API functions (by entity)
│   └── supabase.ts       # Supabase client
├── utils/                # Pure utility functions
├── constants/            # Game rules and constants
├── types/                # TypeScript types
│   └── database-generated.types.ts  # Auto-generated from Supabase
└── theme.ts              # Chakra UI theme
```
