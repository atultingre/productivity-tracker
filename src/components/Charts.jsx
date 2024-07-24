import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { Typography } from "antd";

const { Title } = Typography;

const Charts = ({ chartData }) => (
  <div>
    {/* <div style={{ marginBottom: 16 }}>
      <Title level={5}>Line Chart</Title>
      <LineChart width={800} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Direct Dial" stroke="#8884d8" />
        <Line type="monotone" dataKey="RPC VM" stroke="#82ca9d" />
        <Line type="monotone" dataKey="Company IVR" stroke="#ffc658" />
        <Line type="monotone" dataKey="Not Verified" stroke="#ff7300" />
      </LineChart>
    </div>
    <div style={{ marginBottom: 16 }}>
      <Title level={5}>Area Chart</Title>
      <AreaChart width={800} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="Direct Dial" stroke="#8884d8" fillOpacity={0.3} fill="#8884d8" />
        <Area type="monotone" dataKey="RPC VM" stroke="#82ca9d" fillOpacity={0.3} fill="#82ca9d" />
        <Area type="monotone" dataKey="Company IVR" stroke="#ffc658" fillOpacity={0.3} fill="#ffc658" />
        <Area type="monotone" dataKey="Not Verified" stroke="#ff7300" fillOpacity={0.3} fill="#ff7300" />
      </AreaChart>
    </div> */}
    <div style={{ marginBottom: 16 }}>
      <Title level={5}>Overview</Title>
      <BarChart width={800} height={400} data={chartData}>
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
    </div>
  </div>
);

export default Charts;
