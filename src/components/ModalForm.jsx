import { Modal, Button, Form, Input } from "antd";
import { useAppContext } from "../contexts/AppContext";
import { useEffect } from "react";

const ModalForm = ({ handleOk, initialValues }) => {
  const { isModalVisible, handleCancel } = useAppContext();
  const [form] = Form.useForm();

  useEffect(() => {
    if (isModalVisible && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [isModalVisible, initialValues]);

  const onFinish = (values) => {
    handleOk(values);
    form.resetFields();
  };

  return (
    <Modal
      title="CV File Form"
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Date is required" }]}
        >
          <Input type="date" />
        </Form.Item>
        <Form.Item
          label="File Name"
          name="fileName"
          rules={[{ required: true, message: "File Name is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Direct Dial"
          name="directDial"
          rules={[{ required: true, message: "Direct Dial is required" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="RPC VM"
          name="rpcVm"
          rules={[{ required: true, message: "RPC VM is required" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Company IVR"
          name="companyIvr"
          rules={[{ required: true, message: "Company IVR is required" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Not Verified"
          name="notVerified"
          rules={[{ required: true, message: "Not Verified is required" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          Submit
        </Button>
      </Form>
    </Modal>
  );
};

export default ModalForm;
