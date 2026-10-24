function FieldLabel({ htmlFor, children, className = '' }) {
  return (
    <label
      className={`mb-[7px] block text-[11px] font-semibold text-[#223b52] ${className}`}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}

export default FieldLabel;
