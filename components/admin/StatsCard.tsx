import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  change?: number; // percentage, positive = good, negative = bad
  icon: React.ReactNode;
  color?: string;
  description?: string;
  className?: string;
}

export default function StatsCard({
  label,
  value,
  change,
  icon,
  color = "#61cdff",
  description,
  className,
}: StatsCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change === 0;

  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all group",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ background: `${color}18` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>

        {change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
              isPositive && "text-green-400 bg-green-400/10",
              isNegative && "text-error bg-error/10",
              isNeutral && "text-on-surface-variant bg-white/5"
            )}
          >
            {isPositive && <ArrowUpRight className="w-3 h-3" />}
            {isNegative && <ArrowDownRight className="w-3 h-3" />}
            {isNeutral && <Minus className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <div className="text-2xl font-black font-headline mb-1" style={{ color }}>
        {value}
      </div>
      <div className="text-sm font-medium text-on-surface-variant">{label}</div>
      {description && (
        <div className="text-xs text-on-surface-variant/60 mt-0.5">{description}</div>
      )}
    </div>
  );
}
