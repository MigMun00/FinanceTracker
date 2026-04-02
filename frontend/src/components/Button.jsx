export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none";

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  const variants = {
    primary: `
    bg-gradient-to-r from-(--primary) to-(--accent) text-white
    hover:from-(--primary-hover) hover:to-(--accent)
    hover:scale-[1.02]
    disabled:opacity-50 disabled:cursor-not-allowed
  `,

    outline: `
    border border-(--primary) text-(--text)
    hover:bg-linear-to-r hover:from-(--primary) hover:to-(--accent)
    hover:scale-[1.02]
    disabled:opacity-50 disabled:cursor-not-allowed
  `,

    ghost: `
    text-(--muted)
    hover:text-(--text)
    hover:bg-gradient-to-r hover:from-(--elevated) hover:via-(--surface) hover:to-(--elevated)
    disabled:opacity-50 disabled:cursor-not-allowed
  `,

    success: `
    bg-gradient-to-r from-(--success) to-green-600 text-white
    hover:opacity-90
    hover:scale-[1.02]
    disabled:opacity-50 disabled:cursor-not-allowed
  `,

    danger: `
    bg-(--danger) text-white
    hover:opacity-90
    hover:scale-[1.02]
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
