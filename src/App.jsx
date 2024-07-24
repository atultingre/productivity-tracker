import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Form } from "antd";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import Charts from "./components/Charts";
import DataTable from "./components/DataTable";
import ModalForm from "./components/ModalForm";

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [userCredentials, setUserCredentials] = useState({
    employeeId: "",
    password: "",
  });

  const { control, handleSubmit, reset, setValue, getValues } = useForm();

  useEffect(() => {
    if (isLoggedIn) {
      // Fetch user-specific data from localStorage (or Firebase in the future)
      const storedData =
        JSON.parse(localStorage.getItem(`hrData_${currentUser}`)) || [];
      setData(storedData);
    }
  }, [isLoggedIn, currentUser]);

  const handleLogin = () => {
    // Dummy login logic for now
    if (userCredentials.employeeId && userCredentials.password) {
      setCurrentUser(userCredentials.employeeId);
      setIsLoggedIn(true);
      setShowLogin(false);
    } else {
      alert("Please enter valid credentials");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLogin(true);
    setCurrentUser(null);
  };

  const handleChangeCredentials = (e) => {
    const { name, value } = e.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    const formData = getValues();
    const formattedData = {
      ...formData,
      date: formData.date || "",
      id: editingId || uuidv4(), // Assign UUID if new record
    };

    let newData = [...data];
    if (editingId) {
      newData = newData.map((item) =>
        item.id === editingId ? formattedData : item
      );
    } else {
      newData.push(formattedData);
    }
    setData(newData);
    localStorage.setItem(`hrData_${currentUser}`, JSON.stringify(newData));
    setIsModalVisible(false);
    reset();
    setEditingId(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    reset();
    setEditingId(null);
  };

  const handleEdit = (id) => {
    const item = data.find((record) => record.id === id);
    if (item) {
      setEditingId(id);
      for (const [key, value] of Object.entries(item)) {
        setValue(key, value);
      }
      showModal();
    } else {
      console.error(`No item found with id ${id}`);
    }
  };

  const handleDelete = (id) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
    localStorage.setItem(`hrData_${currentUser}`, JSON.stringify(newData));
  };

  const calculateMetrics = (startDate, endDate) => {
    const filteredData = data.filter((item) =>
      moment(item.date).isBetween(startDate, endDate, null, "[]")
    );

    const totals = filteredData.reduce(
      (acc, item) => {
        acc.directDial += parseInt(item.directDial || 0, 10);
        acc.rpcVm += parseInt(item.rpcVm || 0, 10);
        acc.companyIvr += parseInt(item.companyIvr || 0, 10);
        acc.notVerified += parseInt(item.notVerified || 0, 10);
        return acc;
      },
      { directDial: 0, rpcVm: 0, companyIvr: 0, notVerified: 0 }
    );

    const grandTotal =
      totals.directDial + totals.rpcVm + totals.companyIvr + totals.notVerified;

    const percentage = grandTotal ? (totals.directDial * 100) / grandTotal : 0;
    const productivity = grandTotal
      ? (totals.directDial + totals.rpcVm) / grandTotal
      : 0;

    return { totals, grandTotal, percentage, productivity };
  };

  const getTodayMetrics = () => {
    const todayStart = moment().startOf("day");
    const todayEnd = moment().endOf("day");
    return calculateMetrics(todayStart, todayEnd);
  };

  const getWeeklyMetrics = () => {
    const weekStart = moment().startOf("week");
    const weekEnd = moment().endOf("week");
    return calculateMetrics(weekStart, weekEnd);
  };

  const getMonthlyMetrics = () => {
    const monthStart = moment().startOf("month");
    const monthEnd = moment().endOf("month");
    return calculateMetrics(monthStart, monthEnd);
  };

  const todayMetrics = getTodayMetrics();
  const weeklyMetrics = getWeeklyMetrics();
  const monthlyMetrics = getMonthlyMetrics();

  const metricsData = [
    {
      key: "today",
      period: "Today",
      ...todayMetrics.totals,
      grandTotal: todayMetrics.grandTotal,
      percentage: todayMetrics.percentage.toFixed(2),
      productivity: todayMetrics.productivity.toFixed(2),
    },
    {
      key: "weekly",
      period: "This Week",
      ...weeklyMetrics.totals,
      grandTotal: weeklyMetrics.grandTotal,
      percentage: weeklyMetrics.percentage.toFixed(2),
      productivity: weeklyMetrics.productivity.toFixed(2),
    },
    {
      key: "monthly",
      period: "This Month",
      ...monthlyMetrics.totals,
      grandTotal: monthlyMetrics.grandTotal,
      percentage: monthlyMetrics.percentage.toFixed(2),
      productivity: monthlyMetrics.productivity.toFixed(2),
    },
  ];

  const groupedData = Object.values(
    data.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = {
          date: item.date,
          directDial: 0,
          rpcVm: 0,
          companyIvr: 0,
          notVerified: 0,
        };
      }
      acc[item.date].directDial += parseInt(item.directDial || 0, 10);
      acc[item.date].rpcVm += parseInt(item.rpcVm || 0, 10);
      acc[item.date].companyIvr += parseInt(item.companyIvr || 0, 10);
      acc[item.date].notVerified += parseInt(item.notVerified || 0, 10);
      return acc;
    }, {})
  );

  const sortedData = groupedData.sort((a, b) =>
    moment(b.date).diff(moment(a.date))
  );

  const chartData = metricsData.map((item) => ({
    period: item.period,
    "Direct Dial": item.directDial,
    "RPC VM": item.rpcVm,
    "Company IVR": item.companyIvr,
    "Not Verified": item.notVerified,
  }));

  return (
    <div>
      {/* {showLogin ? (
        <Modal
          title="Login"
          open={showLogin}
          onOk={handleLogin}
          onCancel={() => setShowLogin(false)}
          okText="Login"
        >
          <Form layout="vertical">
            <Form.Item label="Employee ID">
              <Input
                name="employeeId"
                value={userCredentials.employeeId}
                onChange={handleChangeCredentials}
              />
            </Form.Item>
            <Form.Item label="Password">
              <Input.Password
                name="password"
                value={userCredentials.password}
                onChange={handleChangeCredentials}
              />
            </Form.Item>
          </Form>
        </Modal>
      ) : (
        <> */}
      <Button type="primary" onClick={showModal}>
        Add File
      </Button>
      {/* <Button onClick={handleLogout} style={{ marginLeft: "10px" }}>
        Logout
      </Button> */}
      <Charts chartData={chartData} />
      <DataTable
        metricsData={metricsData}
        data={sortedData}
        originalData={data}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <ModalForm
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        control={control}
        handleSubmit={handleSubmit}
        reset={reset}
      />
      {/* </> */}
      {/*  )} */}
    </div>
  );
};

export default App;
