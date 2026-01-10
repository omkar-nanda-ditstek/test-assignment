import { useState } from "react";
import { SeatingMap } from "./components/seating-map";
import { SelectionSummary } from "./components/selection-summary";
import { SeatPopover } from "./components/seat-popover";
import { Legend } from "./components/legend";
import { useVenue } from "./hooks/use-venue";
import { useSeatingStore } from "./store/seat-store";

export default function App() {
  const [venueType, setVenueType] = useState<'small' | 'large'>('small');
  const { data: venue, isLoading, error } = useVenue(venueType);
  const { focusedSeat, setFocusedSeat } = useSeatingStore();
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number } | null>(null);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading venue data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold mb-2">Error Loading Venue</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  if (!venue) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 bg-blue-600 text-white text-center font-bold">
        <h1 className="text-2xl">Event Seating Map</h1>
      </div>

      {/* Venue Details */}
      <div className="p-4 border-b border-gray-300 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{venue.name}</h2>
              <p className="text-gray-600">Select your seats from the seating map below.</p>
            </div>
            
            {/* Venue Switcher */}
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => setVenueType('small')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  venueType === 'small'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Small Venue
                <span className="block text-xs opacity-80">40 seats</span>
              </button>
              <button
                onClick={() => setVenueType('large')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  venueType === 'large'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Large Venue
                <span className="block text-xs opacity-80">18,126 seats</span>
              </button>
            </div>
          </div>
          
          <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
            <span>🖱️ Drag map to pan</span>
            <span>🔍 Scroll to zoom</span>
            <span>🎯 Click section filter to focus</span>
            <span>⌨️ Shortcuts: +/- zoom, 0 reset, F fit</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        <div className="flex-1 min-h-0 relative">
          <SeatingMap 
            venue={venue} 
            onSeatClick={(seatId, clientX, clientY) => {
              setFocusedSeat(seatId);
              setPopoverPosition({ x: clientX + 10, y: clientY + 10 });
            }} 
          />
          <div className="absolute bottom-16 left-4 z-10">
            <Legend />
          </div>
        </div>
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-300 p-4 bg-gray-100 overflow-y-auto">
          <SelectionSummary venue={venue} />
        </div>
      </div>

      <SeatPopover
        seatId={focusedSeat}
        venue={venue}
        position={popoverPosition}
        onClose={() => {
          setPopoverPosition(null);
          setFocusedSeat(null);
        }}
      />
    </div>
  )
}
