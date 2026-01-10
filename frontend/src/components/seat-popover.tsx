import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSeatingStore } from '@/store/seat-store';
import type { Venue } from '@/types/venue';
import { findSeatById, getSeatPrice } from '@/utils/seat-utils';

interface SeatPopoverProps {
  seatId: string | null;
  venue: Venue;
  position: { x: number; y: number } | null;
  onClose: () => void;
}

export const SeatPopover = ({ seatId, venue, position, onClose }: SeatPopoverProps) => {
  const { selectedSeats, toggleSeat } = useSeatingStore();
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!seatId || !position) return null;

  const found = findSeatById(venue, seatId);
  if (!found) return null;

  const { seat, sectionLabel, rowIndex } = found;
  const isSelected = selectedSeats.has(seatId);
  const price = getSeatPrice(venue, seat.priceTier);
  const priceTierName =
    venue.priceTiers?.[seat.priceTier]?.name || `Tier ${seat.priceTier}`;

  // Calculate popover position to stay within viewport
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 280),
    y: Math.min(position.y, window.innerHeight - 220),
  };

  const popoverContent = (
    <div
      ref={popoverRef}
      className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 w-64 animate-in fade-in zoom-in duration-200"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
    >
      {/* Arrow pointer */}
      <div
        className="absolute w-3 h-3 bg-white border-l border-t border-gray-200 transform rotate-45"
        style={{
          left: '20px',
          top: '-7px',
        }}
      />

      <div className="relative p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-sm font-semibold text-gray-900 mb-3 pr-6">Seat Details</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Section:</span>
            <span className="font-medium text-gray-900">{sectionLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Row:</span>
            <span className="font-medium text-gray-900">{rowIndex}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Seat:</span>
            <span className="font-medium text-gray-900">{seat.col}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price:</span>
            <span className="font-semibold text-gray-900">${price}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tier:</span>
            <span className="text-xs text-gray-700">{priceTierName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span
              className={`font-medium capitalize text-xs px-2 py-0.5 rounded ${
                seat.status === 'available'
                  ? 'bg-green-100 text-green-700'
                  : seat.status === 'reserved'
                  ? 'bg-orange-100 text-orange-700'
                  : seat.status === 'sold'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-purple-100 text-purple-700'
              }`}
            >
              {seat.status}
            </span>
          </div>
        </div>

        {seat.status === 'available' && (
          <button
            onClick={() => {
              toggleSeat(seatId);
            }}
            className={`mt-4 w-full py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              isSelected
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isSelected ? 'Remove from Selection' : 'Add to Selection'}
          </button>
        )}
      </div>
    </div>
  );

  return createPortal(popoverContent, document.body);
};
