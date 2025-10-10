# Facebook Lead Ads Integration

## Overview

This integration allows users to automatically import leads from their Facebook Lead Ads forms into the Drip CRM system. The integration includes OAuth authentication, form selection, field mapping, automation settings, and real-time webhook processing.

## Features Implemented

### 1. Core Integration Components

- **FacebookService** (`services/FacebookService.ts`): Handles all Facebook API interactions including OAuth flow, page management, form retrieval, and webhook management
- **Type Definitions** (`types/facebook.ts`): Comprehensive TypeScript interfaces for all Facebook-related data structures

### 2. User Interface Components

#### FacebookConnectionModal
- **Purpose**: Guides users through the Facebook OAuth connection process
- **Features**:
  - OAuth URL generation and redirection
  - Page selection from user's Facebook pages
  - Lead form selection from chosen page
  - Integration creation workflow

#### FacebookFormMappingModal
- **Purpose**: Allows users to map Facebook form fields to CRM fields
- **Features**:
  - Test lead selection for mapping reference
  - Field-by-field mapping configuration
  - Required field designation
  - Real-time preview of lead data

#### FacebookAutomationSettingsModal
- **Purpose**: Configure automation settings for imported leads
- **Features**:
  - Default user assignment
  - Default stage selection
  - Default sequence assignment
  - Automation activation/deactivation

#### FacebookIntegrationsManager
- **Purpose**: Main management interface for all Facebook integrations
- **Features**:
  - Integration listing and status management
  - Pause/activate integrations
  - Delete integrations
  - Access to mapping and settings modals

#### FacebookWebhookHandler
- **Purpose**: Monitor and manage webhook events
- **Features**:
  - Webhook configuration display
  - Event monitoring and status tracking
  - Lead processing management
  - Error handling and retry functionality

### 3. Integration Workflow

#### Step 1: Facebook Connection
1. User clicks "Connect Facebook" in settings
2. OAuth flow initiates with required permissions:
   - `pages_show_list`: Access to user's pages
   - `leads_retrieval`: Read lead form data
   - `pages_read_engagement`: Access page data
   - `ads_management`: Manage ad forms
3. User authorizes and returns with access token
4. Long-lived token (60 days) is obtained

#### Step 2: Page and Form Selection
1. User selects which Facebook page to connect
2. System retrieves available lead forms for that page
3. User selects specific form to import leads from

#### Step 3: Field Mapping
1. System loads recent test leads from the selected form
2. User maps Facebook form fields to CRM fields
3. Required fields are designated
4. Mapping configuration is saved

#### Step 4: Automation Setup
1. User selects default user for new leads
2. Default stage is chosen (typically "New Lead")
3. Default follow-up sequence is assigned
4. Automation is activated

#### Step 5: Webhook Configuration
1. Webhook URL is generated for the integration
2. Facebook webhook subscription is created
3. Real-time lead processing begins

### 4. Technical Implementation

#### OAuth Flow
```typescript
// Generate OAuth URL
const oauthUrl = facebookService.getOAuthUrl();

// Exchange code for token
const tokenResponse = await facebookService.exchangeCodeForToken(code);

// Get long-lived token
const longLivedToken = await facebookService.getLongLivedToken(shortLivedToken);
```

#### Webhook Processing
```typescript
// Subscribe to webhook
await facebookService.subscribeToWebhook(pageId, pageAccessToken, webhookUrl);

// Process incoming leads
const lead = await facebookService.processWebhookLead(leadId, pageAccessToken);
```

#### Field Mapping
```typescript
interface FieldMapping {
  facebookField: string;
  dripField: string;
  isRequired: boolean;
}
```

### 5. Data Flow

1. **Lead Submission**: User submits Facebook Lead Ad form
2. **Webhook Trigger**: Facebook sends webhook to your endpoint
3. **Lead Retrieval**: System fetches full lead data from Facebook API
4. **Field Mapping**: Facebook fields are mapped to CRM fields
5. **Lead Creation**: New lead is created in CRM with mapped data
6. **Automation Trigger**: Default user, stage, and sequence are applied
7. **Follow-up**: Lead enters the configured sequence

