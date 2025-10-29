# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (takes ~2 minutes)

### 2. Set Environment Variables
1. Copy `.env.local.example` to `.env.local`
2. In your Supabase dashboard, go to **Settings > API**
3. Copy these values to your `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

### 3. Setup Database (Members Table Only)
1. In Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase-schema.sql`
3. Click **Run** to create the members table

### 4. Create Demo Users
```bash
npm run setup-users
```

### 5. Start the App
```bash
npm run dev
```

## 🎯 Test Login

**Admin Access:**
- Email: `admin@chitfund.com`
- Password: `admin123`
- Can manage all members

**Member Access:**
- Email: `member@chitfund.com`  
- Password: `member123`
- Can view member dashboard

## ✅ What's Included

- **Authentication**: Login/logout with Supabase Auth
- **Role-based Access**: Admin vs Member permissions
- **Member CRUD**: Full member management (admin only)
- **Responsive UI**: Works on desktop and mobile
- **Toast Notifications**: User feedback for all actions

## 🔧 No Additional Setup Needed

- ✅ Authentication works out of the box with Supabase Auth
- ✅ No custom user tables needed
- ✅ Role detection based on email address
- ✅ Session management handled automatically

The app is ready to use immediately after these 5 steps!