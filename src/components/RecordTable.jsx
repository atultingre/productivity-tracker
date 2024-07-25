import { useState } from "react";
import { Table, Typography, Button } from "antd";
const { Title } = Typography;

const RecordTable = ({ data, originalData, handleEdit, handleDelete }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  // Utility function to format date to dd-mm-yyyy
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Transform the date format in data
  const transformedData = data.map((item) => ({
    ...item,
    date: formatDate(item.date),
  }));

  const transformedOriginalData = originalData.map((item) => ({
    ...item,
    date: formatDate(item.date),
  }));

  const columns = [
    { title: "Date", dataIndex: "date", key: "1" },
    {
      title: "Direct Dial",
      dataIndex: "directDial",
      key: "directDial",
    },
    { title: "RPC VM", dataIndex: "rpcVm", key: "2" },
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
  ];

  const handleExpand = (expanded, record) => {
    const newExpandedRowKeys = expanded ? [record.id] : [];
    setExpandedRowKeys(newExpandedRowKeys);
  };

  const expandedRowRender = (record) => {
    const detailedData = transformedOriginalData.filter(
      (item) => item.date === record.date
    );

    const expandedColumns = [
      { title: "Date", dataIndex: "date", key: "date" },
      {
        title: "File Name",
        dataIndex: "fileName",
        key: "fileName",
      },
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
        title: "Actions",
        dataIndex: "actions",
        key: "actions",
        render: (_, record) => (
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
    ];

    return (
      <Table
        columns={expandedColumns}
        dataSource={detailedData}
        pagination={false}
        rowKey="key"
      />
    );
  };

  return (
    <>
      <Title level={2}>Records</Title>
      <Table
        columns={columns}
        dataSource={transformedData}
        expandable={{
          expandedRowRender,
          expandedRowKeys,
          onExpand: handleExpand,
        }}
        pagination={false}
        rowKey="key"
        scroll={{
          x: 240,
        }}
      />
    </>
  );
};

export default RecordTable;
