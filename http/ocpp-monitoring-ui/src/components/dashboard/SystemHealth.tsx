import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const HealthGraph = () => {
  // Sample data for demonstration
  const healthData = [
    { time: '10:00', nodes: 5 },
    { time: '11:00', nodes: 8 },
    { time: '12:00', nodes: 12 },
    // Add more data points as needed
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
    <BarChart width={600} height={300} data={healthData}>
      <XAxis dataKey="time" />
      <YAxis />
      <CartesianGrid stroke="#f5f5f5" />
      <Tooltip />
      <Legend />
      <Bar dataKey="nodes" fill="#8884d8" />
    </BarChart>
    </ResponsiveContainer>
  );
};

export default HealthGraph;
