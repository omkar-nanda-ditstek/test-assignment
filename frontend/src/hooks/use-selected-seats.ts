import { useMemo } from 'react';
import { useSeatingStore } from '@/store/seat-store';
import type { Venue } from '@/types/venue';
import { findSeatById, getSeatPrice } from '@/utils/seat-utils';

export interface SelectedSeatDetail {
  id: string;
  section: string;
  row: number;
  col: number;
  price: number;
  priceTierName: string;
}

export function useSelectedSeats(venue: Venue) {
  const { selectedSeats } = useSeatingStore();

  const selectedSeatDetails = useMemo(() => {
    const seats = Array.from(selectedSeats)
      .map((seatId) => {
        const found = findSeatById(venue, seatId);
        if (!found) return null;

        return {
          id: seatId,
          section: found.sectionLabel,
          row: found.rowIndex,
          col: found.seat.col,
          price: getSeatPrice(venue, found.seat.priceTier),
          priceTierName:
            venue.priceTiers?.[found.seat.priceTier]?.name ||
            `Tier ${found.seat.priceTier}`,
        };
      })
      .filter((seat): seat is SelectedSeatDetail => seat !== null);
    return seats;
  }, [selectedSeats, venue]);

  const subtotal = selectedSeatDetails.reduce((sum, seat) => sum + seat.price, 0);

  return {
    selectedSeatDetails,
    subtotal,
    count: selectedSeats.size,
  };
}
