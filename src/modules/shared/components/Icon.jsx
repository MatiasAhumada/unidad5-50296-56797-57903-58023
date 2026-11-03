import { HugeiconsIcon } from '@hugeicons/react';

function Icon({ icon, size = 20, strokeWidth = 1.75, label, ...iconProps }) {
  if (!icon) {
    return null;
  }

  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      color="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable="false"
      {...iconProps}
    />
  );
}

export default Icon;
