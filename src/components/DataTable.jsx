import { useMemo, useState } from "react";
import { Table, Typography, Button, DatePicker, Modal } from "antd";
import moment from "moment";
import { useAppContext } from "../contexts/AppContext";
import { v4 as uuidv4 } from "uuid";
import { DeleteFilled, EditFilled } from "@ant-design/icons";

const { Title } = Typography;

const DataTable = ({
  metricsData,
  data,
  originalData,
  handleEdit,
  handleDelete,
}) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    moment().format("YYYY-MM")
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState(null);

  const { token } = useAppContext();

  // Utility functions
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const filterDataByMonth = (data, selectedMonth) => {
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      const itemMonth = String(itemDate.getMonth() + 1).padStart(2, "0");
      const itemYear = itemDate.getFullYear();
      return `${itemYear}-${itemMonth}` === selectedMonth;
    });
  };

  const transformedData = useMemo(
    () =>
      filterDataByMonth(data, selectedMonth).map((item) => ({
        ...item,
        date: formatDate(item.date),
        key: item.id || uuidv4(), // Ensure each item has a unique key
      })),
    [data, selectedMonth]
  );

  const transformedOriginalData = useMemo(
    () =>
      originalData.map((item) => ({
        ...item,
        date: formatDate(item.date),
        key: item.id || uuidv4(),
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
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Direct Dial",
      dataIndex: "directDial",
      key: "directDial",
      sorter: (a, b) => a.directDial - b.directDial,
    },
    {
      title: "RPC VM",
      dataIndex: "rpcVm",
      key: "rpcVm",
      sorter: (a, b) => a.rpcVm - b.rpcVm,
    },
    {
      title: "Company IVR",
      dataIndex: "companyIvr",
      key: "companyIvr",
      sorter: (a, b) => a.companyIvr - b.companyIvr,
    },
    {
      title: "Not Verified",
      dataIndex: "notVerified",
      key: "notVerified",
      sorter: (a, b) => a.notVerified - b.notVerified,
    },
  ];

  // Function to assign colors to rows based on data
  const getRowClassName = (record) => {
    // Customize this logic as needed
    if (record.directDial + record.rpcVm > 50) {
      return 'bg-green-100'; // Tailwind class for light green background
    } else if (record.directDial + record.rpcVm < 50) {
      return 'bg-red-100'; // Tailwind class for light red background
    } else {
      return '';
    }
  };

  const handleExpand = (expanded, record) => {
    const newExpandedRowKeys = expanded ? [record.key] : [];
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
      ...(token
        ? [
            {
              title: "Actions",
              dataIndex: "actions",
              key: "actions",
              render: (_, record) => (
                <>
                  <Button type="link" onClick={() => handleEdit(record.key)}>
                    <EditFilled className="text-[blue]" />
                  </Button>
                  <Button
                    type="link"
                    onClick={() => {
                      setDeleteRecordId(record.key);
                      setConfirmOpen(true);
                    }}
                  >
                    <DeleteFilled className="text-[red]" />
                  </Button>
                </>
              ),
            },
          ]
        : []),
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

  const confirmDelete = () => {
    if (deleteRecordId !== null) {
      handleDelete(deleteRecordId);
    }
    setConfirmOpen(false);
    setDeleteRecordId(null);
  };

  return (
    <>
      <Title level={2}>Summary</Title>
      <Table
        columns={metricsColumns}
        dataSource={metricsData}
        pagination={false}
        rowKey="key"
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
        rowClassName={getRowClassName} // Apply custom row class
      />

      {/* Confirmation Dialog */}
      <Modal
        title="Confirm Delete"
        open={confirmOpen}
        onOk={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete this record? This action cannot be
          undone.
        </p>
      </Modal>
    </>
  );
};

export default DataTable;
