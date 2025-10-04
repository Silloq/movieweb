export function Button({ className = "", variant = "solid", size = "md", ...props }) {
  const base = "inline-flex items-center justify-center font-semibold rounded-full transition";
  const sizes = {
    md: "h-10 px-5 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10 p-0",
  };
  const variants = {
    solid: "bg-indigo-600 hover:bg-indigo-700 text-white",
    outline: "border border-white/80 text-white hover:bg-white hover:text-zinc-900",
    ghost: "hover:bg-white/10",
    gradient: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white",
  };

  return (
    <button
      className={[base, sizes[size] ?? sizes.md, variants[variant] ?? variants.solid, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
