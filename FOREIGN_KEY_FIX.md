# Foreign Key Relationship Fix

## Problem
After selecting a winner using the Crown icon, the Monthly Draws section stops displaying due to a foreign key relationship error:

```
"Could not find a relationship between 'chit_draws' and 'winner_participant_id' in the schema cache"
```

## Root Cause
The `chit_draws` table has a foreign key `winner_participant_id` that references the old `chit_participants` table, but we've migrated to using `monthly_participants` table. This creates a mismatch in the database relationships.

## Solution Applied

### 1. Updated Hook Query
Modified `useChitDraws` hook to avoid the problematic join:
- **Before**: Used complex join with winner relationship
- **After**: Simple select without join, winner info fetched separately

### 2. Database Schema Fix Required
Run the SQL script `fix-foreign-key-relationship.sql` in Supabase SQL Editor to:
- Drop the old foreign key constraint
- Add new foreign key pointing to `monthly_participants` table
- Verify the relationship is correctly established

## Files Changed

### hooks/use-chit-draws.ts
```typescript
// Before (causing error)
.select(`
  *,
  winner:winner_participant_id (
    id,
    member_id,
    members:member_id (name)
  )
`)

// After (fixed)
.select("*")
// Winner info fetched separately in the processing loop
```

## Required Actions

### 1. Run Database Migration
Execute `fix-foreign-key-relationship.sql` in your Supabase SQL Editor:
```sql
-- Drop old constraint
ALTER TABLE chit_draws DROP CONSTRAINT IF EXISTS chit_draws_winner_participant_id_fkey;

-- Add new constraint pointing to monthly_participants
ALTER TABLE chit_draws 
ADD CONSTRAINT chit_draws_winner_participant_id_fkey 
FOREIGN KEY (winner_participant_id) 
REFERENCES monthly_participants(id) 
ON DELETE SET NULL;
```

### 2. Test the Fix
1. Refresh your application
2. Navigate to Monthly Draws section
3. Try selecting a winner using the Crown icon
4. Verify that Monthly Draws still displays correctly

## What This Fixes

✅ **Monthly Draws Display**: Section will continue to show after winner selection
✅ **Foreign Key Integrity**: Proper relationship between draws and monthly participants
✅ **Winner Selection**: Crown icon functionality will work without breaking the display
✅ **Database Consistency**: All tables properly reference the new monthly_participants structure

## Status
- ✅ Hook updated to avoid problematic join
- ✅ Build successful with no errors
- 🔄 **Action Required**: Run the SQL migration to complete the fix

After running the SQL migration, the Monthly Draws section should display correctly even after selecting winners!