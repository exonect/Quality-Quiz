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

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, score } = payload[0].payload;
    return (
      <div style={{ backgroundColor: "#fff", padding: "10px", border: "1px solid #ddd" }}>
        <p>Score: {score}</p>
        <p>department: {name}</p>
      </div>
    );
  }

  return null;
};

const SimpleBarChart = ({ data }) => {

  const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  const scoreData = data.map((item, index) => ({
    letter: letters[index],
    ...item
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={scoreData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
        <XAxis dataKey="letter" tick={{ fill: "#333" }} />
        <YAxis tick={{ fill: "#333" }} />
        <Tooltip content={<CustomTooltip />} contentStyle={{ backgroundColor: "#fff", borderColor: "#ddd" }} />
        <Legend />
        <Bar dataKey="score" fill="#82ca9d" radius={[5, 5, 0, 0]} />
      </BarChart>
      </ResponsiveContainer>
  )
};

export default SimpleBarChart;
