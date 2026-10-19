const supabaseUrl = 'https://ojvgbpqmtpyxhgprtejn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qdmdicHFtdHB5eGhncHJ0ZWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMzgyNTMsImV4cCI6MjA3MzgxNDI1M30.018oJQXRyaeBWoyENvfM4DOvtIkOAcHlqLIlX1ChSXI';
// Browser storage remains localStorage (supabase-js default); see the audit notes
// before moving this static app to an SSR/cookie-based session architecture.
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey, {
    auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true
    }
});

// Public Cloudflare Turnstile site key. Replace before enabling authentication.
// The matching Turnstile secret belongs only in Supabase Dashboard settings.
window.turnstileSiteKey = 'REPLACE_WITH_CLOUDFLARE_TURNSTILE_SITE_KEY';
