export default function Input({
  label,
  error,
  className = "",
  wrapperClassName = "",
  ...props
}) {
  const base = "w-full px-4 py-2 rounded-lg outline-none transition-all";

  const styles = `
    bg-(--elevated)
    border border-(--border)
    text-(--text)
    placeholder:text-(--muted)

    focus:border-(--primary)
    focus:ring-2 focus:ring-(--primary)/30

    hover:border-(--primary)
  `;

  const errorStyles = error
    ? "border-(--danger) focus:border-(--danger) focus:ring-(--danger)/30"
    : "";

  return (
    <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
      {label && <label className="text-sm text-(--muted)">{label}</label>}

      <input
        {...props}
        className={`${base} ${styles} ${errorStyles} ${className}`}
      />

      {error && <span className="text-xs text-(--danger)">{error}</span>}
    </div>
  );
}
