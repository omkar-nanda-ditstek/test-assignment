import type { Venue } from '@/types/venue';

interface MiniMapProps {
  venue: Venue;
  viewBox: { x: number; y: number; width: number; height: number };
  visibleSectionIds: string[];
}

export const MiniMap = ({ venue, viewBox, visibleSectionIds }: MiniMapProps) => {
  const scale = 0.15; // Scale down the minimap
  const miniWidth = venue.map.width * scale;
  const miniHeight = venue.map.height * scale;

  return (
    <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-2">
      <div className="text-xs font-medium text-gray-600 mb-1">Overview</div>
      <svg
        width={miniWidth}
        height={miniHeight}
        viewBox={`0 0 ${venue.map.width} ${venue.map.height}`}
        className="border border-gray-300 rounded bg-gray-50"
      >
        {/* Render simplified sections */}
        {venue.sections
          .filter((section) => visibleSectionIds.includes(section.id))
          .map((section) => {
            const bounds = getSectionBounds(section);
            return (
              <rect
                key={section.id}
                x={bounds.x}
                y={bounds.y}
                width={bounds.width}
                height={bounds.height}
                fill="#3b82f6"
                opacity={0.3}
                stroke="#3b82f6"
                strokeWidth={2}
              />
            );
          })}

        {/* Current viewport indicator */}
        <rect
          x={viewBox.x}
          y={viewBox.y}
          width={viewBox.width}
          height={viewBox.height}
          fill="none"
          stroke="#ef4444"
          strokeWidth={3}
          strokeDasharray="5,5"
          opacity={0.8}
        />
      </svg>
    </div>
  );
};

function getSectionBounds(section: { 
  transform: { x: number; y: number; scale: number };
  rows: Array<{ seats: Array<{ x: number; y: number }> }>;
}) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  section.rows.forEach((row) => {
    row.seats.forEach((seat) => {
      const x = section.transform.x + seat.x * section.transform.scale;
      const y = section.transform.y + seat.y * section.transform.scale;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });
  });

  return {
    x: minX - 10,
    y: minY - 10,
    width: maxX - minX + 20,
    height: maxY - minY + 20,
  };
}
