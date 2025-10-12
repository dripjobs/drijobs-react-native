# Admin Timesheets Management - Complete Implementation

## Overview
A comprehensive admin interface for managing crew timesheets with real-time tracking, approval workflows, and detailed cost analysis. Accessible through the left menu > Timesheets when logged in as an admin.

## Core Features

### 1. Live Tracking Dashboard

**Purpose**: Monitor currently clocked-in crew members in real-time

#### Summary Card
- **Total Clocked In**: Number of crew members currently working
- **Cost/Hour**: Combined hourly rate of all active crew
- **Cost Accrued**: Total labor cost accumulated across all active sessions
- Updates automatically every 5 seconds

#### List View
Each crew card displays:
- Crew member name and avatar
- Role/position
- Active status indicator (pulsing green dot)
- Current job name and address
- Elapsed time (live updating)
- Estimated cost (hourly rate × elapsed hours)
- Remote clock-out button

Features:
- Real-time timer updates
- Color-coded status badges
- Quick remote clock-out access
- Pull to refresh

#### Map View
- Google Maps integration showing crew locations
- Pin markers for each clocked-in crew member
- Marker info windows with crew details
- Auto-zoom to fit all markers
- Legend explaining pin colors
- Tap markers to see crew info, job, and elapsed time

#### Remote Clock-Out
When admin clocks out a crew member:
1. Modal displays crew info, job, elapsed time, estimated cost
2. Required reason field (with character limit)
3. Warning about immediate action
4. Confirmation creates time entry with special flags:
   - `wasRemoteClockOut: true`
   - `remoteClockOutBy: adminId`
   - `remoteClockOutReason: reason`
5. Entry automatically set to "pending" status

### 2. Time Entries Management

**Purpose**: Review, approve, reject, and manage historical time entries

#### Search & Filters

**Search Bar**:
- Search by crew member name or job name
- Real-time filtering as you type
- Clear button to reset

**Date Filters**:
- Today
- This Week
- This Month
- All Time

**Status Filters**:
- All
- Pending (requires approval)
- Approved
- Rejected

#### Time Entry Cards

Each card shows:
- Crew member name and job
- Date of entry
- Total duration
- Total cost
- Status badge (color-coded)
- Checkbox for bulk selection

**Pending Entries**:
- Green "Approve" button
- Red "Reject" button (requires reason)

**Approved Entries**:
- Green status badge
- Approval timestamp visible

**Rejected Entries**:
- Red status badge
- Rejection reason displayed in warning box

**Remote Clock-Outs**:
- Special warning badge
- Shows admin who performed action
- Displays reason for remote clock-out

#### Bulk Operations

When entries are selected:
1. **Bulk Actions Bar Appears**:
   - Shows count of selected entries
   - Shows total cost of selection
   - Select All checkbox
   - Approve All button
   - Reject All button

2. **Bulk Approve**:
   - Confirmation dialog with count
   - Single click approves all selected
   - Success message shows results

3. **Bulk Reject**:
   - Prompt for rejection reason (required)
   - Applies same reason to all
   - Success message shows results

#### Cost Calculations

The system tracks:
- **Regular Hours**: Up to 8 hours per day at base rate
- **Overtime Hours**: Beyond 8 hours at 1.5x multiplier
- **Break Time**: Subtracted from total (configurable as paid/unpaid)
- **Total Cost**: `(regular hours × rate) + (overtime hours × rate × 1.5)`

All costs displayed in formatted USD currency.

### 3. Service Methods

**TimeTrackingService Admin Methods**:

```typescript
// Get all active sessions
getAllActiveSessions(): ActiveClockSession[]

// Get live tracking data with calculations
getLiveTrackingData(): LiveTrackingData

// Remote clock out
async remoteClockOut(
  crewMemberId: string,
  adminId: string,
  reason: string
): Promise<{success: boolean; error?: string}>

// Approve time entry
async approveTimeEntry(
  entryId: string,
  adminId: string
): Promise<{success: boolean; error?: string}>

// Reject time entry
async rejectTimeEntry(
  entryId: string,
  adminId: string,
  reason: string
): Promise<{success: boolean; error?: string}>

// Bulk operations
async bulkApproveTimeEntries(
  entryIds: string[],
  adminId: string
): Promise<{success: boolean; approved: number; failed: number}>

async bulkRejectTimeEntries(
  entryIds: string[],
  adminId: string,
  reason: string
): Promise<{success: boolean; rejected: number; failed: number}>

// Get filtered entries
getTimeEntriesForAdmin(filters: AdminTimeEntryFilters): TimeEntry[]
```

