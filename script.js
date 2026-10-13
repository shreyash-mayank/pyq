
const client = window.supabaseClient;

if (!client) {
    console.error(
        "Supabase client not found. Check supabase-config.js and script order."
    );
}

// Optional: retrieve papers from a question_papers database table.
async function findPapers(exam, year = "", subject = "") {
    if (!client) return [];

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
        return [];
    }

    return data || [];
}

// Open the PDF stored in Supabase Storage.
window.openPaper = async function (filePath) {
    if (!client) {
        throw new Error("Supabase is not configured.");
    }

    const { data, error } = await client.storage
        .from("question-papers")
        .createSignedUrl(filePath, 300);

    if (error) {
        console.error("Storage error:", error.message);
        alert(
            "Could not open the PDF. Check the bucket, file path, and Storage permissions."
        );
        throw error;
    }

    const pdfUrl = data.signedUrl;

    // Open the signed PDF URL.
    const newWindow = window.open(
        pdfUrl,
        "_blank",
        "noopener,noreferrer"
    );

    // Fallback if the browser blocks the new window.
    if (!newWindow) {
        window.location.href = pdfUrl;
    }
};

// Test from the browser console if needed:
// findPapers("JEE Main", 2025, "Physics");
// openPaper("pyq.pdf");
