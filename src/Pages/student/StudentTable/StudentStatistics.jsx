import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#00C49F", "#FF8042"]; // Donut colors

const StudentStatistics = () => {
  // Example data
  const qbankUsage = {
    usedQuestions: 320,
    totalQuestions: 500,
  };

  const bellCurveData = Array.from({ length: 20 }, (_, i) => {
    const x = i * 10;
    return {
      x,
      y: Math.exp(-Math.pow(x - 100, 2) / (2 * Math.pow(30, 2))),
    };
  });

  const donutData = [
    { name: "Used", value: qbankUsage.usedQuestions },
    {
      name: "Remaining",
      value: qbankUsage.totalQuestions - qbankUsage.usedQuestions,
    },
  ];

  return (
    <div style={{ padding: "10px" }} className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.h2
        className="text-2xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ padding: "10px" }}
      >
        Student Statistics
      </motion.h2>

      {/* Donut Chart */}
      <div
        style={{ padding: "10px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div
          className="bg-white rounded-2xl shadow p-4 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-4">QBank Usage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
              >
                {donutData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <p className="mt-2 text-gray-600">
            {qbankUsage.usedQuestions} / {qbankUsage.totalQuestions} questions
            used
          </p>
        </motion.div>

        {/* Bell Curve */}
        <motion.div
          className="bg-white rounded-2xl shadow p-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-center">
            Score Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={bellCurveData}>
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentStatistics;
