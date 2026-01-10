interface StatusBarProps {
  zoomLevel: number;
  visibleSeats: number;
  totalSeats: number;
  isSampling: boolean;
}

export const StatusBar = ({ zoomLevel, visibleSeats, totalSeats, isSampling }: StatusBarProps) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white px-4 py-2 rounded-full shadow-lg text-sm text-gray-600">
      <span className="font-medium">Zoom: {zoomLevel.toFixed(1)}x</span>
      <span className="mx-2">•</span>
      <span>{visibleSeats} / {totalSeats} seats</span>
      {isSampling && (
        <>
          <span className="mx-2">•</span>
          <span className="text-orange-600">Sampling for performance</span>
        </>
      )}
    </div>
  );
};