### 4. Data Structures

**TimeEntry Updates**:
```typescript
export interface TimeEntry {
  // ... existing fields
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  wasRemoteClockOut?: boolean;
  remoteClockOutBy?: string;
  remoteClockOutReason?: string;
  editHistory?: TimeEntryEdit[];
}
```

**Admin Types**:
```typescript
export interface AdminTimeEntryFilters {
  startDate?: string;
  endDate?: string;
  crewMemberIds?: string[];
  jobIds?: string[];
  status?: TimeEntryStatus | 'all';
  searchQuery?: string;
}

export interface LiveTrackingData {
  activeSessions: ActiveClockSession[];
  totalClockedIn: number;
  totalCostPerHour: number;
  totalCostAccrued: number;
}

export interface TimeEntryEdit {
  editedBy: string;
  editedAt: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  reason?: string;
}
```

### 5. Utilities

**Cost Calculations** (`utils/costCalculations.ts`):
- `calculateLaborCost()`: Break down costs by regular/overtime
- `calculateAccruingCost()`: Calculate live accruing cost
- `formatCurrency()`: Format numbers as USD
- `formatDuration()`: Convert minutes to "Xh Ym" format
- `calculateTotalCostForEntries()`: Sum costs across entries

## User Flow

### Admin Reviews Time Entries

1. Admin opens Timesheets from left menu
2. Defaults to "Live Tracking" tab showing active crew
3. Can switch to "Time Entries" tab for approvals
4. Filters by date range (e.g., "This Week")
5. Sees list of pending entries
6. Can:
   - Approve individual entries with one tap
   - Reject individual entries with reason
   - Select multiple and bulk approve
   - Select multiple and bulk reject with reason
   - Search for specific crew or jobs

### Admin Monitors Live Crew

1. Admin opens Timesheets > Live Tracking tab
2. See summary of who's clocked in and costs
3. Toggle between List and Map views
4. In List view:
   - See each crew member's current job
   - Watch timer count up in real-time
   - See estimated cost accruing
5. In Map view:
   - See pins on map for each crew location
   - Tap pins to see details
6. If needed, remote clock out:
   - Tap "Remote Clock Out" button
   - Enter reason
   - Confirm action

### Remote Clock-Out Flow

1. Admin sees crew member needs to be clocked out
2. Taps "Remote Clock Out" on crew card
3. Modal shows:
   - Crew member name
   - Current job
   - Elapsed time
   - Estimated cost
4. Admin enters reason (required)
5. Confirmation warning displayed
6. Admin confirms
7. Crew member immediately clocked out
8. Time entry created with remote clock-out flags
9. Entry appears in "Time Entries" as pending
10. Crew member no longer appears in Live Tracking

## Status Workflow

### Time Entry States

1. **Active**: Currently clocked in (only in crew view)
2. **Pending**: Clocked out, awaiting admin review
3. **Approved**: Admin approved the entry
4. **Rejected**: Admin rejected with reason

### Automatic Status Setting

- Clock out (normal): `status = 'pending'`
- Clock out (remote): `status = 'pending'` + remote flags
- Admin approve: `status = 'approved'` + approval info
- Admin reject: `status = 'rejected'` + rejection info

## Visual Design

### Color Scheme

**Status Colors**:
- Pending: Amber/Yellow (`#f59e0b`, `#fef3c7`)
- Approved: Green (`#10b981`, `#d1fae5`)
- Rejected: Red (`#ef4444`, `#fee2e2`)
- Active: Emerald (`#10b981`, `#dcfce7`)

