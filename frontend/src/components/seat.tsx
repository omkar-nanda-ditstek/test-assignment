import { memo, useState } from 'react';
import type { Seat as SeatType } from '@/types/venue';
import { useSeatingStore } from '@/store/seat-store';
import { APP_CONFIG, SEAT_COLORS } from '@/lib/constants';

interface SeatProps {
  seat: SeatType;
  sectionTransform: { x: number; y: number; scale: number };
  rowIndex: number;
  sectionId: string;
  onClick?: (seatId: string, clientX: number, clientY: number) => void;
}

export const Seat = memo(({ seat, sectionTransform, rowIndex, sectionId, onClick }: SeatProps) => {
  const { selectedSeats, focusedSeat, toggleSeat, setFocusedSeat } = useSeatingStore();
  const [isHovered, setIsHovered] = useState(false);
  
  const isSelected = selectedSeats.has(seat.id);
  const isFocused = focusedSeat === seat.id;
  const isInteractive = seat.status === 'available';
  
  const x = sectionTransform.x + seat.x * sectionTransform.scale;
  const y = sectionTransform.y + seat.y * sectionTransform.scale;
  
  const getFillColor = () => {
    if (isSelected) return SEAT_COLORS.selected;
    return SEAT_COLORS[seat.status];
  };
  
  const getRadius = () => {
    if (isHovered && isInteractive) return APP_CONFIG.SEAT_RADIUS * 1.3;
    if (isFocused || isSelected) return APP_CONFIG.SEAT_RADIUS * 1.2;
    return APP_CONFIG.SEAT_RADIUS;
  };
  
  const handleClick = (e: React.MouseEvent) => {
    if (isInteractive) {
      e.stopPropagation(); // Prevent pan from triggering
      toggleSeat(seat.id);
      setFocusedSeat(seat.id);
      onClick?.(seat.id, e.clientX, e.clientY);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isInteractive) {
        toggleSeat(seat.id);
        setFocusedSeat(seat.id);
        // For keyboard, use center of screen for popover
        onClick?.(seat.id, window.innerWidth / 2, window.innerHeight / 2);
      }
    }
  };
  
  return (
    <circle
      cx={x}
      cy={y}
      r={getRadius()}
      fill={getFillColor()}
      stroke={isFocused || isHovered ? '#ffffff' : 'none'}
      strokeWidth={isFocused || isHovered ? 2 : 0}
      opacity={isInteractive ? 1 : 0.4}
      style={{ 
        cursor: isInteractive ? 'pointer' : 'not-allowed',
        transition: 'all 0.15s ease',
      }}
      onClick={handleClick}
      onMouseEnter={() => isInteractive && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={isInteractive ? 0 : -1}
      role="button"
      aria-label={`Seat ${sectionId}-${rowIndex}-${seat.col}, ${seat.status}, Price tier ${seat.priceTier}`}
      aria-pressed={isSelected}
    />
  );
});

Seat.displayName = 'Seat';