type StatCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  badge?: string;
  badgeColor?: string;
  accentColor?: string;
};

export default function StatCard({ label, value, icon, trend, trendUp, badge, badgeColor, accentColor }: StatCardProps) {
  return (
    <div className={`bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/10 ${accentColor ? `border-t-4 ${accentColor}` : ""}`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{label}</p>
        <div>{icon}</div>
      </div>
      <p className="font-headline text-3xl font-bold text-on-surface">{value}</p>
      {trend && (
        <p className={`text-xs mt-1 font-medium ${trendUp ? "text-success" : "text-error"}`}>
          {trend}
        </p>
      )}
      {badge && (
        <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${badgeColor || "bg-primary/10 text-primary"}`}>
          {badge}
        </span>
      )}
    </div>
  );
}
