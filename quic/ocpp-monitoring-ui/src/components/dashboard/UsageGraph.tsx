import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const UsageGraph = () => {
  // Sample data for demonstration
  const usageData = [
    { time: '10:00', user1: 5, user2: 8, user3: 10 },
    { time: '11:00', user1: 10, user2: 12, user3: 15 },
    { time: '12:00', user1: 15, user2: 18, user3: 20 },
    // Add more data points as needed
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
    <AreaChart width={600} height={300} data={usageData}>
      <XAxis dataKey="time" />
      <YAxis />
      <CartesianGrid stroke="#f5f5f5" />
      <Tooltip />
      <Legend />
      <Area type="monotone" dataKey="user1" stackId="1" stroke="#8884d8" fill="#8884d8" />
      <Area type="monotone" dataKey="user2" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
      <Area type="monotone" dataKey="user3" stackId="1" stroke="#ffc658" fill="#ffc658" />
    </AreaChart>
    </ResponsiveContainer>
  );
};

export default UsageGraph;
