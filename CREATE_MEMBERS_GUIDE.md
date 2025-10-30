# Create Specific Member Accounts

## Members to Create

Based on your request, I'll create accounts for:

1. **Kumarasamy**
   - Email: kumarasamywhb@gmail.com
   - Role: Member

2. **Kanagaraj**
   - Email: kanagarajwhb@gmail.com  
   - Role: Member

## Method 1: Using SQL Script (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `create-specific-members.sql`
4. Click "Run" to execute

## Method 2: Using JavaScript Script

If you have the service role key configured:
```bash
node scripts/create-specific-members.js
```

## Method 3: Using Admin Dashboard UI

1. Go to your admin dashboard
2. Click on "Members" tab
3. Click "Add Member" button
4. Fill in the details for each member:
   - Name: Kumarasamy
   - Email: kumarasamywhb@gmail.com
   - Phone: (add actual phone number)
   - Role: Member
5. Repeat for Kanagaraj

## Note About Passwords

The format you provided seemed to include passwords (kumar@123, kanagu@123). Please note:

- **Member accounts** in this system are just database records for chit fund management
- **Authentication** (if needed) would be handled separately through Supabase Auth
- The passwords you mentioned would be for Supabase Auth accounts, not the member records

## After Creating Members

Once the members are created, you can:

1. **Add to Chit Fund**: Use the "Add Participants" dialog to add them to monthly auctions
2. **Manage Details**: Edit their information in the Members tab
3. **Track Participation**: See their participation across different months

## Verification

After running the script, you should see:
- ✅ Kumarasamy created successfully
- ✅ Kanagaraj created successfully  
- Both members visible in the Members tab
- Both available for selection in "Add Participants" dialogs

The members will now be available for chit fund participation!