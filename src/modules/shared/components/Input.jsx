function Input({
  label,
  error = '',
  id,
  containerClassName = '',
  inputClassName = '',
  before,
  after,
  ...restProps
}) {
  return (
    <div className={containerClassName || 'flex flex-col h-20'}>
      <label htmlFor={id}>{label}:</label>
      <div className="input-wrap">
        {before}
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${error ? 'border-red-400' : ''} ${inputClassName}`}
          {...restProps}
        />
        {after}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="field-error text-red-500 text-base sm:text-xs"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
