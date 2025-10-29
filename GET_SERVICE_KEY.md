# How to Get Your Supabase Service Role Key

## Method 1: Get Service Role Key (Recommended)

1. **Go to your Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Select your project

2. **Navigate to API Settings**
   - Click on **Settings** (gear icon) in the left sidebar
   - Click on **API**

3. **Copy the Service Role Key**
   - Scroll down to find the **service_role** key
   - Click the **Copy** button next to it
   - ⚠️ **Important**: This is a secret key - keep it secure!

4. **Add to .env.local**
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

5. **Run the Setup Script**
   ```bash
   npm run setup-users
   ```

## Method 2: Use Simple Signup (Alternative)

If you don't want to use the service role key, use the simpler method:

1. **Run the simple script**
   ```bash
   npm run create-users
   ```

2. **Confirm emails in Supabase Dashboard**
   - Go to **Authentication > Users**
   - Find the two new users
   - Click the **...** menu next to each user
   - Select **Confirm email**

3. **Or disable email confirmation (for development)**
   - Go to **Authentication > Settings**
   - Turn off **Enable email confirmations**

## Which Method to Choose?

- **Method 1**: Faster, users are immediately active
- **Method 2**: No service key needed, but requires manual email confirmation

Both methods will create the same demo users with the same login credentials:
- Admin: `admin@chitfund.com` / `admin123`
- Member: `member@chitfund.com` / `member123`