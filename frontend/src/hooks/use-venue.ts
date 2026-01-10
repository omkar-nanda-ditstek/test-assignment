import { useQuery } from '@tanstack/react-query';
import { VenueService } from '@/services/venue-service';

export const VENUE_QUERY_KEY = ['venue'] as const;

export function useVenue(venueType: 'small' | 'large' = 'large') {
  return useQuery({
    queryKey: [...VENUE_QUERY_KEY, venueType] as const,
    queryFn: () => VenueService.fetchVenue(venueType),
    staleTime: Infinity, // Venue data rarely changes during a session
  });
}

export function useVenueById(venueId: string) {
  return useQuery({
    queryKey: [...VENUE_QUERY_KEY, venueId] as const,
    queryFn: () => VenueService.fetchVenueById(venueId),
    staleTime: Infinity,
    enabled: !!venueId,
  });
}
