function FieldLabel({ htmlFor, children }) {
  return <label htmlFor={htmlFor}>{children}</label>;
}

export default FieldLabel;
