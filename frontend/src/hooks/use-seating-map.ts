import { useCallback, useMemo, useRef, useState } from 'react';
import type { Venue } from '@/types/venue';
import { flattenSeats, cullSeats, type ViewBox } from '@/utils/seat-utils';
import { APP_CONFIG } from '@/lib/constants';

interface UseSeatingMapProps {
  venue: Venue;
  initialSelectedSections?: string[];
}

export function useSeatingMap({ venue, initialSelectedSections }: UseSeatingMapProps) {
  // Viewport state
  const [viewBox, setViewBox] = useState<ViewBox>({
    x: venue.map.width * 0.3,
    y: venue.map.height * 0.3,
    width: venue.map.width * 0.4,
    height: venue.map.height * 0.4,
  });
  
  const [zoomLevel, setZoomLevel] = useState(2.5);
  
  // Section filtering
  const [selectedSections, setSelectedSections] = useState<string[]>(
    initialSelectedSections || venue.sections.slice(0, 3).map((s) => s.id)
  );
  
  // Pan state
  const [isPanning, setIsPanning] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Memoized seat data
  const allSeats = useMemo(() => flattenSeats(venue), [venue]);
  
  const filteredSeats = useMemo(() => {
    return allSeats.filter((s) => selectedSections.includes(s.sectionId));
  }, [allSeats, selectedSections]);
  
  const culledSeats = useMemo(() => {
    return cullSeats(filteredSeats, viewBox);
  }, [filteredSeats, viewBox]);
  
  const visibleSeats = useMemo(() => {
    if (zoomLevel < APP_CONFIG.MIN_ZOOM_TO_SHOW_SEATS) {
      return [];
    }
    
    if (culledSeats.length > APP_CONFIG.MAX_SEATS_TO_RENDER) {
      const step = Math.ceil(culledSeats.length / APP_CONFIG.MAX_SEATS_TO_RENDER);
      return culledSeats.filter((_, i) => i % step === 0);
    }
    
    return culledSeats;
  }, [culledSeats, zoomLevel]);
  
  // Pan handlers
  const handlePanStart = useCallback((clientX: number, clientY: number) => {
    setIsPanning(true);
    setStartPoint({ x: clientX, y: clientY });
  }, []);
  
  const handlePanMove = useCallback((clientX: number, clientY: number) => {
    if (!isPanning || !svgRef.current) return;
    
    const dx = (startPoint.x - clientX) * (viewBox.width / svgRef.current.clientWidth);
    const dy = (startPoint.y - clientY) * (viewBox.height / svgRef.current.clientHeight);
    
    setViewBox(prev => ({
      ...prev,
      x: Math.max(0, Math.min(venue.map.width - prev.width, prev.x + dx)),
      y: Math.max(0, Math.min(venue.map.height - prev.height, prev.y + dy)),
    }));
    setStartPoint({ x: clientX, y: clientY });
  }, [isPanning, startPoint, viewBox, venue.map]);
  
  const handlePanEnd = useCallback(() => {
    setIsPanning(false);
  }, []);
  
  // Zoom handlers
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    const svg = svgRef.current;
    if (!svg) return;
    
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const svgX = viewBox.x + (mouseX / rect.width) * viewBox.width;
    const svgY = viewBox.y + (mouseY / rect.height) * viewBox.height;
    
    const zoomFactor = e.deltaY > 0 ? 1.15 : 0.85;
    const newWidth = viewBox.width * zoomFactor;
    const newHeight = viewBox.height * zoomFactor;
    
    const newX = svgX - (mouseX / rect.width) * newWidth;
    const newY = svgY - (mouseY / rect.height) * newHeight;
    
    const maxWidth = venue.map.width * 2;
    const minWidth = venue.map.width * 0.15;
    
    if (newWidth > minWidth && newWidth < maxWidth) {
      setViewBox({
        x: Math.max(0, Math.min(venue.map.width - newWidth, newX)),
        y: Math.max(0, Math.min(venue.map.height - newHeight, newY)),
        width: newWidth,
        height: newHeight,
      });
      setZoomLevel(venue.map.width / newWidth);
    }
  }, [viewBox, venue.map]);
  
  const zoomIn = useCallback(() => {
    const centerX = viewBox.x + viewBox.width / 2;
    const centerY = viewBox.y + viewBox.height / 2;
    
    const newWidth = viewBox.width * 0.75;
    const newHeight = viewBox.height * 0.75;
    
    setViewBox({
      x: centerX - newWidth / 2,
      y: centerY - newHeight / 2,
      width: newWidth,
      height: newHeight,
    });
    setZoomLevel(venue.map.width / newWidth);
  }, [viewBox, venue.map.width]);
  
  const zoomOut = useCallback(() => {
    const centerX = viewBox.x + viewBox.width / 2;
    const centerY = viewBox.y + viewBox.height / 2;
    
    const newWidth = Math.min(viewBox.width * 1.33, venue.map.width * 2);
    const newHeight = Math.min(viewBox.height * 1.33, venue.map.height * 2);
    
    setViewBox({
      x: Math.max(0, centerX - newWidth / 2),
      y: Math.max(0, centerY - newHeight / 2),
      width: newWidth,
      height: newHeight,
    });
    setZoomLevel(venue.map.width / newWidth);
  }, [viewBox, venue.map]);
  
  const resetView = useCallback(() => {
    setViewBox({
      x: venue.map.width * 0.3,
      y: venue.map.height * 0.3,
      width: venue.map.width * 0.4,
      height: venue.map.height * 0.4,
    });
    setZoomLevel(2.5);
  }, [venue.map]);
  
  const fitToView = useCallback(() => {
    if (selectedSections.length === 0) {
      resetView();
      return;
    }
    
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    
    filteredSeats.forEach(({ seat, section }) => {
      const x = section.transform.x + seat.x * section.transform.scale;
      const y = section.transform.y + seat.y * section.transform.scale;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });
    
    const padding = 80;
    const newWidth = maxX - minX + padding * 2;
    const newHeight = maxY - minY + padding * 2;
    
    setViewBox({
      x: Math.max(0, minX - padding),
      y: Math.max(0, minY - padding),
      width: newWidth,
      height: newHeight,
    });
    setZoomLevel(venue.map.width / newWidth);
  }, [selectedSections, filteredSeats, venue.map.width, resetView]);
  
  // Section filtering handlers
  const toggleSection = useCallback((sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  }, []);
  
  const clearSections = useCallback(() => {
    setSelectedSections([]);
  }, []);
  
  const selectAllSections = useCallback(() => {
    setSelectedSections(venue.sections.map((s) => s.id));
  }, [venue.sections]);
  
  return {
    // Refs
    svgRef,
    
    // State
    viewBox,
    zoomLevel,
    selectedSections,
    isPanning,
    
    // Derived data
    visibleSeats,
    filteredSeats,
    culledSeats,
    showZoomWarning: zoomLevel < APP_CONFIG.MIN_ZOOM_TO_SHOW_SEATS,
    
    // Pan handlers
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    
    // Zoom handlers
    handleWheel,
    zoomIn,
    zoomOut,
    resetView,
    fitToView,
    
    // Section handlers
    toggleSection,
    clearSections,
    selectAllSections,
  };
}
