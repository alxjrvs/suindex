---
type: 'context_file'
paths: ['src/__tests__/**/*.tsx', 'src/test/**/*.tsx']
---

# Testing Standards

## Framework

- **Test runner**: `bun:test` (NOT vitest/jest)
- **React testing**: React Testing Library
- **Location**: `src/__tests__/`

## Test Styles

1. **Schema Tests** - Load each schema index page for every data value

   ```typescript
   test('displays all properties for: ${entity.name}', () => {
     const { container } = render(
       <EntityDisplay data={entity} schemaName={schemaName} />
     )
     expect(container.textContent).toContain(entity.name)
   })
   ```

2. **LiveSheet Tests** - Complex user behavior testing
   - User interactions
   - State updates
   - Auto-save behavior

## Running Tests

```bash
bun test              # Run all tests
bun test --watch      # Watch mode
```

## Test Utilities

- **Chakra wrapper**: `src/test/chakra-utils.tsx`
- **Happy DOM**: Global DOM environment for tests

## Coverage

- All schema entities must have display tests
- Critical user flows must have integration tests

## Documentation

- **Bun test**: https://bun.sh/docs/cli/test
- **RTL**: https://testing-library.com/docs/react-testing-library/intro
