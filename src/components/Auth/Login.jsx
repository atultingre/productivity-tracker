import { Form, Input } from "antd";
import Modal from "antd/es/modal/Modal";
import { useState, useEffect } from "react";
import { auth, firestore, signInWithEmailAndPassword } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAppContext } from "../../contexts/AppContext";
import { Dialog } from "@headlessui/react";

const Login = () => {
  const { setData, setShowLogin, setUser, showLogin, setToken } = useAppContext();
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  // Auto-fill credentials if they are saved in local storage
  useEffect(() => {
    const savedCredentials = JSON.parse(localStorage.getItem("userCredentials"));
    if (savedCredentials) {
      setUserCredentials(savedCredentials);
      setRememberMe(true);
    }
  }, []);

  const handleChangeCredentials = (e) => {
    const { name, value } = e.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };

  const handleLogin = async () => {
    const { email, password } = userCredentials;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken(); // Get the token
      setToken(token);
      localStorage.setItem("authToken", token); // Store the token in local storage

      // Save credentials if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem("userCredentials", JSON.stringify(userCredentials));
      } else {
        localStorage.removeItem("userCredentials");
      }

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
      <Dialog
        open={showLogin}
        onClose={() => setShowLogin(false)}
        className="relative z-10"
      >
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-70 transition-opacity"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4 text-center">
          <Dialog.Panel className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6">
            <div className="flex items-center justify-between">
              <Dialog.Title
                as="h3"
                className="text-lg font-semibold text-gray-900"
              >
                Login
              </Dialog.Title>
              <button
                onClick={() => setShowLogin(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <form className="mt-4">
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
                <Form.Item>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="mr-2"
                    />
                    <label htmlFor="rememberMe" className="text-gray-700">
                      Remember Me
                    </label>
                  </div>
                </Form.Item>
              </Form>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleLogin}
                  className="inline-flex w-full justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Login
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Login;
