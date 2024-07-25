import { Table, Typography } from "antd";
const { Title } = Typography;

const SummaryTable = ({ metricsData }) => {
  const metricsColumns = [
    { title: "Period", dataIndex: "period", key: "period" },
    {
      title: "Direct Dial",
      dataIndex: "directDial",
      key: "directDial",
    },
    { title: "RPC VM", dataIndex: "rpcVm", key: "rpcVm" },
    {
      title: "Company IVR",
      dataIndex: "companyIvr",
      key: "companyIvr",
    },
    {
      title: "Not Verified",
      dataIndex: "notVerified",
      key: "notVerified",
    },
    {
      title: "Grand Total",
      dataIndex: "grandTotal",
      key: "grandTotal",
    },
    {
      title: "Percentage",
      dataIndex: "percentage",
      key: "percentage",
    },
    {
      title: "Productivity",
      dataIndex: "productivity",
      key: "productivity",
    },
  ];

  return (
    <>
      <Title level={2}>Summary</Title>
      <Table
        columns={metricsColumns}
        dataSource={metricsData}
        pagination={false}
        rowKey="id"
        scroll={{
          x: 300,
        }}
      />
    </>
  );
};

export default SummaryTable;
