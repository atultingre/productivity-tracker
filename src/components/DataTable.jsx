import React, { useState } from "react";
import { Table, Typography, Button } from "antd";

const { Title } = Typography;

const DataTable = ({
  // metricsColumns,
  metricsData,
  // columns,
  data,
  originalData,
  handleEdit,
  handleDelete,
}) => {
  // State to keep track of expanded row keys
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const metricsColumns = [
    { title: "Period", dataIndex: "period", key: "period" },
    { title: "Direct Dial", dataIndex: "directDial", key: "directDial" },
    { title: "RPC VM", dataIndex: "rpcVm", key: "rpcVm" },
    { title: "Company IVR", dataIndex: "companyIvr", key: "companyIvr" },
    { title: "Not Verified", dataIndex: "notVerified", key: "notVerified" },
    { title: "Grand Total", dataIndex: "grandTotal", key: "grandTotal" },
    { title: "Percentage", dataIndex: "percentage", key: "percentage" },
    { title: "Productivity", dataIndex: "productivity", key: "productivity" },
  ];

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "File Name", dataIndex: "fileName", key: "fileName" },
    { title: "Direct Dial", dataIndex: "directDial", key: "directDial" },
    { title: "RPC VM", dataIndex: "rpcVm", key: "rpcVm" },
    { title: "Company IVR", dataIndex: "companyIvr", key: "companyIvr" },
    { title: "Not Verified", dataIndex: "notVerified", key: "notVerified" },
  ];

  // Function to handle expand/collapse of rows
  const handleExpand = (expanded, record) => {
    const keys = expanded
      ? [...expandedRowKeys, record.key]
      : expandedRowKeys.filter((key) => key !== record.key);
    setExpandedRowKeys(keys);
  };

  // Function to render expanded row content
  const expandedRowRender = (record) => {
    const detailedData = originalData.filter(
      (item) => item.date === record.date
    );
    return (
      <Table
        columns={columns.concat([
          {
            title: "Actions",
            dataIndex: "actions",
            key: "actions",
            render: (_, record, index) => (
              <>
                <Button type="link" onClick={() => handleEdit(record.id)}>
                  Edit
                </Button>
                <Button type="link" onClick={() => handleDelete(record.id)}>
                  Delete
                </Button>
              </>
            ),
          },
        ])}
        dataSource={detailedData}
        pagination={false}
        rowKey="key"
      />
    );
  };

  return (
    <>
      <Title level={2}>Summery</Title>
      <Table
        columns={metricsColumns}
        dataSource={metricsData}
        pagination={false}
        rowKey="key"
      />
      <Title level={2}>Records</Title>
      <Table
        columns={columns}
        dataSource={data}
        expandable={{
          expandedRowRender,
          expandedRowKeys,
          onExpand: handleExpand,
        }}
        pagination={false}
        rowKey="key"
      />
    </>
  );
};

export default DataTable;
