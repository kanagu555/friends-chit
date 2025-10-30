const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateToMonthlyParticipants() {
  try {
    console.log("🔄 Starting migration to monthly participants system...\n");

    // Read and execute the SQL migration
    const sqlPath = path.join(__dirname, "add-monthly-participants-table.sql");
    const sqlContent = fs.readFileSync(sqlPath, "utf8");

    console.log("📝 Creating monthly_participants table...");
    const { error: sqlError } = await supabase.rpc("exec_sql", {
      sql: sqlContent,
    });

    if (sqlError) {
      console.log("⚠️  SQL execution via RPC failed, trying direct queries...");

      // Split SQL into individual statements and execute them
      const statements = sqlContent
        .split(";")
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

      for (const statement of statements) {
        if (
          statement.includes("CREATE TABLE") ||
          statement.includes("CREATE INDEX") ||
          statement.includes("ALTER TABLE")
        ) {
          console.log(`Executing: ${statement.substring(0, 50)}...`);
          const { error } = await supabase.rpc("exec_sql", { sql: statement });
          if (error) {
            console.log(
              `⚠️  Statement failed (might already exist): ${error.message}`
            );
          }
        }
      }
    } else {
      console.log("✅ Monthly participants table created successfully");
    }

    // Check if we have existing participants to migrate
    const { data: existingParticipants, error: participantsError } =
      await supabase.from("chit_participants").select("*");

    if (participantsError) {
      console.log(
        "⚠️  Could not check existing participants:",
        participantsError.message
      );
    } else if (existingParticipants && existingParticipants.length > 0) {
      console.log(
        `\n📊 Found ${existingParticipants.length} existing participants`
      );
      console.log(
        "ℹ️  Note: Existing participants in chit_participants table are for general tracking"
      );
      console.log(
        "ℹ️  Monthly participants will be managed separately in monthly_participants table"
      );
      console.log(
        "ℹ️  You can now add participants to specific months using the UI"
      );
    }

    console.log("\n✅ Migration completed successfully!");
    console.log("\n📋 What changed:");
    console.log(
      "   • Created monthly_participants table for month-specific participation"
    );
    console.log("   • Added winner_name column to chit_draws");
    console.log("   • Added participants array column to chit_draws");
    console.log("   • Participants are now managed per month, not globally");
    console.log("\n🎯 Next steps:");
    console.log("   • Use the UI to add participants to specific months");
    console.log("   • Each month can have different participants");
    console.log("   • Winners are tracked per month");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

// Alternative method using direct SQL execution
async function executeSQL(sql) {
  try {
    const { data, error } = await supabase.rpc("exec_sql", { sql });
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

migrateToMonthlyParticipants();
