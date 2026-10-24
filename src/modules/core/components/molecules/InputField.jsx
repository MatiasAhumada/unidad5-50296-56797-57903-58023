import FieldLabel from '../atoms/FieldLabel';

function InputField({
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
      <FieldLabel htmlFor={id}>{label}:</FieldLabel>
      <div className="relative">
        {before}
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`h-[42px] w-full rounded-[6px] border border-[#ccd9e5] bg-[#f5f9fc] px-10 pl-[35px] text-[12px] text-[#102a43] outline-none placeholder:text-[#7d8d9e] transition focus:border-[#1689c4] focus:bg-white focus:shadow-[0_0_0_3px_rgba(27,151,208,.14)] ${error ? 'border-[#ca4b54]' : ''} ${inputClassName}`}
          {...restProps}
        />
        {after}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 block min-h-0 text-[10px] text-[#b4232d] sm:text-xs"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default InputField;
