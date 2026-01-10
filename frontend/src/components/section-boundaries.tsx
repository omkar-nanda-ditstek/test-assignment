import type { Venue } from '@/types/venue';

interface SectionBoundariesProps {
  venue: Venue;
  selectedSections: string[];
  show: boolean;
}

export const SectionBoundaries = ({ venue, selectedSections, show }: SectionBoundariesProps) => {
  if (!show) return null;
  
  const boundaries = venue.sections
    .filter((section) => selectedSections.includes(section.id))
    .map((section) => {
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
        id: section.id,
        label: section.label,
        x: minX - 10,
        y: minY - 10,
        width: maxX - minX + 20,
        height: maxY - minY + 20,
      };
    });
  
  return (
    <>
      {boundaries.map((boundary) => (
        <g key={boundary.id}>
          <rect
            x={boundary.x}
            y={boundary.y}
            width={boundary.width}
            height={boundary.height}
            fill="#3b82f6"
            fillOpacity={0.15}
            stroke="#3b82f6"
            strokeWidth={3}
            rx={5}
          />
          <text
            x={boundary.x + boundary.width / 2}
            y={boundary.y + boundary.height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#1e40af"
            fontSize={Math.max(16, boundary.width / 10)}
            fontWeight="bold"
          >
            {boundary.label}
          </text>
        </g>
      ))}
    </>
  );
};
