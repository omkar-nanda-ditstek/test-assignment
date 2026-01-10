import { useSeatingStore } from '@/store/seat-store';
import { type Venue } from '@/types/venue';
import { useSelectedSeats } from '@/hooks/use-selected-seats';

interface SelectionSummaryProps {
  venue: Venue;
}

export const SelectionSummary = ({ venue }: SelectionSummaryProps) => {
  const { clearSelection, maxSeats } = useSeatingStore();
  const { selectedSeatDetails, subtotal, count } = useSelectedSeats(venue);
  
  if (count === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">
          Selected Seats (0/{maxSeats})
        </h2>
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-600">No seats selected</p>
          <p className="text-sm text-gray-500 mt-2">Click on available seats to select them</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Selected Seats ({count}/{maxSeats})
      </h2>
      
      <div className="p-4 bg-white rounded shadow">
        <div className="space-y-2 mb-4 max-h-[400px] overflow-y-auto">
          {selectedSeatDetails.map(seat => (
            <div key={seat.id} className="flex flex-col text-sm border-b pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">{seat.section}</div>
                  <div className="text-gray-600 text-xs">Row {seat.row}, Seat {seat.col}</div>
                  <div className="text-gray-500 text-xs">{seat.priceTierName}</div>
                </div>
                <span className="font-semibold">${seat.price}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-3 flex justify-between font-bold text-lg">
          <span>Subtotal:</span>
          <span>${subtotal}</span>
        </div>
        
        <button
          onClick={clearSelection}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
          aria-label="Clear all selected seats"
        >
          Clear Selection
        </button>
      </div>
    </div>
  );
};