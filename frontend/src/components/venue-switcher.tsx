interface VenueSwitcherProps {
  currentVenue: 'small' | 'large';
  onSwitch: (venue: 'small' | 'large') => void;
}

export const VenueSwitcher = ({ currentVenue, onSwitch }: VenueSwitcherProps) => {
  const buttons = [
    { type: 'small' as const, label: 'Small Venue', count: '40 seats' },
    { type: 'large' as const, label: 'Large Venue', count: '18,126 seats' },
  ];

  return (
    <div className="flex gap-2">
      {buttons.map(({ type, label, count }) => (
        <button
          key={type}
          onClick={() => onSwitch(type)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentVenue === type
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {label}
          <span className="block text-xs opacity-80">{count}</span>
        </button>
      ))}
    </div>
  );
};
