import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:8000/api/auth/login/", formData);
      localStorage.setItem("token", response.data.key);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data) {
        const errorMessage = err.response.data.non_field_errors
          ? err.response.data.non_field_errors[0]
          : "Invalid credentials. Please try again.";
        setError(errorMessage);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden max-w-4xl w-full">
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src="https://plus.unsplash.com/premium_photo-1681487916420-8f50a06eb60e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Login Visual"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-40"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="mt-2 text-lg">Sign in to continue</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Login to Your Account</h2>

            {error && <p className="mb-4 text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-gray-600 dark:text-gray-300">Username</label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 mt-1 border rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-600 dark:text-gray-300">Email</label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 mt-1 border rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-600 dark:text-gray-300">Password</label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 mt-1 border rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-md hover:shadow-xl transition-all"
              >
                Login
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Don't have an account? <a href="/register" className="text-primary font-bold hover:underline">Sign up</a>
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Forgot your password? <a href="/resetPassword" className="text-primary hover:underline">Reset here</a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;