import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database-generated.types'

const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test'
const supabaseUrl = isTest ? process.env.VITE_SUPABASE_URL : import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = isTest
  ? process.env.VITE_SUPABASE_ANON_KEY
  : import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: false,
  },
})
