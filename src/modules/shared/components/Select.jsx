const baseClasses =
  'w-full border rounded-lg px-3.5 py-2.5 text-sm bg-white text-med-text-main transition focus:outline-none focus:ring-2 focus:ring-med-primary-600 focus:border-transparent disabled:cursor-not-allowed disabled:bg-med-bg disabled:text-med-text-muted';

function Select({ className = '', error = false, children, ...nativeProps }) {
  const hasError = Boolean(error || nativeProps['aria-invalid']);
  const stateClasses = hasError
    ? 'border-red-400 bg-red-50/20'
    : 'border-med-border';

  return (
    <select
      {...nativeProps}
      className={`${baseClasses} ${stateClasses} ${className}`.trim()}
    >
      {children}
    </select>
  );
}

export default Select;
