---
type: 'always_apply'
---

# Bun Runtime Rules

## Priority

- **Bun-native first**: Use Bun APIs over Node.js when available
- **Package manager**: Use `bun install`, `bun add`, `bun remove` (never npm/yarn/pnpm)
- **Test runner**: Use `bun test` (not vitest/jest)

## Scripts

```bash
bun dev          # Start dev server
bun test         # Run tests
bun sanity       # Lint + format + typecheck
bun run build    # Production build
```

## Testing

- **Framework**: `bun:test` with React Testing Library
- **Test files**: `*.test.tsx` in `src/__tests__/`
- **Example**: See `src/__tests__/schema.test.tsx`

## Documentation

- **Bun docs**: https://bun.sh/docs
- **Bun test**: https://bun.sh/docs/cli/test
