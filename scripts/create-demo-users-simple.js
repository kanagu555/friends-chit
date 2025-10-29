// Alternative setup script that uses signup instead of admin API
// This doesn't require the service role key
// Run this with: npm run create-users

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing required environment variables");
  console.error(
    "Make sure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createDemoUsers() {
  console.log("🔧 Creating demo users using signup...");
  console.log(
    "Note: You may need to confirm emails in Supabase Auth dashboard"
  );

  try {
    // Create admin user
    console.log("\n📧 Creating admin user...");
    const { data: adminData, error: adminError } = await supabase.auth.signUp({
      email: "admin@chitfund.com",
      password: "admin123",
    });

    if (adminError) {
      if (adminError.message.includes("already registered")) {
        console.log("ℹ️  Admin user already exists: admin@chitfund.com");
      } else {
        console.error("❌ Error creating admin user:", adminError.message);
      }
    } else {
      console.log("✅ Admin user signup initiated:", adminData.user?.email);
      if (!adminData.user?.email_confirmed_at) {
        console.log("⚠️  Admin user needs email confirmation");
      }
    }

    // Create member user
    console.log("\n📧 Creating member user...");
    const { data: memberData, error: memberError } = await supabase.auth.signUp(
      {
        email: "member@chitfund.com",
        password: "member123",
      }
    );

    if (memberError) {
      if (memberError.message.includes("already registered")) {
        console.log("ℹ️  Member user already exists: member@chitfund.com");
      } else {
        console.error("❌ Error creating member user:", memberError.message);
      }
    } else {
      console.log("✅ Member user signup initiated:", memberData.user?.email);
      if (!memberData.user?.email_confirmed_at) {
        console.log("⚠️  Member user needs email confirmation");
      }
    }

    console.log("\n🎉 Demo users creation complete!");
    console.log("\n📝 Next steps:");
    console.log("1. Go to your Supabase dashboard > Authentication > Users");
    console.log(
      "2. Confirm the email addresses for both users (click the ... menu)"
    );
    console.log(
      "3. Or disable email confirmation in Auth settings for development"
    );
    console.log("\n🔑 Login credentials:");
    console.log("   Admin:  admin@chitfund.com  / admin123");
    console.log("   Member: member@chitfund.com / member123");
    console.log("\n🚀 Start your app with: npm run dev");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

createDemoUsers();
