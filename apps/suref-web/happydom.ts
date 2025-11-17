import { GlobalRegistrator } from '@happy-dom/global-registrator'

GlobalRegistrator.register()

// Set test environment variables for Supabase
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co'
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key'
