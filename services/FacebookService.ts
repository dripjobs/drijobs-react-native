import {
    FacebookFormTestLead,
    FacebookIntegration,
    FacebookLead,
    FacebookLeadForm,
    FacebookOAuthResponse,
    FacebookPage,
    FacebookUser
} from '../types/facebook';

const FACEBOOK_API_BASE = 'https://graph.facebook.com/v19.0';
const FACEBOOK_APP_ID = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || 'your-facebook-app-id';
const FACEBOOK_APP_SECRET = process.env.EXPO_PUBLIC_FACEBOOK_APP_SECRET || 'your-facebook-app-secret';
const REDIRECT_URI = process.env.EXPO_PUBLIC_FACEBOOK_REDIRECT_URI || 'https://your-app.com/facebook/callback';

export class FacebookService {
  private static instance: FacebookService;
  private accessToken: string | null = null;

  public static getInstance(): FacebookService {
    if (!FacebookService.instance) {
      FacebookService.instance = new FacebookService();
    }
    return FacebookService.instance;
  }

  /**
   * Generate Facebook OAuth URL for user authentication
   */
  public getOAuthUrl(): string {
    const scope = [
      'pages_show_list',
      'leads_retrieval', 
      'pages_read_engagement',
      'ads_management'
    ].join(',');

    const params = new URLSearchParams({
      client_id: FACEBOOK_APP_ID,
      redirect_uri: REDIRECT_URI,
      scope,
      response_type: 'code',
      state: this.generateState()
    });

    return `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  public async exchangeCodeForToken(code: string): Promise<FacebookOAuthResponse> {
    try {
      const response = await fetch(`${FACEBOOK_API_BASE}/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: FACEBOOK_APP_ID,
          client_secret: FACEBOOK_APP_SECRET,
          redirect_uri: REDIRECT_URI,
          code,
        }),
      });

      if (!response.ok) {
        throw new Error(`OAuth token exchange failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      return data;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  /**
   * Get long-lived access token (60 days)
   */
  public async getLongLivedToken(shortLivedToken: string): Promise<FacebookOAuthResponse> {
    try {
      const response = await fetch(`${FACEBOOK_API_BASE}/oauth/access_token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const url = `${FACEBOOK_API_BASE}/oauth/access_token?grant_type=fb_exchange_token&client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&fb_exchange_token=${shortLivedToken}`;
      
      const tokenResponse = await fetch(url);
      
      if (!tokenResponse.ok) {
        throw new Error(`Long-lived token request failed: ${tokenResponse.statusText}`);
      }

      const data = await tokenResponse.json();
      return data;
    } catch (error) {
      console.error('Error getting long-lived token:', error);
      throw error;
    }
  }

  /**
   * Get current user information
   */
  public async getCurrentUser(accessToken: string): Promise<FacebookUser> {
    try {
      const response = await fetch(`${FACEBOOK_API_BASE}/me?access_token=${accessToken}&fields=id,name,email`);
      
      if (!response.ok) {
        throw new Error(`Failed to get user info: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  /**
   * Get user's Facebook pages
   */
  public async getUserPages(accessToken: string): Promise<FacebookPage[]> {
    try {
      const response = await fetch(`${FACEBOOK_API_BASE}/me/accounts?access_token=${accessToken}&fields=id,name,access_token,category,tasks`);
      
      if (!response.ok) {
        throw new Error(`Failed to get user pages: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error getting user pages:', error);
      throw error;
    }
  }

  /**
   * Get lead forms for a specific page
   */
  public async getPageLeadForms(pageId: string, pageAccessToken: string): Promise<FacebookLeadForm[]> {
    try {
      const response = await fetch(`${FACEBOOK_API_BASE}/${pageId}/leadgen_forms?access_token=${pageAccessToken}&fields=id,name,status,leads_count,created_time`);
      
      if (!response.ok) {
        throw new Error(`Failed to get lead forms: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error getting page lead forms:', error);
      throw error;
    }
  }

  /**
   * Get recent leads from a specific form
   */
  public async getFormLeads(formId: string, pageAccessToken: string, limit: number = 10): Promise<FacebookLead[]> {
    try {
      const response = await fetch(`${FACEBOOK_API_BASE}/${formId}/leads?access_token=${pageAccessToken}&fields=id,created_time,field_data,ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get form leads: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error getting form leads:', error);
      throw error;
    }
  }

  /**
   * Get a specific lead by ID
   */
  public async getLeadById(leadId: string, pageAccessToken: string): Promise<FacebookLead> {
    try {
      const response = await fetch(`${FACEBOOK_API_BASE}/${leadId}?access_token=${pageAccessToken}&fields=id,created_time,field_data,ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,form_id`);
      
      if (!response.ok) {
        throw new Error(`Failed to get lead: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting lead by ID:', error);
      throw error;
    }
  }

  /**
   * Get test leads for a form (for mapping setup)
   */
  public async getFormTestLeads(formId: string, pageAccessToken: string): Promise<FacebookFormTestLead[]> {
    try {
      const response = await fetch(`${FACEBOOK_API_BASE}/${formId}/leads?access_token=${pageAccessToken}&fields=id,created_time,field_data&limit=5`);
      
      if (!response.ok) {
        throw new Error(`Failed to get test leads: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error getting test leads:', error);
      throw error;
    }
  }

  /**
   * Subscribe to webhook for real-time lead notifications
   */
  public async subscribeToWebhook(pageId: string, pageAccessToken: string, webhookUrl: string): Promise<boolean> {
    try {
      const response = await fetch(`${FACEBOOK_API_BASE}/${pageId}/subscribed_apps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          access_token: pageAccessToken,
          subscribed_fields: 'leadgen',
          callback_url: webhookUrl,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error subscribing to webhook:', error);
      return false;
    }
  }

  /**
   * Unsubscribe from webhook
   */
  public async unsubscribeFromWebhook(pageId: string, pageAccessToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${FACEBOOK_API_BASE}/${pageId}/subscribed_apps`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          access_token: pageAccessToken,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error unsubscribing from webhook:', error);
      return false;
    }
  }

  /**
   * Verify webhook challenge
   */
  public verifyWebhookChallenge(verifyToken: string, challenge: string, expectedToken: string): string | null {
    if (verifyToken === expectedToken) {
      return challenge;
    }
    return null;
  }

  /**
   * Process webhook lead data
   */
  public async processWebhookLead(leadId: string, pageAccessToken: string): Promise<FacebookLead> {
    return await this.getLeadById(leadId, pageAccessToken);
  }

  /**
   * Save integration to backend
   */
  public async saveIntegration(integration: Omit<FacebookIntegration, 'id' | 'created_at' | 'updated_at'>): Promise<FacebookIntegration> {
    try {
      const response = await fetch('/api/facebook/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(integration),
      });

      if (!response.ok) {
        throw new Error(`Failed to save integration: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving integration:', error);
      throw error;
    }
  }

  /**
   * Get user's integrations
   */
  public async getUserIntegrations(userId: string): Promise<FacebookIntegration[]> {
    try {
      const response = await fetch(`/api/facebook/integrations?user_id=${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get integrations: ${response.statusText}`);
      }

      const data = await response.json();
      return data.integrations || [];
    } catch (error) {
      console.error('Error getting user integrations:', error);
      throw error;
    }
  }

  /**
   * Update integration status
   */
  public async updateIntegrationStatus(integrationId: string, isActive: boolean): Promise<boolean> {
    try {
      const response = await fetch(`/api/facebook/integrations/${integrationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: isActive }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating integration status:', error);
      return false;
    }
  }

  /**
   * Delete integration
   */
  public async deleteIntegration(integrationId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/facebook/integrations/${integrationId}`, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting integration:', error);
      return false;
    }
  }

  /**
   * Generate random state for OAuth security
   */
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

export default FacebookService;
