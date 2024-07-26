import { Form, Input, notification } from "antd";
import Modal from "antd/es/modal/Modal";
import { useState, useEffect } from "react";
import { auth, firestore, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAppContext } from "../../contexts/AppContext";
import { Dialog } from "@headlessui/react";
import { Link } from "react-router-dom";

const AuthModal = () => {
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  const { setData, setShowLogin, setUser, showLogin, setToken } = useAppContext();
  const [rememberMe, setRememberMe] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // State to toggle between login and signup

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

      notification.success({
        message: 'Login Successful',
        description: 'You have successfully logged in.',
      });

      setShowLogin(false); // Hide modal on successful login
    } catch (error) {
      notification.error({
        message: 'Login Failed',
        description: error.message,
      });
    }
  };

  const handleSignup = async () => {
    const { email, password } = userCredentials;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
      // Create a new user document in Firestore
      const userDoc = doc(firestore, "users", user.uid);
      await setDoc(userDoc, { data: [] }); // Initialize user data
      setData([]);

      notification.success({
        message: 'Signup Successful',
        description: 'You have successfully signed up.',
      });

      setShowLogin(false); // Hide modal on successful signup
    } catch (error) {
      notification.error({
        message: 'Signup Failed',
        description: error.message,
      });
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
          className="fixed inset-0 bg-gray-500 bg-opacity-100 transition-opacity"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4 text-center">
          <Dialog.Panel className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6">
            <div className="flex items-center justify-between">
              <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                {isSignup ? "Signup" : "Login"}
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
                  onClick={isSignup ? handleSignup : handleLogin}
                  className="inline-flex w-full justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isSignup ? "Signup" : "Login"}
                </button>
              </div>
            </form>
            <span>
              {isSignup ? (
                <div className=" mt-2">
                  Already have an account? <Link to="#" onClick={() => setIsSignup(false)} className="text-[blue] font-semibold">Login</Link>
                </div>
              ) : (
                <div className=" mt-2">
                  Don't have an account? <Link to="#" onClick={() => setIsSignup(true)} className="text-[blue] font-semibold">Signup</Link>
                </div>
              )}
            </span>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default AuthModal;
