const client = window.supabaseClient;

if (!client) {
    console.error(
        "Supabase client not found. Check supabase-config.js and script order."
    );
}

async function findPapers(exam, year = "", subject = "") {
    const activeClient = window.supabaseClient;
    if (!activeClient) return [];

    let query = activeClient
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

window.openPaper = async function (filePath) {
    const activeClient = window.supabaseClient;
    if (!activeClient) {
        throw new Error("Supabase is not configured.");
    }

    if (!filePath) {
        throw new Error("No file path was provided for the PDF.");
    }

    const { data, error } = await activeClient.storage
        .from("question-papers")
        .createSignedUrl(filePath, 300);

    if (error) {
        console.error("Storage error:", error.message);
        alert(
            "Could not open the PDF. Check the bucket, file path, and Storage permissions."
        );
        throw error;
    }

    const pdfUrl = data?.signedUrl;
    if (!pdfUrl) {
        throw new Error("Supabase did not return a signed PDF URL.");
    }

    const newWindow = window.open(pdfUrl, "_blank", "noopener,noreferrer");

    if (!newWindow) {
        window.location.href = pdfUrl;
    }

    return pdfUrl;
};

// Test from the browser console if needed:
// findPapers("JEE Main", 2025, "Physics");
// window.openPaper("pyq.pdf");
