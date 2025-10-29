// Setup script to create demo users in Supabase Auth
// This creates users in the built-in auth.users table (no custom SQL needed)
// Run this with: npm run setup-users

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need this from Supabase

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing required environment variables");
  console.error(
    "Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createDemoUsers() {
  console.log("🔧 Creating demo users in Supabase Auth...");
  console.log("(No custom database tables needed - using built-in auth.users)");

  try {
    // Create admin user
    const { data: adminData, error: adminError } =
      await supabase.auth.admin.createUser({
        email: "admin@chitfund.com",
        password: "admin123",
        email_confirm: true,
      });

    if (adminError) {
      if (adminError.message.includes("already registered")) {
        console.log("ℹ️  Admin user already exists:", "admin@chitfund.com");
      } else {
        console.error("❌ Error creating admin user:", adminError.message);
      }
    } else {
      console.log("✅ Admin user created:", adminData.user.email);
    }

    // Create member user
    const { data: memberData, error: memberError } =
      await supabase.auth.admin.createUser({
        email: "member@chitfund.com",
        password: "member123",
        email_confirm: true,
      });

    if (memberError) {
      if (memberError.message.includes("already registered")) {
        console.log("ℹ️  Member user already exists:", "member@chitfund.com");
      } else {
        console.error("❌ Error creating member user:", memberError.message);
      }
    } else {
      console.log("✅ Member user created:", memberData.user.email);
    }

    console.log("\n🎉 Demo users setup complete!");
    console.log("📝 Login credentials:");
    console.log("   Admin:  admin@chitfund.com  / admin123");
    console.log("   Member: member@chitfund.com / member123");
    console.log("\n🚀 Start your app with: npm run dev");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

createDemoUsers();
