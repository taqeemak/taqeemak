import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qxmtphatfnuggnxthoxo.supabase.co'
const supabaseKey = 'sb_publishable_IsrJoXyqfFf4tnBDZNJR6g_5lTZiJK7'

export const supabase = createClient(supabaseUrl, supabaseKey)