// supabase-client.js

// This is your correct REST API URL
const SUPABASE_URL = 'https://wwicoxvylmseftwjflrx.supabase.co';

// Your Anon Key (this one is correct!)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3aWNveHZ5bG1zZWZ0d2pmbHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMjI5NjAsImV4cCI6MjA5Mzc5ODk2MH0.6CgZ-Js7ZH1G_xHReu7EcR2CRpJ3QXMVRq_a9nafZ3s';

// Initialize the Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);