function StatusMessage({ children, variant = 'info' }) {
  const styles = {
    info: 'border-med-primary-200 bg-med-primary-50 text-med-primary-900',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    error: 'border-red-200 bg-red-50 text-red-800',
  };

  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm ${styles[variant] || styles.info}`}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      {children}
    </div>
  );
}

export default StatusMessage;
