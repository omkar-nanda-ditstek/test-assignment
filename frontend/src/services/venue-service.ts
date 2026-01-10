import type { Venue } from '@/types/venue';

export class VenueService {
  private static readonly BASE_URL = '/';

  static async fetchVenue(venueType: 'small' | 'large' = 'large'): Promise<Venue> {
    const fileName = venueType === 'small' ? 'venue-small.json' : 'venue.json';
    const response = await fetch(`${this.BASE_URL}${fileName}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch venue data: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async fetchVenueById(venueId: string): Promise<Venue> {
    // For future expansion with multiple venues
    const venue = await this.fetchVenue();
    
    if (venue.venueId !== venueId) {
      throw new Error(`Venue ${venueId} not found`);
    }
    
    return venue;
  }
}
