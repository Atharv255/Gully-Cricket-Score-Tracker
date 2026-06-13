import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-xs">
        <p className="text-gray-400 mb-1">Over {label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="font-semibold">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RunRateGraph = ({ data = [], target }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3 className="text-sm font-bold text-gray-400 mb-3">Run Rate Graph</h3>
        <div className="flex items-center justify-center h-40 text-gray-600 text-sm">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-sm font-bold text-gray-400 mb-4">
        Run Rate Progression
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
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
          <Legend
            wrapperStyle={{ fontSize: "11px", color: "#9ca3af" }}
          />
          <Line
            type="monotone"
            dataKey="runRate"
            stroke="#1a7a4a"
            strokeWidth={2}
            dot={false}
            name="Run Rate"
          />
          {target && (
            <Line
              type="monotone"
              dataKey="requiredRate"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              name="Required Rate"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RunRateGraph;