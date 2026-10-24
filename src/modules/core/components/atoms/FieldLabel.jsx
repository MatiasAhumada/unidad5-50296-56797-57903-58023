function FieldLabel({ htmlFor, children }) {
  return <label className="mb-[7px] block text-[11px] font-semibold text-[#223b52]" htmlFor={htmlFor}>{children}</label>;
}

export default FieldLabel;
