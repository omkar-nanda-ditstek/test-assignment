import { useState } from 'react';
import type { Venue } from '@/types/venue';

interface SectionFilterProps {
  venue: Venue;
  selectedSections: string[];
  onSectionToggle: (sectionId: string) => void;
  onClearFilter: () => void;
  onSelectAll: () => void;
}

export const SectionFilter = ({
  venue,
  selectedSections,
  onSectionToggle,
  onClearFilter,
  onSelectAll,
}: SectionFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const allSelected = selectedSections.length === venue.sections.length;
  const someSelected = selectedSections.length > 0 && !allSelected;

  return (
    <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg max-w-xs">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-medium text-gray-700">
            Filter Sections
            {someSelected && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {selectedSections.length}
              </span>
            )}
          </span>
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 max-h-96 overflow-y-auto">
          <div className="p-2 border-b border-gray-200 bg-gray-50 flex gap-2">
            <button
              onClick={onSelectAll}
              className="flex-1 text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={onClearFilter}
              className="flex-1 text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Clear Filter
            </button>
          </div>
          <div className="p-2 space-y-1">
            {venue.sections.map((section) => {
              const seatCount = section.rows.reduce(
                (sum, row) => sum + row.seats.length,
                0
              );
              const isSelected = selectedSections.includes(section.id);

              return (
                <label
                  key={section.id}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors ${
                    isSelected ? 'bg-blue-50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSectionToggle(section.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {section.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {seatCount} seats
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
