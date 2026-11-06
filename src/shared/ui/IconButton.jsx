export function IconButton({
  label,
  tooltip,
  active = false,
  toggle = false,
  className = "",
  children,
  ...props
}) {
  return (
    <button
      type="button"
      className={`icon-button ${active ? "active" : ""} ${className}`.trim()}
      aria-label={label}
      aria-pressed={toggle ? active : undefined}
      data-tooltip={tooltip || undefined}
      {...props}
    >
      {children}
    </button>
  );
}
