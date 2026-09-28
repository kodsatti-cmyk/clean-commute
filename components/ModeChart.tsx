"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ModeData {
  travel_mode: string;
  name: string;
  icon: string;
  count: string;
  percentage: string;
}

interface ModeChartProps {
  data: ModeData[];
}

const COLORS = [
  "#10b981", // green
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#8b5cf6", // purple
  "#ef4444", // red
];

export default function ModeChart({ data }: ModeChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No travel mode data yet
      </div>
    );
  }

  // Transform data for the chart
  const chartData = data.map((mode) => ({
    name: `${mode.icon} ${mode.name}`,
    count: parseInt(mode.count),
    percentage: parseFloat(mode.percentage),
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === "count") {
                return [value, "Entries"];
              }
              return [value, name];
            }}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Percentage breakdown */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((mode, index) => (
          <div key={mode.travel_mode} className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-1">{mode.icon}</div>
            <div className="text-sm font-medium text-gray-700">{mode.name}</div>
            <div className="text-lg font-bold" style={{ color: COLORS[index % COLORS.length] }}>
              {mode.percentage}%
            </div>
            <div className="text-xs text-gray-500">{mode.count} entries</div>
          </div>
        ))}
      </div>
    </div>
  );
}
