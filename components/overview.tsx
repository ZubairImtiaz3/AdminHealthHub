'use client';
import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface Patient {
  id: string;
  user_id: null;
  first_name: string;
  last_name: string;
  created_at: string;
  phone_number: string;
  admin_id: string;
  gender: string;
  reports: [];
}

// Function to process patients data and count patients per month
function processPatientsData(patients: Patient[]) {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  const monthlyPatientCounts = Array(12).fill(0);

  patients?.forEach((patient: Patient) => {
    const createdAt = new Date(patient.created_at);
    const month = createdAt.getMonth();
    monthlyPatientCounts[month]++;
  });

  return monthNames.map((name, index) => ({
    name,
    total: monthlyPatientCounts[index]
  }));
}

// Overview component to display patient data bar chart
const Overview: React.FC<{ patients: Patient[] }> = ({ patients }) => {
  const data = processPatientsData(patients);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `+${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Overview;