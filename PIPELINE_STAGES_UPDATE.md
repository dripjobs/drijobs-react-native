# Pipeline Stages Update - Complete

This document summarizes the comprehensive update of all pipeline stages across the system.

## Updated Pipeline Stages

### Leads Pipeline
**Previous stages:** new_leads, qualified_leads, hot_leads, cold_leads  
**New stages:**
- `new_leads` - New Leads
- `cold_leads` - Cold Leads
- `on_hold` - On Hold
- `warm_leads` - Warm Leads
- `not_a_fit` - Not a Fit
- `qualified` - Qualified (closed - won)

### Opportunities Pipeline
**Previous stages:** new_opportunities, prospecting, negotiating, closed_won, closed_lost  
**New stages:**
- `estimate_requested` - Estimate Requested
- `virtual_estimate` - Virtual Estimate
- `estimate_scheduled` - Estimate Scheduled
- `estimate_cancelled` - Estimate Cancelled
- `not_a_fit` - Not a Fit
- `qualified` - Qualified (closed - won)

### Proposals Pipeline
**Previous stages:** draft, sent, reviewed, accepted, rejected  
**New stages:**
- `in_draft` - In Draft
- `proposal_sent` - Proposal Sent
- `on_hold` - On Hold
- `proposal_rejected` - Proposal Rejected
- `proposal_approved` - Proposal Approved (closed - won)

### Jobs Pipeline
**Previous stages:** scheduled, in-progress, on-hold, completed, cancelled  
**New stages:**
- `pending_schedule` - Pending Schedule
- `in_progress` - In Progress
- `project_scheduled` - Project Scheduled
- `project_complete` - Project Complete (closed - won)

## Files Updated

### Core Configuration Files
1. **types/automations.ts**
   - Updated `PIPELINE_CONFIGS` with all new stages
   - This is the main source of truth for pipeline configurations

2. **types/jobs.ts**
   - Updated `JobStage` type definition to match new job stages

### Application Pages
3. **app/(tabs)/pipeline.tsx**
   - Updated pipeline UI display stages for all four pipelines
   - Updated stage descriptions

4. **app/drips.tsx**
   - Updated `pipelineConfigs` object with new stages
   - Added stage descriptions for all new stages

5. **app/lead-center.tsx**
   - Updated stages array to use new lead stages
   - Updated mock drip sequences to reference new stages
   - Updated default stage values

6. **app/timesheets.tsx**
   - Updated mock job data to use new job stage values

7. **app/(tabs)/work-orders.tsx**
   - Updated JobStage type definition
   - Updated Job interface jobStage property
   - Updated all mock data to use new job stages
   - Updated jobStages filter array
   - Updated getStageColor function

### Components
8. **components/NewSequenceModal.tsx**
   - Updated pipelineConfigs to match new stages

9. **components/NewAutomationModal.tsx**
   - Updated default stage values
   - Now uses PIPELINE_CONFIGS from types/automations.ts

10. **components/CreateLeadModal.tsx**
    - Updated leadStages array with all six new lead stages
    - Added descriptions and drip sequences for each stage

## Stage Naming Convention

All stage keys now use **snake_case** (e.g., `new_leads`, `in_progress`) for consistency throughout the codebase.

## Closed-Won Stages

The following stages represent "closed - won" states in each pipeline:
- **Leads:** `qualified`
- **Opportunities:** `qualified`
- **Proposals:** `proposal_approved`
- **Jobs:** `project_complete`

## Testing Recommendations

1. Test pipeline navigation in the main Pipeline view
2. Verify drip sequence assignments work with new stages
3. Check automation triggers reference correct stages
4. Ensure work order filtering works with new job stages
5. Verify lead creation modal displays all six lead stages
6. Test that closed-won stages are properly tracked for reporting

## Notes

- All linter checks passed after updates
- Stage descriptions have been added/updated for clarity
- Mock data has been updated to use new stage values
- Color coding has been maintained/updated for visual consistency

