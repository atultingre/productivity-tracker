import { Content } from "antd/es/layout/layout";
import { Route, Routes } from "react-router-dom";
import Home from "../Home";
import { useAppContext } from "../../contexts/AppContext";
import { Button } from "antd";

const NavigationRoutes = () => {
  const { borderRadiusLG, colorBgContainer, showModal } = useAppContext();

  return (
    <Content
      style={{
        margin: "90px 16px 18px 16px",
        minHeight: "82dvh",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        marginTop: 80,
      }}
    >
      <div className="flex justify-end p-10">
        <Button
          type="primary"
          className="w-[150px] h-10 text-lg font-semibold"
          onClick={showModal}
        >
          Add File
        </Button>
      </div>
      <Routes>
        <Route path="/" exact element={<Home />} />
      </Routes>
    </Content>
  );
};

export default NavigationRoutes;
