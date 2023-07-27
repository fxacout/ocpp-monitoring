import React from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, LabelList } from 'recharts';

const TotalHealth = ({ health }: {health: number}) => {
  // Calculate percentage to fill the gauge based on the health status
  const percentage = health / 100;

  // Data for the gauge chart (OK area and remaining area)
  const gaugeData = [
    {
      name: 'OK',
      value: percentage,
      fill: '#82ca9d', // Green color for OK area
    },
    {
      name: 'Remaining',
      value: 1 - percentage,
      fill: '#f5f5f5', // Light gray color for remaining area
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="90%" data={gaugeData} startAngle={180} endAngle={0}>
        <RadialBar
          minAngle={15}
          clockWise
          dataKey="value"
          cornerRadius={10}
          label={{ fill: '#666', position: 'insideStart' }}
          background
        />
        <Legend iconSize={10} width={120} height={140} layout="vertical" verticalAlign="middle" wrapperStyle={{ top: '50%', right: 0, transform: 'translate(0, -50%)' }} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export default TotalHealth;