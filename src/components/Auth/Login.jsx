import { Form, Input } from "antd";
import Modal from "antd/es/modal/Modal";
import { useState } from "react";
import { auth, firestore, signInWithEmailAndPassword } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAppContext } from "../../contexts/AppContext";

const Login = () => {
  const { setData, setShowLogin, setUser,showLogin } = useAppContext();
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChangeCredentials = (e) => {
    const { name, value } = e.target;
    setUserCredentials({ ...userCredentials, [name]: value });
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

  return (
    <div>
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
    </div>
  );
};

export default Login;
