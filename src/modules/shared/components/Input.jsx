const baseClasses =
  'w-full border rounded-lg px-3.5 py-2.5 text-sm bg-white text-med-text-main placeholder-med-text-muted transition focus:outline-none focus:ring-2 focus:ring-med-primary-600 focus:border-transparent disabled:cursor-not-allowed disabled:bg-med-bg disabled:text-med-text-muted';

const stateClasses = {
  normal: 'border-med-border',
  error: 'border-red-400 bg-red-50/20',
};

function Input({ className = '', error = false, ...nativeProps }) {
  const hasError = Boolean(error || nativeProps['aria-invalid']);
  const appliedClassName =
    `${baseClasses} ${hasError ? stateClasses.error : stateClasses.normal} ${className}`.trim();

  return <input {...nativeProps} className={appliedClassName} />;
}

export default Input;
