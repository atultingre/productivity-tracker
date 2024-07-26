import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout } from "antd";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useAppContext } from "../../contexts/AppContext";
import AuthModal from "../Auth/AuthModal";
const { Header } = Layout;

const TopBar = () => {
  const {
    collapsed,
    setCollapsed,
    colorBgContainer,
    token,
    setShowLogin,
    showLogin,
    setToken,
  } = useAppContext();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      setToken(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = () => {
    setShowLogin(true);
  };

  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
        position: "fixed",
        zIndex: 1,
        width: "100vw",
        left: 0,
        top: 0,
        marginLeft: collapsed ? 80 : 200,
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </div>
        <div className={collapsed ? "mr-[120px]" : "mr-[240px]"}>
          {token ? (
            <Button onClick={handleLogout} className="flex ">
              Logout
            </Button>
          ) : (
            <Button onClick={handleLogin} className="flex ">
              Login
            </Button>
          )}
          {showLogin && !token && <AuthModal />}
        </div>
      </div>
    </Header>
  );
};

export default TopBar;
