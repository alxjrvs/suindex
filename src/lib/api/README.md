# Supabase API Layer

This directory contains all Supabase database interactions organized by entity type. Each module exports typed, straightforward functions that handle database operations.

## Structure

### `auth.ts` - Authentication
- `getCurrentUser()` - Get the current authenticated user
- `getSession()` - Get the current session
- `signInWithDiscord(redirectUrl)` - Sign in with Discord OAuth
- `signOut()` - Sign out the current user
- `onAuthStateChange(callback)` - Listen for auth state changes

### `entities.ts` - Generic Entity Operations
Generic functions for any table:
- `fetchEntity<T>(table, id)` - Fetch a single entity
- `fetchUserEntities<T>(table, userId, options)` - Fetch all user entities with optional filtering/ordering
- `updateEntity<T>(table, id, updates)` - Update an entity
- `createEntity<T>(table, data)` - Create an entity
- `deleteEntity(table, id)` - Delete an entity

### `games.ts` - Games
- `fetchGame(gameId)` - Fetch a single game
- `fetchUserGames(userId)` - Fetch all games for a user
- `createGame(name, description, createdBy)` - Create a new game
- `getUserGameRole(gameId, userId)` - Get user's role in a game
- `fetchGameMembers(gameId)` - Fetch all members of a game

### `crawlers.ts` - Crawlers
- `fetchCrawler(crawlerId)` - Fetch a single crawler
- `fetchUserCrawlers(userId)` - Fetch all crawlers for a user
- `fetchGameCrawler(gameId)` - Fetch crawler for a specific game
- `createCrawler(userId)` - Create a new crawler
- `updateCrawler(crawlerId, updates)` - Update a crawler

### `pilots.ts` - Pilots
- `fetchPilot(pilotId)` - Fetch a single pilot
- `fetchUserPilots(userId)` - Fetch all pilots for a user
- `fetchCrawlerPilots(crawlerId)` - Fetch all pilots for a crawler
- `createPilot(userId)` - Create a new pilot
- `updatePilot(pilotId, updates)` - Update a pilot

### `mechs.ts` - Mechs
- `fetchMech(mechId)` - Fetch a single mech
- `fetchUserMechs(userId)` - Fetch all mechs for a user
- `fetchPilotMech(pilotId)` - Fetch mech for a specific pilot
- `fetchPilotsMechs(pilotIds)` - Fetch mechs for multiple pilots
- `createMech(userId)` - Create a new mech
- `updateMech(mechId, updates)` - Update a mech

## Usage

Import from the API layer:

```typescript
import { getCurrentUser, createGame, fetchUserCrawlers } from '@/lib/api'

// Get current user
const user = await getCurrentUser()

// Create a game
const game = await createGame('My Game', 'Description', user.id)

// Fetch crawlers
const crawlers = await fetchUserCrawlers(user.id)
```

## Benefits

1. **Centralized** - All Supabase interactions in one place
2. **Typed** - Full TypeScript support with proper return types
3. **Consistent** - Uniform error handling and patterns
4. **Testable** - Easy to mock for unit tests
5. **Maintainable** - Changes to API logic only need to be made once
6. **Reusable** - Functions can be used across hooks and components

