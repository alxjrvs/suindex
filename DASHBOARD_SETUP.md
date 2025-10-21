# Salvage Union Dashboard Setup

## ✅ Completed Setup

### 1. Supabase Project Created
- **Project Name**: SUindex
- **Project ID**: opxrguskxuogghzcnppk
- **Region**: us-east-2
- **URL**: https://opxrguskxuogghzcnppk.supabase.co
- **Status**: Active and Healthy

### 2. Database Schema
Created tables with Row Level Security (RLS) enabled:

#### Tables:
- **crawlers**: Stores crawler data with bays, cargo, tech levels
- **pilots**: Stores pilot data with abilities, equipment, class info
- **mechs**: Stores mech data with chassis, systems, modules, cargo

#### Relationships:
- All tables have `user_id` foreign key to `auth.users`
- `pilots.crawler_id` → optional assignment to crawler
- `mechs.pilot_id` → optional assignment to pilot
- `mechs.crawler_id` → optional assignment to crawler (ignored if pilot assigned)

#### Security:
- RLS policies ensure users can only access their own data
- Automatic `updated_at` triggers on all tables

### 3. Application Code
- ✅ Installed Supabase dependencies (`@supabase/supabase-js`, `@supabase/ssr`)
- ✅ Created Supabase client configuration (`src/lib/supabase.ts`)
- ✅ Created TypeScript database types (`src/types/database.ts`)
- ✅ Created Dashboard component with authentication (`src/components/Dashboard/`)
- ✅ Added `/dashboard` route to App.tsx
- ✅ Environment variables configured in `.env.local`

### 4. Dashboard Features
- Authentication check on page load
- Discord OAuth login UI
- Blank dashboard with "Create Crawler" button (placeholder)
- Sign out functionality
- User display in header

## 🔧 Required: Discord OAuth Configuration

To enable Discord login, you need to:

### Step 1: Create Discord Application
1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Name it "SUindex" (or your preferred name)
4. Go to the "OAuth2" section

### Step 2: Configure OAuth2 Settings
1. Add Redirect URLs:
   - For local development: `https://opxrguskxuogghzcnppk.supabase.co/auth/v1/callback`
   - For production: Add your production URL when deployed
2. Copy your **Client ID** and **Client Secret**

### Step 3: Update Supabase Auth Configuration
Run this command or use the Supabase dashboard:

```bash
# Using Supabase CLI or API
# Replace YOUR_CLIENT_ID and YOUR_CLIENT_SECRET with values from Discord
```

Or manually in Supabase Dashboard:
1. Go to https://supabase.com/dashboard/project/opxrguskxuogghzcnppk
2. Navigate to Authentication → Providers
3. Enable Discord
4. Enter your Discord Client ID and Client Secret
5. Save changes

### Step 4: Update Site URL (Optional)
In Supabase Dashboard → Authentication → URL Configuration:
- Set Site URL to your production domain when ready
- Currently set to `http://localhost:3000`

## 🚀 Running the Application

```bash
# Start the development server
bun run dev
```

Then navigate to `http://localhost:5173/dashboard` to test the authentication flow.

## 📝 State Object Mappings

The database schema was designed to match the existing builder state objects:

### Crawler State → Database
- Maps `CrawlerState` from `src/components/CrawlerBuilder/types.ts`
- JSONB fields: `bays`, `cargo`
- All fields preserved for future Supabase integration

### Pilot State → Database
- Maps `PilotState` from `src/components/PilotBuilder/types.ts`
- JSONB fields: `abilities`, `equipment`
- All fields preserved for future Supabase integration

### Mech State → Database
- Maps `MechState` from `src/components/MechBuilder/types.ts`
- JSONB fields: `systems`, `modules`, `cargo`
- All fields preserved for future Supabase integration

## 🔜 Next Steps (Not Implemented Yet)

1. **Connect Builders to Supabase**
   - Modify `useCrawlerState`, `usePilotState`, `useMechState` hooks
   - Add save/load functionality
   - Sync local state with database

2. **Dashboard CRUD Operations**
   - List user's crawlers, pilots, mechs
   - Create new entities
   - Edit existing entities
   - Delete entities

3. **Assignment UI**
   - Assign pilots to crawlers
   - Assign mechs to pilots/crawlers
   - Visual relationship management

4. **Data Migration**
   - Consider how to handle local state → database migration
   - Decide on optimistic updates vs. server-first approach

## 🔐 Security Notes

- ✅ RLS policies prevent unauthorized access
- ✅ Anon key is safe for client-side use
- ⚠️ Never expose service role key in client code
- ✅ Discord OAuth provides secure authentication
- ✅ All user data is isolated by `user_id`

## 📚 Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Discord OAuth2 Docs](https://discord.com/developers/docs/topics/oauth2)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

