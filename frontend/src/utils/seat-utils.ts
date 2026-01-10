import type { Venue, Section, Row, Seat } from '@/types/venue';
import { APP_CONFIG } from '@/lib/constants';

export interface FlattenedSeat {
  seat: Seat;
  section: Section;
  row: Row;
  sectionId: string;
  sectionLabel: string;
  rowIndex: number;
}

export function flattenSeats(venue: Venue): FlattenedSeat[] {
  return venue.sections.flatMap((section) =>
    section.rows.flatMap((row) =>
      row.seats.map((seat) => ({
        seat,
        section,
        row,
        sectionId: section.id,
        sectionLabel: section.label,
        rowIndex: row.index,
      }))
    )
  );
}

export function findSeatById(
  venue: Venue,
  seatId: string
): FlattenedSeat | undefined {
  for (const section of venue.sections) {
    for (const row of section.rows) {
      const seat = row.seats.find((s) => s.id === seatId);
      if (seat) {
        return {
          seat,
          section,
          row,
          sectionId: section.id,
          sectionLabel: section.label,
          rowIndex: row.index,
        };
      }
    }
  }
  return undefined;
}

export function getSeatPrice(venue: Venue, priceTier: number): number {
  return venue.priceTiers?.[priceTier]?.price || 0;
}

export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function cullSeats(
  seats: FlattenedSeat[],
  viewBox: ViewBox,
  padding: number = APP_CONFIG.VIEWPORT_PADDING
): FlattenedSeat[] {
  return seats.filter(({ seat, section }) => {
    const x = section.transform.x + seat.x * section.transform.scale;
    const y = section.transform.y + seat.y * section.transform.scale;
    return (
      x >= viewBox.x - padding &&
      x <= viewBox.x + viewBox.width + padding &&
      y >= viewBox.y - padding &&
      y <= viewBox.y + viewBox.height + padding
    );
  });
}
