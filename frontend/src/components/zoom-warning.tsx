interface ZoomWarningProps {
  onZoomIn: () => void;
}

export const ZoomWarning = ({ onZoomIn }: ZoomWarningProps) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white px-6 py-4 rounded-lg shadow-xl text-center max-w-md">
      <div className="text-4xl mb-2">🔍</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Zoom in to see seats</h3>
      <p className="text-sm text-gray-600 mb-4">
        Use the zoom controls or scroll wheel to zoom in and view individual seats.
      </p>
      <button
        onClick={onZoomIn}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Zoom In Now
      </button>
    </div>
  );
};
