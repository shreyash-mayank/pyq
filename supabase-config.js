const SUPABASE_URL = window.SUPABASE_URL || "https://wlyshetvxxhhaeaxztzt.supabase.co";
const SUPABASE_KEY = window.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndseXNoZXR2eHhoaGFlYXh6dHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4Nzc3NjMsImV4cCI6MjEwNzQ1Mzc2M30.g8jQedW9scgPJ0fkvbFJ6be0REscK0G2GGVZ57bR3w4";

window.SUPABASE_STORAGE_BUCKET =
    window.SUPABASE_STORAGE_BUCKET || "question-papers";
window.SUPABASE_PAPER_PATH = window.SUPABASE_PAPER_PATH || "pyq.pdf";

window.supabaseClient = window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

if (!window.supabaseClient) {
    console.warn(
        "Supabase JS SDK was not loaded. Add the Supabase client script before supabase-config.js."
    );
}
