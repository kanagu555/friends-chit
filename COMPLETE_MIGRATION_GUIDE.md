# Complete Migration from chit_participants to monthly_participants

## Overview
This guide covers the complete migration from the old `chit_participants` system to the new `monthly_participants` system across all files and database references.

## Files Updated

### ✅ Code Files (Already Updated)
1. **hooks/use-monthly-participants.ts** - Main hook for monthly participants
2. **components/admin/chit-fund-manager.tsx** - Uses monthly participants
3. **hooks/use-chit-draws.ts** - Updated to avoid foreign key issues
4. **scripts/reset-current-month.js** - Now uses monthly_participants
5. **scripts/check-current-state.js** - Now uses monthly_participants

### 📋 Database Migration Required
Run `complete-monthly-participants-migration.sql` in Supabase SQL Editor to:
- Create monthly_participants table with proper structure
- Fix foreign key relationships
- Migrate existing data
- Update chit_draws and chit_payments tables
- Add proper indexes and constraints

### 🗂️ Files That Still Reference chit_participants (Documentation/Migration Scripts)
These files contain references but are for migration/documentation purposes:
- `fix-october-data.sql` - Migration script (references old table for data migration)
- `scripts/migrate-existing-data.js` - Migration script
- `scripts/migrate-to-monthly-participants.js` - Migration script
- `chit-fund-schema.sql` - Original schema (keep for reference)
- Various `.md` documentation files

## Key Changes Made

### 1. Database Structure
```sql
-- OLD: chit_participants (global participants)
CREATE TABLE chit_participants (
  id UUID PRIMARY KEY,
  chit_fund_id UUID,
  member_id UUID,
  status VARCHAR(20),
  total_paid INTEGER
);

-- NEW: monthly_participants (month-specific participants)
CREATE TABLE monthly_participants (
  id UUID PRIMARY KEY,
  chit_fund_id UUID,
  member_id UUID,
  month_number INTEGER,  -- NEW: Specific month
  status VARCHAR(20)
);
```

### 2. Foreign Key Updates
```sql
-- OLD: chit_draws references chit_participants
winner_participant_id UUID REFERENCES chit_participants(id)

-- NEW: chit_draws references monthly_participants
winner_participant_id UUID REFERENCES monthly_participants(id)
```

### 3. Code Logic Changes
```typescript
// OLD: Global participants for entire chit fund
.from('chit_participants')
.eq('chit_fund_id', chitFundId)

// NEW: Month-specific participants
.from('monthly_participants')
.eq('chit_fund_id', chitFundId)
.eq('month_number', selectedMonth)
```

## Migration Steps

### Step 1: Run Database Migration
Execute `complete-monthly-participants-migration.sql` in Supabase SQL Editor

### Step 2: Verify Migration
1. Check that monthly_participants table exists
2. Verify foreign key relationships are correct
3. Confirm existing data has been migrated

### Step 3: Test Application
1. Add participants to different months
2. Declare winners using Crown icon
3. Verify Monthly Draws section displays correctly
4. Test month switching functionality

## Benefits of New System

✅ **Month-Specific Participants**: Each month can have different participants
✅ **No Cross-Contamination**: November participants don't appear in October
✅ **Flexible Planning**: Plan future months independently
✅ **Proper Winner Tracking**: Winners are tracked per month
✅ **Clean Data Structure**: Clear separation between months

## Rollback Plan (If Needed)

If issues occur, the old `chit_participants` table is preserved as `chit_participants_backup`. You can:
1. Restore the old foreign key relationships
2. Update code to use chit_participants again
3. Rename backup table back to chit_participants

## Status

- ✅ Code updated to use monthly_participants
- ✅ Scripts updated to use monthly_participants  
- ✅ Build successful with no errors
- 🔄 **Action Required**: Run `complete-monthly-participants-migration.sql`

After running the migration, the system will be fully converted to the monthly_participants system!