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
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { department_name, participants } = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ddd",
        }}
      >
        <p>{participants}</p>
        <p>{department_name}</p>
      </div>
    );
  }

  return null;
};

const SimpleBarChart = ({ data }) => {
  const letters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const scoreData = data.map((item, index) => ({
    letter: letters[index],
    ...item,
  }));

  // Generate a random hex color
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const barColors = scoreData.map(() => getRandomColor());

  return (
    <ResponsiveContainer width="100%" height={330}>
      <BarChart
        data={scoreData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
        <XAxis dataKey="letter" tick={{ fill: "#333" }} />
        <YAxis tick={{ fill: "#333" }} />
        <Tooltip
          content={<CustomTooltip />}
          contentStyle={{ backgroundColor: "#fff", borderColor: "#ddd" }}
        />
        {/* <Legend /> */}
        {/* <Bar dataKey="participants" fill="#82ca9d" radius={[5, 5, 0, 0]} /> */}
        <Bar
          dataKey="participants"
          fill="#82ca9d"
          radius={[5, 5, 0, 0]}
          // label={{ position: "top" }}
        >
          {scoreData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={barColors[index % 20]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SimpleBarChart;
