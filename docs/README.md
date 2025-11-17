# SURef Monorepo

A Bun monorepo containing the SURef web application and the Salvage Union Reference package.

## Structure

```
.
├── apps/
│   └── suref-web/          # Main web application
├── packages/
│   └── salvageunion-reference/  # Salvage Union game data package
└── package.json          # Root workspace configuration
```

## Getting Started

### Install Dependencies

```bash
bun install
```

### Development

Run the development server from the root:

```bash
bun run dev
```

Or from the app directory:

```bash
cd apps/suref-web
bun run dev
```

### Build

Build the reference package and app:

```bash
bun run build
```

This will:
1. Build the `salvageunion-reference` package
2. Build the `suref-web` app

## Workspace Scripts

From the root, you can run scripts for any workspace:

```bash
# Run scripts in suref-web app
bun --filter suref-web <script>

# Run scripts in salvageunion-reference package
bun --filter salvageunion-reference <script>
```

## Apps

### suref-web

The main web application for viewing and exploring Salvage Union game data.

- **Dynamic Schema Loading**: Automatically reads all schemas from the reference package
- **Search**: Search items by name or description
- **Filtering**: Filter data by any field with multiple values
- **Sorting**: Click column headers to sort data
- **Detail View**: Click "View Details" to see all fields for any item

## Packages

### salvageunion-reference

Comprehensive, schema-validated JSON dataset and TypeScript ORM for the Salvage Union tabletop RPG.

See [packages/salvageunion-reference/README.md](./packages/salvageunion-reference/README.md) for details.
