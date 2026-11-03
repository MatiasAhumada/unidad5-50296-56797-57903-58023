import Button from './Button';
import Icon from './Icon';

function IconButton({
  icon,
  label,
  size = 20,
  strokeWidth = 2,
  variant = 'ghost',
  className = '',
  ...buttonProps
}) {
  return (
    <Button
      {...buttonProps}
      aria-label={label}
      title={label}
      variant={variant}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-med-primary-700 ${className}`.trim()}
    >
      <Icon icon={icon} size={size} strokeWidth={strokeWidth} />
    </Button>
  );
}

export default IconButton;
