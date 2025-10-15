// Service to manage appointment requests
const now = new Date();

const appointmentRequests = [
  {
    id: 1,
    name: 'Jennifer Martinez',
    source: 'Website Form',
    timeAgo: '7h ago',
    phone: '(555) 111-2222',
    email: 'jennifer@example.com',
    notes: 'Interested in kitchen renovation. Looking for a consultation to discuss design options and budget.',
    type: 'Consultation',
    priority: 'high',
    timestamp: new Date(now.getTime() - 7 * 60 * 60 * 1000), // 7 hours ago
    archived: false,
    contactId: 1
  },
  {
    id: 2,
    name: 'Robert Chen',
    source: 'Referral',
    timeAgo: '12h ago',
    phone: '(555) 456-7890',
    email: 'robert@greenenergy.co',
    company: 'Green Energy Solutions',
    notes: 'Commercial project inquiry. Need to discuss solar panel installation for office building.',
    type: 'Estimate',
    priority: 'medium',
    timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
    archived: false,
    contactId: 2
  },
  {
    id: 3,
    name: 'Amanda Foster',
    source: 'Google Ads',
    timeAgo: '2d ago',
    phone: '(555) 321-6547',
    email: 'amanda@example.com',
    notes: 'Bathroom remodel project. Wants to schedule a site visit to assess current condition.',
    type: 'Site Visit',
    priority: 'low',
    timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    archived: false,
    contactId: 3
  },
  {
    id: 4,
    name: 'Michael Brown',
    source: 'Facebook',
    timeAgo: '5d ago',
    phone: '(555) 789-0123',
    email: 'michael@example.com',
    notes: 'Looking for complete home renovation estimate.',
    type: 'Estimate',
    priority: 'medium',
    timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    archived: false,
    contactId: 4
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    source: 'Referral',
    timeAgo: '45d ago',
    phone: '(555) 234-5678',
    email: 'lisa@example.com',
    notes: 'Past request - deck construction.',
    type: 'Consultation',
    priority: 'low',
    timestamp: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    archived: true,
    contactId: 5
  }
];

class AppointmentRequestService {
  getPendingRequests() {
    return appointmentRequests;
  }

  getPendingRequestsCount() {
    return appointmentRequests.filter(req => !req.archived).length;
  }

  getRequestById(id: number) {
    return appointmentRequests.find(req => req.id === id);
  }

  // Get requests less than 24 hours old (not archived)
  getNewRequests() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return appointmentRequests.filter(req => 
      !req.archived && req.timestamp > twentyFourHoursAgo
    );
  }

  // Get requests between 24 hours and 30 days old (or custom range), not archived
  getActiveRequests(startDate?: Date | null, endDate?: Date | null) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const effectiveStartDate = startDate || thirtyDaysAgo;
    const effectiveEndDate = endDate || new Date();
    
    return appointmentRequests.filter(req => 
      !req.archived && 
      req.timestamp <= twentyFourHoursAgo &&
      req.timestamp >= effectiveStartDate &&
      req.timestamp <= effectiveEndDate
    );
  }

  // Get archived requests (default last 30 days)
  getArchivedRequests(startDate?: Date | null, endDate?: Date | null) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const effectiveStartDate = startDate || thirtyDaysAgo;
    const effectiveEndDate = endDate || new Date();
    
    return appointmentRequests.filter(req => 
      req.archived &&
      req.timestamp >= effectiveStartDate &&
      req.timestamp <= effectiveEndDate
    );
  }

  // Archive a request
  archiveRequest(id: number) {
    const request = appointmentRequests.find(req => req.id === id);
    if (request) {
      request.archived = true;
    }
    return request;
  }

  // Get counts for each tab
  getCounts() {
    return {
      new: this.getNewRequests().length,
      active: this.getActiveRequests().length,
      archived: this.getArchivedRequests().length
    };
  }
}

export const appointmentRequestService = new AppointmentRequestService();

