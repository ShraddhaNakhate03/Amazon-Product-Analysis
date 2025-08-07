import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("You must be logged in to change your password.");
      return;
    }

    if (oldPassword === newPassword) {
      setError("New password cannot be the same as old password.");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/auth/password/change/",
        {
          new_password1: oldPassword,
          new_password2: newPassword,
        },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setSuccess("Password changed successfully!");
      setError("");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.detail || "Error changing password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">
            Change Password
          </h2>

          {error && <p className="mb-4 text-red-500 text-center">{error}</p>}
          {success && <p className="mb-4 text-green-500 text-center">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-600 dark:text-gray-300">Old Password</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="password"
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-full px-4 py-3 mt-1 border rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-600 dark:text-gray-300">New Password</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 mt-1 border rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-md hover:shadow-xl transition-all"
            >
              Change Password
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Forgot password?{" "}
              <a href="/reset-password" className="text-indigo-500 font-bold hover:underline">
                Reset Here
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
