import { useMemo, useState } from "react";
import { Table, Typography, Button, DatePicker } from "antd";
import moment from "moment";
const { Title } = Typography;

const DataTable = ({
  metricsData,
  data,
  originalData,
  handleEdit,
  handleDelete,
}) => {
  // Utility function to get current date in YYYY-MM format
  const getCurrentMonthYear = () => {
    return moment().format("YYYY-MM");
  };

  // Utility function to format date to dd-mm-yyyy
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Function to filter data based on the selected month
  const filterDataByMonth = (data, selectedMonth) => {
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      const itemMonth = String(itemDate.getMonth() + 1).padStart(2, "0");
      const itemYear = itemDate.getFullYear();
      return `${itemYear}-${itemMonth}` === selectedMonth;
    });
  };

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthYear());

  // Transform the date format in data
  const transformedData = useMemo(
    () =>
      filterDataByMonth(data, selectedMonth).map((item) => ({
        ...item,
        date: formatDate(item.date),
      })),
    [data, selectedMonth]
  );

  const transformedOriginalData = useMemo(
    () =>
      originalData.map((item) => ({
        ...item,
        date: formatDate(item.date),
      })),
    [originalData]
  );

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
      <div className="flex items-center justify-between w-full">
        <div>
          <Title level={2}>Records</Title>
        </div>
        <div>
          <DatePicker
            size="default"
            picker="month"
            allowClear={true}
            value={moment(selectedMonth, "YYYY-MM")}
            onChange={(date) => {
              if (date) {
                setSelectedMonth(date.format("YYYY-MM"));
              }
            }}
          />
        </div>
      </div>
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

export default DataTable;
