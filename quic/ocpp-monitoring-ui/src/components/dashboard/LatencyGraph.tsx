import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const LatencyGraph = () => {
  // Sample data for demonstration
  const latencyData = [
    { node: 'Node 1', latency: 100 },
    { node: 'Node 2', latency: 150 },
    { node: 'Node 3', latency: 120 },
    // Add more data points as needed
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
    <LineChart width={600} height={300} data={latencyData}>
      <XAxis dataKey="node" />
      <YAxis />
      <CartesianGrid stroke="#f5f5f5" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="latency" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
    </ResponsiveContainer>
  );
};

export default LatencyGraph;
