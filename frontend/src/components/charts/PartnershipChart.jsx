import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-xs">
        <p className="text-gray-400 mb-1">Partnership {label}</p>
        <p className="text-white font-semibold">
          Runs: {payload[0]?.value}
        </p>
      </div>
    );
  }
  return null;
};

const PartnershipChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3 className="text-sm font-bold text-gray-400 mb-3">Partnerships</h3>
        <div className="flex items-center justify-center h-40 text-gray-600 text-sm">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-sm font-bold text-gray-400 mb-4">Partnerships</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            type="number"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={{ stroke: "#374151" }}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fill: "#6b7280", fontSize: 10 }}
            axisLine={{ stroke: "#374151" }}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="runs"
            fill="#1a7a4a"
            radius={[0, 4, 4, 0]}
            name="Runs"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PartnershipChart;