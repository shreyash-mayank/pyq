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

window.openPaper = async function (filePath, targetWindow) {
    const activeClient = window.supabaseClient;
    if (!activeClient) {
        throw new Error("Supabase is not configured.");
    }

    if (!filePath) {
        throw new Error("No file path was provided for the PDF.");
    }

    const bucket = window.SUPABASE_STORAGE_BUCKET || "question-papers";
    const storage = activeClient.storage.from(bucket);
    let resolvedPath = filePath;
    let { data, error } = await storage.createSignedUrl(resolvedPath, 300);

    if (error) {
        const { data: objects, error: listError } = await storage.list("", {
            limit: 100,
        });
        const pdfs = (objects || []).filter((object) =>
            object.name.toLowerCase().endsWith(".pdf")
        );
        const exactMatch = pdfs.find((object) => object.name === filePath);
        const candidate =
            exactMatch || (pdfs.length === 1 ? pdfs[0] : null);

        if (listError || !candidate) {
            const detail = listError
                ? `${error.message} (Could not list bucket files: ${listError.message})`
                : pdfs.length > 1
                    ? `Found multiple PDFs in "${bucket}". Set SUPABASE_PAPER_PATH to the correct file path.`
                    : `File "${filePath}" was not found in bucket "${bucket}". Upload it there or set SUPABASE_PAPER_PATH to its exact name.`;
            throw new Error(detail);
        }

        resolvedPath = candidate.name;
        ({ data, error } = await storage.createSignedUrl(resolvedPath, 300));
        if (error) {
            console.error("Storage error:", error.message);
            throw error;
        }
    }

    const pdfUrl = data?.signedUrl;
    if (!pdfUrl) {
        throw new Error("Supabase did not return a signed PDF URL.");
    }

    if (targetWindow && !targetWindow.closed) {
        targetWindow.location.href = pdfUrl;
    } else {
        window.location.href = pdfUrl;
    }

    return pdfUrl;
};

// Test from the browser console if needed:
// findPapers("JEE Main", 2025, "Physics");
// window.openPaper("pyq.pdf");
