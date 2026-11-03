function Icon({
  icon: IconComponent,
  size = 20,
  strokeWidth = 2,
  label,
  ...svgProps
}) {
  if (!IconComponent) {
    return null;
  }

  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable="false"
      {...svgProps}
    />
  );
}

export default Icon;
