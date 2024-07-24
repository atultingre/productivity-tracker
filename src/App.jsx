import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Form } from "antd";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import Charts from "./components/Charts";
import DataTable from "./components/DataTable";
import ModalForm from "./components/ModalForm";
import {
  auth,
  firestore,
  signInWithEmailAndPassword,
  signOut,
} from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import moment from "moment";
import SignupForm from "./components/SignupForm";

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true); // Start with true to show login modal by
  const [isSignupVisible, setIsSignupVisible] = useState(false);

  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  const { control, handleSubmit, reset, setValue, getValues } = useForm();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // If there's a token, verify it by checking the user's authentication state
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          setUser(user);
          // Fetch and set user data after user has been authenticated
          const userDoc = doc(firestore, "users", user.uid);
          const userData = await getDoc(userDoc);
          setData(userData.exists() ? userData.data().data || [] : []);
          setShowLogin(false); // Hide login modal if user is authenticated
        } else {
          localStorage.removeItem("authToken"); // Clear token if user is not authenticated
          setShowLogin(true); // Show login modal if no user is authenticated
        }
      });

      return () => unsubscribe();
    } else {
      setShowLogin(true); // Show login modal if no token in local storage
    }
  }, []);

  const showSignupForm = () => {
    setIsSignupVisible(true);
  };

  const closeSignupForm = () => {
    setIsSignupVisible(false);
  };
  const handleLogin = async () => {
    const { email, password } = userCredentials;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken(); // Get the token
      localStorage.setItem("authToken", token); // Store the token in local storage
      setUser(user);
      // Fetch and set user data after successful login
      const userDoc = doc(firestore, "users", user.uid);
      const userData = await getDoc(userDoc);
      setData(userData.exists() ? userData.data().data || [] : []);
      setShowLogin(false); // Hide login modal on successful login
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken"); // Remove the token from local storage
      setShowLogin(true); // Show login modal on logout
    } catch (error) {
      alert(error.message);
    }
  };

  const handleChangeCredentials = (e) => {
    const { name, value } = e.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
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
    if (user) {
      const userDoc = doc(firestore, "users", user.uid);
      await setDoc(userDoc, { data: newData });
    }

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

  const handleDelete = async (id) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
    if (user) {
      const userDoc = doc(firestore, "users", user.uid);
      await setDoc(userDoc, { data: newData });
    }
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
    <div className="p-10">
      {/* <Button type="primary" onClick={showSignupForm}>
        Sign Up
      </Button> */}
      {showLogin && (
        <Modal
          title="Login"
          open={showLogin}
          onOk={handleLogin}
          onCancel={() => setShowLogin(false)}
          okText="Login"
        >
          <Form layout="vertical">
            <Form.Item label="Email">
              <Input
                name="email"
                value={userCredentials.email}
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
      )}
      {/* <SignupForm isVisible={isSignupVisible} onClose={closeSignupForm} /> */}
      <>
        <Button type="primary" onClick={showModal}>
          Add File
        </Button>
        <Button onClick={handleLogout} style={{ marginLeft: "10px" }}>
          Logout
        </Button>
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
      </>
      )}
    </div>
  );
};

export default App;
