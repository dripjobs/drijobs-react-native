// Service to manage appointment requests
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
    priority: 'high'
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
    priority: 'medium'
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
    priority: 'low'
  }
];

class AppointmentRequestService {
  getPendingRequests() {
    return appointmentRequests;
  }

  getPendingRequestsCount() {
    return appointmentRequests.length;
  }

  getRequestById(id: number) {
    return appointmentRequests.find(req => req.id === id);
  }
}

export const appointmentRequestService = new AppointmentRequestService();

