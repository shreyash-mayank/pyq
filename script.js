
/* =========================================
   PrepSpace - Supabase Database & Storage
   ========================================= */

// The Supabase client is initialized in
// supabase-config.js, which loads before this file.

if (!window.supabaseClient) {
    console.error(
        "Supabase client not found. Check supabase-config.js."
    );
}

const client = window.supabaseClient;


/* =========================================
   Search Question Papers
   ========================================= */

async function findPapers(exam, year = "", subject = "") {
    try {
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
            throw error;
        }

        console.log("Question papers found:", data);
        return data;

    } catch (error) {
        console.error("Database error:", error.message);
        return [];
    }
}


/* =========================================
   Open a Question Paper PDF
   ========================================= */

async function openPaper(filePath) {
    try {
        const { data, error } = await client.storage
            .from("question-papers")
            .createSignedUrl(filePath, 300);

        if (error) {
            throw error;
        }

        window.open(
            data.signedUrl,
            "_blank",
            "noopener,noreferrer"
        );

    } catch (error) {
        console.error("Storage error:", error.message);

        alert(
            "Could not open the paper. Please check the file path and Storage permissions."
        );
    }
}


/* =========================================
   Temporary Connection Test
   Remove after testing if not needed.
   ========================================= */

async function testSupabaseConnection() {
    const papers = await findPapers(
        "JEE Main",
        2025,
        "Physics"
    );

    console.log("PrepSpace connection test:", papers);
}

// Run the test
testSupabaseConnection();
openPaper("pyq.pdf");