export const Legend = () => {
  const statusColors = [
    { status: 'Available', color: 'bg-blue-500', description: 'Ready to select' },
    { status: 'Selected', color: 'bg-green-500', description: 'Your selection' },
    { status: 'Reserved', color: 'bg-orange-500', description: 'Reserved by others' },
    { status: 'Held', color: 'bg-purple-500', description: 'Temporarily held' },
    { status: 'Sold', color: 'bg-red-500', description: 'Already sold' },
  ];

  return (
    <div className="p-3 bg-white border border-gray-300 rounded shadow-sm">
      <h3 className="text-sm font-semibold mb-2 text-gray-700">Legend</h3>
      <div className="space-y-1">
        {statusColors.map(({ status, color, description }) => (
          <div key={status} className="flex items-center gap-2 text-xs">
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <span className="font-medium text-gray-700">{status}</span>
            <span className="text-gray-500">- {description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
