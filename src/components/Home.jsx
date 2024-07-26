import { doc, getDoc, setDoc } from "firebase/firestore";
import moment from "moment";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAppContext } from "../contexts/AppContext";
import { auth, firestore } from "../firebase";
import Charts from "./Charts";
import DataTable from "./DataTable";
import ModalForm from "./ModalForm";
import { notification } from 'antd';

const Home = () => {
  const {
    editingId,
    setEditingId,
    setIsModalVisible,
    setShowLogin,
    data,
    setData,
    showModal,
    user,
    setUser,
    token,
  } = useAppContext();

  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const userDoc = doc(firestore, "users", user.uid);
        const userData = await getDoc(userDoc);
        setData(userData.exists() ? userData.data().data || [] : []);
        setShowLogin(false);
      } else {
        localStorage.removeItem("authToken");
        setShowLogin(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const openNotification = (type, message) => {
    notification[type]({
      message: message,
      description: '',
    });
  };

  const handleOk = async (formData) => {
    const formattedData = {
      ...formData,
      date: formData.date || "",
      id: editingId || uuidv4(),
    };

    let newData = [...data];
    if (editingId) {
      newData = newData.map((item) =>
        item.id === editingId ? formattedData : item
      );
      openNotification('success', 'File updated successfully');
    } else {
      newData.push(formattedData);
      openNotification('success', 'File added successfully');
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

  const handleEdit = (id) => {
    const item = data.find((record) => record.id === id);
    if (item) {
      setEditingId(id);
      setInitialValues(item);
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
    openNotification('success', 'File deleted successfully');
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

  return (
    <div className="px-10">
      <div>
        <Charts metricsData={metricsData} />
        <DataTable
          metricsData={metricsData}
          data={sortedData}
          originalData={data}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
        <ModalForm
          handleOk={handleOk}
          initialValues={initialValues}
        />
      </div>
    </div>
  );
};

export default Home;
