# Custom Admin Account Setup

## 🎯 Your Admin Account
- **Email**: `harikrishnanwhb@gmail.com`
- **Password**: `hari@7733`
- **Role**: Admin (Full Access)

## 🚀 Quick Setup

### Step 1: Create Your Admin Account
```bash
npm run create-admin
```

### Step 2: Confirm Email in Supabase
1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/kxwusbowtdkbunvncsnb
2. Navigate to **Authentication > Users**
3. Find your email: `harikrishnanwhb@gmail.com`
4. Click the **...** menu next to your user
5. Select **"Confirm email"**

### Step 3: Test Login
1. Start the app: `npm run dev`
2. Click **"🔑 Admin Login (Hari)"** button on login page
3. Or manually enter your credentials

## ✅ Admin Features You'll Have Access To:

### Member Management
- ✅ Add new members
- ✅ Edit member information
- ✅ Delete members
- ✅ View all member details
- ✅ Manage member status (active/inactive)

### Dashboard Access
- ✅ Admin dashboard with full statistics
- ✅ Member count and overview
- ✅ System management tools

### Role Privileges
- ✅ Full CRUD operations on members table
- ✅ Access to all admin-only features
- ✅ Can also access member features

## 🔧 Alternative: Disable Email Confirmation

If you want to skip email confirmation for development:

1. Go to **Supabase Dashboard > Authentication > Settings**
2. Turn **OFF** "Enable email confirmations"
3. Click **Save**
4. Now you can login immediately after account creation

## 🎨 Login Interface

The login form now features:
- **Primary button** for your admin account (highlighted)
- **Demo accounts** for testing
- **One-click credential filling**
- **Password visibility toggle**

## 🔐 Security Notes

- Your admin email is configured in `lib/user-roles.ts`
- Role detection is automatic based on email address
- You can add more admin emails to the ADMINS array
- The system supports multiple admin accounts

Your admin account is now ready to manage the chit fund system!