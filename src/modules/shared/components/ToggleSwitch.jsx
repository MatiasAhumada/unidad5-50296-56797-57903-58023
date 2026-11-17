function ToggleSwitch({
  checked = false,
  onChange,
  disabled = false,
  label = '',
  className = '',
  size = 'md',
}) {
  const isSmall = size === 'sm';
  const trackSize = isSmall ? 'h-5 w-9' : 'h-6 w-11';
  const knobSize = isSmall ? 'h-4 w-4' : 'h-5 w-5';
  const translateClass = isSmall ? 'translate-x-4' : 'translate-x-5';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      title={label}
      aria-label={label}
      className={`relative inline-flex ${trackSize} shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-med-primary-600 focus-visible:ring-offset-2 ${
        checked ? 'bg-emerald-500' : 'bg-gray-300'
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`.trim()}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block ${knobSize} transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          checked ? translateClass : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default ToggleSwitch;
