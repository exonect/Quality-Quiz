import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const SimpleBarChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
        <XAxis dataKey="name" tick={{ fill: "#333" }} />
        <YAxis tick={{ fill: "#333" }} />
        <Tooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#ddd" }} />
        <Legend />
        <Bar dataKey="score" fill="#82ca9d" radius={[5, 5, 0, 0]} />
      </BarChart>
      </ResponsiveContainer>
  )
};

export default SimpleBarChart;
