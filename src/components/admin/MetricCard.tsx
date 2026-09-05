import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  isProfit?: boolean;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  isProfit,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#D4AF37]/30 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
            {title}
          </span>
          <div className="font-serif text-2xl font-bold text-[#3B0610] tracking-tight">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>

        <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#D4AF37]/40 flex items-center justify-center text-[#7A1228] shrink-0">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className={isProfit ? 'text-emerald-700 font-semibold' : 'text-gray-600'}>
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}
