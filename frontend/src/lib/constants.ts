export const APP_CONFIG = {
  // Maximum number of seats a user can select
  MAX_SEATS: 8,

  // Viewport culling padding (in pixels)
  VIEWPORT_PADDING: 100,

  // Seat visual properties
  SEAT_RADIUS: 6,
  
  // Minimum zoom level to show seats (prevents clutter)
  MIN_ZOOM_TO_SHOW_SEATS: 1.5,
  
  // Adaptive seat rendering
  MAX_SEATS_TO_RENDER: 2000,

  // Pan and zoom settings
  ZOOM_SCALE_FACTOR: 0.1,
  MIN_ZOOM: 0.5,
  MAX_ZOOM: 5,

  // LocalStorage keys
  STORAGE_KEYS: {
    SEAT_SELECTION: 'seating-selection',
  },

  // TanStack Query settings
  QUERY_STALE_TIME: 1000 * 60 * 5, // 5 minutes
  QUERY_GC_TIME: 1000 * 60 * 10, // 10 minutes
} as const;

export const SEAT_COLORS = {
  available: '#3b82f6', // blue
  selected: '#10b981', // green
  reserved: '#f59e0b', // orange
  sold: '#ef4444', // red
  held: '#8b5cf6', // purple
} as const;
