# App-Wide Providers

This directory contains global providers that wrap the entire application.

## Toast Provider

The toast system uses Chakra UI v3's `createToaster` API for imperative toast notifications.

### Usage

```tsx
import { toaster } from '@/components/ui/toaster'

// Simple toast
toaster.create({
  title: 'Success!',
  description: 'Your changes have been saved.',
  type: 'success',
})

// Different types
toaster.success({ title: 'Success!' })
toaster.error({ title: 'Error occurred' })
toaster.warning({ title: 'Warning!' })
toaster.info({ title: 'Info message' })
toaster.loading({ title: 'Loading...' })

// With action button
toaster.create({
  title: 'File deleted',
  description: 'The file has been removed.',
  type: 'info',
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo clicked'),
  },
})

// Promise-based toast
const promise = saveData()
toaster.promise(promise, {
  loading: { title: 'Saving...' },
  success: { title: 'Saved successfully!' },
  error: { title: 'Failed to save' },
})

// Dismiss all toasts
toaster.dismiss()

// Update existing toast
const id = toaster.create({ title: 'Processing...' })
toaster.update(id, { title: 'Complete!', type: 'success' })
```

### Configuration

The toaster is configured in `src/components/ui/toaster.tsx` with:

- Placement: `bottom-end`
- Auto-pause on page idle
- Gap between toasts: 2
- Offsets from viewport edges: 1rem

## Entity Viewer Modal Provider

The `EntityViewerModalProvider` provides a global modal for viewing any entity from the salvageunion-reference library.

### Usage

```tsx
import { useEntityModal } from '@/providers/useEntityModal'

function MyComponent() {
  const { openEntityModal } = useEntityModal()

  const handleClick = () => {
    // Open modal with schema name and entity ID
    openEntityModal('abilities', 'some-ability-id')
  }

  return <button onClick={handleClick}>View Ability</button>
}
```

### API

#### `useEntityModal()`

Returns an object with:

- `openEntityModal(schemaName: SURefSchemaName, entityId: string)` - Opens the modal with the specified entity
- `closeEntityModal()` - Closes the modal

#### Supported Schema Names

Any valid `SURefSchemaName` from salvageunion-reference:

- `'abilities'`
- `'systems'`
- `'modules'`
- `'chassis'`
- `'equipment'`
- `'creatures'`
- `'npcs'`
- `'crawlers'`
- `'crawler-bays'`
- And more...

### Example: Combined Usage

```tsx
import { toaster } from '@/components/ui/toaster'
import { useEntityModal } from '@/providers/EntityViewerModalProvider'

function ItemCard({ itemId }: { itemId: string }) {
  const { openEntityModal } = useEntityModal()

  const handleView = () => {
    openEntityModal('systems', itemId)
    toaster.info({ title: 'Viewing system details' })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(itemId)
    toaster.success({ title: 'ID copied to clipboard!' })
  }

  return (
    <div>
      <button onClick={handleView}>View Details</button>
      <button onClick={handleCopy}>Copy ID</button>
    </div>
  )
}
```

## Entity Display Tooltip

The `EntityDisplayTooltip` component shows entity details in a hover card when hovering over wrapped content.

### Usage

```tsx
import { EntityDisplayTooltip } from '@/components/entity/EntityDisplayTooltip'
import { Text } from '@/components/base/Text'

function MyComponent() {
  return (
    <EntityDisplayTooltip schemaName="systems" entityId="laser-cannon-id">
      <Text>Hover me to see system details</Text>
    </EntityDisplayTooltip>
  )
}

// With custom width and delays
function CustomTooltip() {
  return (
    <EntityDisplayTooltip
      schemaName="abilities"
      entityId="ability-id"
      width="500px"
      openDelay={300}
      closeDelay={200}
      showArrow={true}
    >
      <Button>Hover for ability details</Button>
    </EntityDisplayTooltip>
  )
}
```

### Props

- `schemaName`: The schema name (e.g., 'systems', 'abilities', 'modules')
- `entityId`: The entity ID to display
- `children`: The trigger element to wrap
- `width`: Fixed width for tooltip content (default: '400px')
- `showArrow`: Whether to show arrow pointing to trigger (default: false)
- `openDelay`: Delay before showing in ms (default: 200)
- `closeDelay`: Delay before hiding in ms (default: 100)

## Setup

Both providers are already configured in `src/App.tsx`:

```tsx
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <EntityViewerModalProvider>
          <AppContent />
          <Toaster />
        </EntityViewerModalProvider>
      </Router>
    </ErrorBoundary>
  )
}
```

No additional setup is required to use these features in your components.
