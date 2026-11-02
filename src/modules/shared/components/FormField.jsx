function FormField({
  id,
  label,
  hint,
  error,
  required = false,
  className = '',
  labelClassName = 'text-xs font-semibold text-med-text-main',
  children,
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const messageIds = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const fieldProps = {
    id,
    'aria-describedby': messageIds,
    'aria-invalid': Boolean(error),
    required,
  };
  const field =
    typeof children === 'function' ? children(fieldProps) : children;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`.trim()}>
      <label htmlFor={id} className={labelClassName}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {field}
      {hint && (
        <p id={hintId} className="text-xs text-med-text-sub">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          className="text-xs font-medium text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
