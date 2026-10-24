function Button({
  children,
  type = 'button',
  variant = 'default',
  ...restProps
}) {
  if (!['button', 'reset', 'submit'].includes(type)) {
    console.warn('type prop not supported');
  }

  const variantStyle = {
    default: 'bg-purple-200 hover:bg-purple-300',
    secondary: 'bg-gray-100 hover:bg-gray-200',
  };

  return (
    <button
      {...restProps}
      className={`inline-flex min-h-10 items-center justify-center rounded-md border-0 px-3 py-2 text-sm font-medium shadow-sm transition ${variantStyle[variant]} ${restProps.className || ''}`}
      type={type}
    >
      {children}
    </button>
  );
}

export default Button;
