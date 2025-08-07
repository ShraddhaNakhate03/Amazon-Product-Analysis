import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear field-specific error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/registration/", {
        username: formData.username,
        email: formData.email,
        password1: formData.password,
        password2: formData.confirmPassword,
      });

      setSuccess("Registration successful! Redirecting to login...");
      setErrors({});
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ general: "Registration failed. Please try again." });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Section - Image */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center relative"
          style={{
            backgroundImage:
              "url('https://plus.unsplash.com/premium_photo-1681487916420-8f50a06eb60e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-40"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl font-bold">Join Us</h1>
            <p className="mt-2 text-lg">Create an account to get started!</p>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 p-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Create an Account</h2>

            {errors.general && <p className="mb-4 text-red-500">{errors.general}</p>}
            {success && <p className="mb-4 text-green-500">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-600 dark:text-gray-300">Username</label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 mt-1 border rounded-xl bg-gray-100 dark:bg-gray-200"
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-300">Email</label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 mt-1 border rounded-xl bg-gray-100 dark:bg-gray-200"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-300">Password</label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 mt-1 border rounded-xl bg-gray-100 dark:bg-gray-200"
                />
                {errors.password1 && <p className="text-red-500 text-sm mt-1">{errors.password1}</p>}
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-300">Confirm Password</label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 mt-1 border rounded-xl bg-gray-100 dark:bg-gray-200"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 mt-4 bg-indigo-500 text-white font-semibold rounded-xl shadow-md hover:shadow-xl"
              >
                Sign Up
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;