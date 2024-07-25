import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
const { Sider } = Layout;

const SideBar = () => {
  const { collapsed } = useAppContext();
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        zIndex: 1,
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div className="flex items-center justify-center py-6">
        {collapsed ? (
          <span className="text-white font-semibold text-xl">CV</span>
        ) : (
          <span className="text-white font-semibold text-xl">
            Contact Verification
          </span>
        )}
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1" icon={<UserOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SideBar;
