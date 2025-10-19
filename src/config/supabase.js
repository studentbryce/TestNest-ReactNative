import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

// For React Native, you'll need react-native-dotenv to use process.env
// For now, using direct values (more reliable for React Native)
const supabaseUrl = 'https://aacqihgxgtevdlgeikgh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3FpaGd4Z3RldmRsZ2Vpa2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MDkwNjYsImV4cCI6MjA3MTM4NTA2Nn0.bRqt2MUSTkYueuB_EcLTaMm_nsaTQbR0u1-zd_3ik6k'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: null, // We'll handle auth state in React Context
    autoRefreshToken: true,
    persistSession: false, // We'll manage this manually
    detectSessionInUrl: false,
  },
})