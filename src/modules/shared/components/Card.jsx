function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-med-card border border-med-border rounded-xl shadow-xs p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
