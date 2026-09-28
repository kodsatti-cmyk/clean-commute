interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: "blue" | "green" | "purple" | "orange";
}

export default function StatsCard({
  title,
  value,
  icon,
  color = "blue",
}: StatsCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200",
    orange: "bg-orange-50 border-orange-200",
  };

  return (
    <div
      className={`${colorClasses[color]} border-2 rounded-lg p-6 transition-transform hover:scale-105`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="text-5xl">{icon}</div>
      </div>
    </div>
  );
}
