
const SUPABASE_URL = "sb_publishable_Bsnk56oVb6EVLg7ASkJsPg_eezLIjTB";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndseXNoZXR2eHhoaGFlYXh6dHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4Nzc3NjMsImV4cCI6MjEwNzQ1Mzc2M30.g8jQedW9scgPJ0fkvbFJ6be0REscK0G2GGVZ57bR3w4";

const client = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function findPapers(exam, year = "", subject = "") {
    let query = client
        .from("question_papers")
        .select("*")
        .eq("exam_name", exam)
        .order("exam_year", { ascending: false });

    if (year) {
        query = query.eq("exam_year", Number(year));
    }

    if (subject) {
        query = query.ilike("subject", subject);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Database error:", error.message);
        throw error;
    }

    return data;
}

async function openPaper(filePath) {
    const { data, error } = await client.storage
        .from("question-papers")
        .createSignedUrl(filePath, 300);

    if (error) {
        console.error("Storage error:", error.message);
        alert("Could not open the paper. Check its file path and Storage permissions.");
        return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
}


findPapers("JEE Main", 2025, "Physics")
    .then(papers => {
        console.log("Papers found:", papers);
    })
    .catch(error => {
        console.error("Test failed:", error);
    });
