import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cnmxuctycveopnibcyua.supabase.co';
const supabaseAnonKey = 'sb_publishable_oJTq3rKY8X71STfyFSTKHw_XBeyQ-';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);