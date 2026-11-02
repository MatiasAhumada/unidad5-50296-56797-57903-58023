const baseClasses =
  'w-full border rounded-lg px-3.5 py-2.5 text-sm bg-white text-med-text-main transition focus:outline-none focus:ring-2 focus:ring-med-primary-600 focus:border-transparent disabled:cursor-not-allowed disabled:bg-med-bg disabled:text-med-text-muted';

function renderOption({ value, label, disabled = false }) {
  return (
    <option key={value} value={value} disabled={disabled}>
      {label}
    </option>
  );
}

function Select({
  className = '',
  error = false,
  options,
  children,
  ...nativeProps
}) {
  const hasError = Boolean(error || nativeProps['aria-invalid']);
  const stateClasses = hasError
    ? 'border-red-400 bg-red-50/20'
    : 'border-med-border';
  const optionElements =
    options === undefined ? children : options.map(renderOption);

  return (
    <select
      {...nativeProps}
      className={`${baseClasses} ${stateClasses} ${className}`.trim()}
    >
      {optionElements}
    </select>
  );
}

export default Select;
