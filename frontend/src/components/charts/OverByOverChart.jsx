import React from "react";
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-xs">
        <p className="text-gray-400 mb-1">Over {label}</p>
        <p className="text-white font-semibold">
          Runs: {payload[0]?.value}
        </p>
        {payload[1] && (
          <p className="text-red-400">Wickets: {payload[1]?.value}</p>
        )}
      </div>
    );
  }
  return null;
};

const OverByOverChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3 className="text-sm font-bold text-gray-400 mb-3">Over by Over</h3>
        <div className="flex items-center justify-center h-40 text-gray-600 text-sm">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-sm font-bold text-gray-400 mb-4">
        Over by Over Runs
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="over"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={{ stroke: "#374151" }}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={{ stroke: "#374151" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="runs" name="Runs" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.wickets > 0
                    ? "#dc2626"
                    : entry.runs >= 12
                    ? "#7c3aed"
                    : entry.runs >= 8
                    ? "#1a7a4a"
                    : "#374151"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OverByOverChart;