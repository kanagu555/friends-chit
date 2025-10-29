# Disable Email Confirmation for Development

## Quick Steps:

1. **Go to Supabase Dashboard**
   - Visit your project: https://supabase.com/dashboard/project/kxwusbowtdkbunvncsnb

2. **Navigate to Authentication Settings**
   - Click **Authentication** in the left sidebar
   - Click **Settings** tab

3. **Disable Email Confirmations**
   - Find **"Enable email confirmations"**
   - Toggle it **OFF**
   - Click **Save**

4. **Test Login**
   - Go back to your app
   - Try logging in with:
     - Admin: `admin@chitfund.com` / `admin123`
     - Member: `member@chitfund.com` / `member123`

## Alternative: Confirm Existing Users

If you prefer to keep email confirmation enabled:

1. **Go to Authentication > Users**
2. **Find both users** (admin@chitfund.com and member@chitfund.com)
3. **Click the ... menu** next to each user
4. **Select "Confirm email"**

Both methods will allow immediate login without the "Email not confirmed" error.