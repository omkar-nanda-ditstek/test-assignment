import type { Venue } from '@/types/venue';
import { Seat } from './seat';
import { ZoomControls } from './zoom-controls';
import { SectionFilter } from './section-filter';
import { MiniMap } from './mini-map';
import { SectionBoundaries } from './section-boundaries';
import { ZoomWarning } from './zoom-warning';
import { StatusBar } from './status-bar';
import { useSeatingMap } from '@/hooks/use-seating-map';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

interface SeatingMapProps {
  venue: Venue;
  onSeatClick?: (seatId: string, clientX: number, clientY: number) => void;
}

export const SeatingMap = ({ venue, onSeatClick }: SeatingMapProps) => {
  const {
    svgRef,
    viewBox,
    zoomLevel,
    selectedSections,
    isPanning,
    visibleSeats,
    filteredSeats,
    culledSeats,
    showZoomWarning,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    handleWheel,
    zoomIn,
    zoomOut,
    resetView,
    fitToView,
    toggleSection,
    clearSections,
    selectAllSections,
  } = useSeatingMap({ venue });
  
  useKeyboardShortcuts({
    onZoomIn: zoomIn,
    onZoomOut: zoomOut,
    onResetView: resetView,
    onFitToView: fitToView,
  });
  
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as SVGElement;
    if (e.button === 0 && target.tagName !== 'circle') {
      e.preventDefault();
      handlePanStart(e.clientX, e.clientY);
    }
    if (e.button === 1) {
      e.preventDefault();
      handlePanStart(e.clientX, e.clientY);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    handlePanMove(e.clientX, e.clientY);
  };
  
  return (
    <div className="relative w-full h-full">
      <SectionFilter
        venue={venue}
        selectedSections={selectedSections}
        onSectionToggle={toggleSection}
        onClearFilter={clearSections}
        onSelectAll={selectAllSections}
      />
      
      <MiniMap
        venue={venue}
        viewBox={viewBox}
        visibleSectionIds={selectedSections}
      />
      
      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        className="w-full h-full border border-gray-300 bg-gray-50"
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handlePanEnd}
        onMouseLeave={handlePanEnd}
        onWheel={handleWheel}
        role="img"
        aria-label={`Seating map for ${venue.name}`}
      >
        <SectionBoundaries
          venue={venue}
          selectedSections={selectedSections}
          show={showZoomWarning}
        />
        
        {visibleSeats.map(({ seat, section, rowIndex, sectionId }) => (
          <Seat
            key={seat.id}
            seat={seat}
            sectionTransform={section.transform}
            rowIndex={rowIndex}
            sectionId={sectionId}
            onClick={onSeatClick}
          />
        ))}
      </svg>
      
      <ZoomControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetView={resetView}
        onFitToView={fitToView}
      />
      
      {showZoomWarning && <ZoomWarning onZoomIn={zoomIn} />}
      
      <StatusBar
        zoomLevel={zoomLevel}
        visibleSeats={visibleSeats.length}
        totalSeats={filteredSeats.length}
        isSampling={culledSeats.length > visibleSeats.length && visibleSeats.length > 0}
      />
    </div>
  );
};
