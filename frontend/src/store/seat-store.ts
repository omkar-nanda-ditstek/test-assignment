import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { APP_CONFIG } from '@/lib/constants';

interface SeatingState {
  selectedSeats: Set<string>;
  focusedSeat: string | null;
  maxSeats: number;
  
  selectSeat: (seatId: string) => void;
  deselectSeat: (seatId: string) => void;
  toggleSeat: (seatId: string) => void;
  setFocusedSeat: (seatId: string | null) => void;
  clearSelection: () => void;
}

export const useSeatingStore = create<SeatingState>()(
  persist(
    (set) => ({
      selectedSeats: new Set(),
      focusedSeat: null,
      maxSeats: APP_CONFIG.MAX_SEATS,
      
      selectSeat: (seatId) =>
        set((state) => {
          if (state.selectedSeats.size >= state.maxSeats) return state;
          const newSet = new Set(state.selectedSeats);
          newSet.add(seatId);
          return { selectedSeats: newSet };
        }),
      
      deselectSeat: (seatId) =>
        set((state) => {
          const newSet = new Set(state.selectedSeats);
          newSet.delete(seatId);
          return { selectedSeats: newSet };
        }),
      
      toggleSeat: (seatId) =>
        set((state) => {
          const newSet = new Set(state.selectedSeats);
          if (newSet.has(seatId)) {
            newSet.delete(seatId);
          } else if (newSet.size < state.maxSeats) {
            newSet.add(seatId);
          }
          return { selectedSeats: newSet };
        }),
      
      setFocusedSeat: (seatId) => set({ focusedSeat: seatId }),
      clearSelection: () => set({ selectedSeats: new Set() }),
    }),
    {
      name: APP_CONFIG.STORAGE_KEYS.SEAT_SELECTION,
      // Custom serialization for Set
      partialize: (state) => ({
        selectedSeats: Array.from(state.selectedSeats),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.selectedSeats = new Set(state.selectedSeats);
        }
      },
    }
  )
);