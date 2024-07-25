// src/components/Charts.js
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Typography } from "antd";

const { Title } = Typography;

const Charts = ({ metricsData }) => {
  const chartData = metricsData.map((item) => ({
    period: item.period,
    "Direct Dial": item.directDial,
    "RPC VM": item.rpcVm,
    "Company IVR": item.companyIvr,
    "Not Verified": item.notVerified,
  }));
  return (
    <div style={{ marginBottom: 16 }}>
      <Title level={2}>Overview</Title>

      <ResponsiveContainer height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Direct Dial" fill="#8884d8" />
          <Bar dataKey="RPC VM" fill="#82ca9d" />
          <Bar dataKey="Company IVR" fill="#ffc658" />
          <Bar dataKey="Not Verified" fill="#ff7300" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;
