import { Layout } from "antd";
import NavigationRoutes from "./NavigationRoutes";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import { useAppContext } from "../../contexts/AppContext";

const Dashboard = () => {
  const { collapsed } = useAppContext();

  return (
    <Layout>
      <SideBar collapsed={collapsed} />
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <TopBar />
        <NavigationRoutes />
      </Layout>
    </Layout>
  );
};

export default Dashboard;