**UI Elements**:
- Primary action: Indigo (`#6366f1`)
- Secondary: Gray (`#6b7280`)
- Success: Green
- Danger: Red
- Warning: Amber

### Components

- **Cards**: White background, rounded corners, subtle shadows
- **Badges**: Rounded pills with status colors
- **Buttons**: Full-width or inline, with icons
- **Modals**: Bottom sheet style with rounded top corners
- **Maps**: Full-width with overlay controls

## Performance

### Optimizations

1. **Live Tracking**:
   - 5-second polling interval (configurable)
   - Efficient state updates
   - No unnecessary re-renders

2. **Time Entries**:
   - Client-side filtering for instant results
   - Lazy loading planned for large datasets
   - Optimized search with debouncing

3. **Maps**:
   - Markers only render for crew with location data
   - Auto-zoom calculates optimal view
   - Marker clustering planned for large teams

## Future Enhancements

### Planned Features

1. **Time Entry Editing**:
   - Admin can adjust clock-in/out times
   - Edit history tracking
   - Audit log of changes

2. **Detailed Timeline View**:
   - Expanded modal with full timeline
   - Break events visualization
   - Location mini-maps for clock-in/out

3. **Export & Reporting**:
   - Export to CSV/PDF
   - Payroll integration
   - Custom date ranges

4. **Advanced Filtering**:
   - Multi-select crew members
   - Filter by crew (team)
   - Cost range filters

5. **Notifications**:
   - Alert admin when entries need review
   - Notify crew of approval/rejection
   - Alert for unusual patterns (long shifts, etc.)

6. **Analytics**:
   - Cost trends over time
   - Crew productivity metrics
   - Job cost analysis

## Technical Notes

### Dependencies

- `react-native-maps`: Map view with crew locations
- `expo-location`: GPS tracking for clock-in/out
- `@expo/vector-icons`: Ionicons for UI
- `AsyncStorage`: Local data persistence

### Data Persistence

All time tracking data stored locally in AsyncStorage:
- `time_entries`: Array of TimeEntry objects
- `active_sessions`: Array of ActiveClockSession objects
- `clock_events`: Event log of all clock actions

### Backend Integration (Future)

When backend is ready:
- Replace AsyncStorage with API calls
- Real-time WebSocket updates for live tracking
- Server-side cost calculations
- Database-backed time entries

## Testing Considerations

### Manual Testing Checklist

**Live Tracking**:
- [ ] Summary card shows correct totals
- [ ] Live timers update every 5 seconds
- [ ] Map shows all clocked-in crew
- [ ] Remote clock-out works correctly
- [ ] Reasons are required and saved

**Time Entries**:
- [ ] Search filters entries correctly
- [ ] Date filters apply properly
- [ ] Status filters work as expected
- [ ] Individual approve/reject works
- [ ] Bulk operations succeed
- [ ] Reasons required for rejection

**Cost Calculations**:
- [ ] Regular hours calculated correctly
- [ ] Overtime kicks in after 8 hours
- [ ] Break time subtracted properly
- [ ] Totals match sum of components

## Support & Maintenance

### Common Issues

**Live tracking not updating**:
- Check if polling interval is running
- Verify TimeTrackingService has active sessions
- Ensure component didn't unmount

**Entries not appearing**:
- Check filter settings
- Verify date range includes entry date
- Ensure search query not too restrictive

**Remote clock-out fails**:
- Verify crew member has active session
- Check admin permissions
- Review console for error messages

### Debug Mode

Enable debug logging:
```typescript
// Add to TimeTrackingService
private debug = true;

// Logs will show:
// - Session state changes
// - Approval/rejection actions
// - Remote clock-out events
// - Cost calculations
```

## Conclusion

The admin timesheets system provides comprehensive crew time management with:
- ✅ Real-time live tracking (list + map views)
- ✅ Remote clock-out capability
- ✅ Flexible filtering and search
- ✅ Individual and bulk approval workflows
- ✅ Detailed cost tracking and calculations
- ✅ Complete audit trail
- ✅ Mobile-optimized interface

Admins can efficiently manage crew time, monitor costs, and maintain accurate payroll records all from their mobile device.

