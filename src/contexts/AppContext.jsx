import { createContext, useState, useContext, useEffect } from "react";
import { theme } from "antd";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [data, setData] = useState([]);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setToken(token);
  }, [token]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingId(null);
  };

  const value = {
    collapsed,
    setCollapsed,
    colorBgContainer,
    borderRadiusLG,
    isModalVisible,
    setIsModalVisible,
    editingId,
    setEditingId,
    data,
    setData,
    showLogin,
    setShowLogin,
    user,
    setUser,
    showModal,
    handleCancel,
    token,
    setToken,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useAppContext = () => {
  return useContext(AppContext);
};
