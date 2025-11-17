import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database-generated.types'

const isTest = typeof process !== 'undefined' && process.env.NODE_ENV === 'test'
const supabaseUrl = isTest ? process.env.VITE_SUPABASE_URL : import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = isTest
  ? process.env.VITE_SUPABASE_ANON_KEY
  : import.meta.env.VITE_SUPABASE_ANON_KEY

// In test environments, provide default mock values if not set
// This follows Supabase testing best practices for handling missing env vars
const finalSupabaseUrl = isTest && !supabaseUrl ? 'https://test.supabase.co' : supabaseUrl
const finalSupabaseAnonKey = isTest && !supabaseAnonKey ? 'test-anon-key' : supabaseAnonKey

if (!finalSupabaseUrl || !finalSupabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(finalSupabaseUrl, finalSupabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: false,
  },
})
