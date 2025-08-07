import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserDetailsPage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect if no token is found
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/auth/user/",
          {
            headers: { Authorization: `Token ${token}` }, // ✅ Fixed token format
          }
        );
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user details. Please log in again.");
        localStorage.removeItem("token"); // Clear invalid token
        setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
      }
    };

    fetchUser();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center">
          User Details
        </h2>

        {error ? (
          <p className="text-red-500 text-center mt-4">{error}</p>
        ) : user ? (
          <div className="mt-4">
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              <strong>Username:</strong> {user.username}
            </p>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="w-full mt-5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center mt-4">
            Loading...
          </p>
        )}
      </div>
    </div>
  );
};

export default UserDetailsPage;