### 6. Security Considerations

- **Access Tokens**: Securely stored and managed
- **Webhook Verification**: Challenge token verification
- **HTTPS Required**: All webhook endpoints must use HTTPS
- **Token Refresh**: Automatic token renewal before expiration

### 7. Error Handling

- **OAuth Errors**: User-friendly error messages for connection issues
- **API Errors**: Graceful handling of Facebook API failures
- **Mapping Errors**: Validation of field mappings before saving
- **Webhook Errors**: Retry mechanism for failed lead processing

### 8. User Experience Features

- **Step-by-step Wizard**: Guided setup process
- **Real-time Preview**: See actual lead data during mapping
- **Status Indicators**: Clear visual feedback on integration status
- **Error Recovery**: Easy retry and troubleshooting options

### 9. Integration Management

- **Multiple Integrations**: Support for multiple Facebook pages/forms
- **Pause/Resume**: Toggle integrations on/off
- **Delete**: Remove integrations with confirmation
- **Settings**: Modify automation settings after setup

### 10. Monitoring and Analytics

- **Webhook Events**: Track all incoming webhook events
- **Processing Status**: Monitor lead processing success/failure
- **Error Logging**: Detailed error tracking for troubleshooting
- **Performance Metrics**: Track processing times and success rates

## Backend Requirements

### API Endpoints Needed

1. **POST /api/facebook/integrations** - Create new integration
2. **GET /api/facebook/integrations** - List user integrations
3. **PATCH /api/facebook/integrations/:id** - Update integration
4. **DELETE /api/facebook/integrations/:id** - Delete integration
5. **POST /api/facebook/webhook/:integrationId** - Webhook endpoint
6. **GET /api/facebook/webhook/:integrationId** - Webhook verification

### Database Schema

```sql
-- Facebook Integrations
CREATE TABLE facebook_integrations (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  page_id VARCHAR(255) NOT NULL,
  page_name VARCHAR(255) NOT NULL,
  form_id VARCHAR(255) NOT NULL,
  form_name VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Field Mappings
CREATE TABLE facebook_lead_mappings (
  id VARCHAR(255) PRIMARY KEY,
  integration_id VARCHAR(255) NOT NULL,
  facebook_field VARCHAR(255) NOT NULL,
  drip_field VARCHAR(255) NOT NULL,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (integration_id) REFERENCES facebook_integrations(id)
);

-- Automation Settings
CREATE TABLE facebook_automation_settings (
  id VARCHAR(255) PRIMARY KEY,
  integration_id VARCHAR(255) NOT NULL,
  default_user_id VARCHAR(255) NOT NULL,
  default_stage_id VARCHAR(255) NOT NULL,
  default_sequence_id VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (integration_id) REFERENCES facebook_integrations(id)
);
```

## Environment Variables

```env
EXPO_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
EXPO_PUBLIC_FACEBOOK_APP_SECRET=your_facebook_app_secret
EXPO_PUBLIC_FACEBOOK_REDIRECT_URI=https://your-app.com/facebook/callback
```

## Usage Instructions

1. **Setup Facebook App**: Create Facebook app in Meta for Developers
2. **Configure Permissions**: Request required permissions for lead retrieval
3. **Set Webhook URL**: Configure webhook endpoint in Facebook app settings
4. **Connect Integration**: Use the UI to connect Facebook pages and forms
5. **Map Fields**: Configure field mappings for lead data
6. **Set Automation**: Configure default user, stage, and sequence
7. **Activate**: Enable the integration to start processing leads

## Future Enhancements

- **Bulk Lead Import**: Import historical leads from Facebook
- **Advanced Filtering**: Filter leads based on form data
- **Custom Fields**: Support for custom field mapping
- **Analytics Dashboard**: Detailed integration performance metrics
- **A/B Testing**: Test different automation sequences
- **Lead Scoring**: Automatic lead scoring based on form data
