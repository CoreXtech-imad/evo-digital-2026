import { cn } from "@/lib/utils";

type BadgeVariant = "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "ghost";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary/10 text-secondary border-secondary/20",
  success: "bg-green-400/10 text-green-400 border-green-400/20",
  warning: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  danger: "bg-error/10 text-error border-error/20",
  info: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  ghost: "bg-white/5 text-on-surface-variant border-white/10",
};

export default function Badge({
  children,
  variant = "ghost",
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: "currentColor" }}
        />
      )}
      {children}
    </span>
  );
}
