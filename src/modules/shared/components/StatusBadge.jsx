export default function StatusBadge({
  isActive,
  activeText = 'Activo',
  inactiveText = 'Inactivo',
  className = '',
}) {
  const active = isActive !== false;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-gray-100 text-gray-600 border border-gray-300'
      } ${className}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          active ? 'bg-emerald-500' : 'bg-gray-400'
        }`}
      />
      <span>{active ? activeText : inactiveText}</span>
    </span>
  );
}
