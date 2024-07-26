import { Content } from "antd/es/layout/layout";
import { Route, Routes } from "react-router-dom";
import Home from "../Home";
import { useAppContext } from "../../contexts/AppContext";
import { Button } from "antd";
import Login from "../Auth/Login";
import SignupForm from "../Auth/SignupForm";

const NavigationRoutes = () => {
  const { borderRadiusLG, colorBgContainer, showModal, token } =
    useAppContext();

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
      {token && (
        <div className="flex justify-end p-5">
          <Button
            type="primary"
            className="w-[150px] h-10 text-lg font-semibold"
            onClick={showModal}
          >
            Add File
          </Button>
        </div>
      )}
      <div className="py-5">
        <Routes>
          <Route path="/" exact element={<Home />} />
        </Routes>
      </div>
    </Content>
  );
};

export default NavigationRoutes;
