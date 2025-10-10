export interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category: string;
  tasks: string[];
}

export interface FacebookLeadForm {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED';
  leads_count: number;
  created_time: string;
  page_id: string;
}

export interface FacebookLead {
  id: string;
  created_time: string;
  field_data: FacebookLeadField[];
  ad_id?: string;
  ad_name?: string;
  adset_id?: string;
  adset_name?: string;
  campaign_id?: string;
  campaign_name?: string;
  form_id: string;
}

export interface FacebookLeadField {
  name: string;
  values: string[];
}

export interface FacebookIntegration {
  id: string;
  user_id: string;
  page_id: string;
  page_name: string;
  form_id: string;
  form_name: string;
  access_token: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FacebookLeadMapping {
  id: string;
  integration_id: string;
  facebook_field: string;
  drip_field: string;
  is_required: boolean;
  created_at: string;
}

export interface FacebookAutomationSettings {
  id: string;
  integration_id: string;
  default_user_id: string;
  default_stage_id: string;
  default_sequence_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FacebookWebhookData {
  object: 'page';
  entry: Array<{
    id: string;
    time: number;
    changes: Array<{
      field: 'leadgen';
      value: {
        leadgen_id: string;
        page_id: string;
        form_id: string;
        created_time: number;
      };
    }>;
  }>;
}

export interface FacebookOAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface FacebookUser {
  id: string;
  name: string;
  email?: string;
}

export interface FacebookFormTestLead {
  id: string;
  created_time: string;
  field_data: FacebookLeadField[];
  form_id: string;
}
