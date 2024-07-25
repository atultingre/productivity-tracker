import { useState } from "react";
import { Button, Input, Form, Modal } from "antd";
import { auth, firestore } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Dashboard from "../Dashboard/Dashboard";

const SignupForm = ({ isVisible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);
    const { displayName, email, password } = values;

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store user data in Firestore
      const userDoc = doc(firestore, "users", user.uid);
      await setDoc(userDoc, { displayName });

      // Close modal and reset form
      onClose();
      form.resetFields();
    } catch (error) {
      console.error("Error creating user:", error.message);
      // Handle error (e.g., show notification)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard>
      <Modal
        title="Sign Up"
        visible={isVisible}
        onCancel={onClose}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="displayName"
            label="Name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Dashboard>
  );
};

export default SignupForm;
