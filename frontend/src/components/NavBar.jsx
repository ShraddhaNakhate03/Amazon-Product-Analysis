import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Check if the user is logged in
  const [username, setUsername] = useState(null);

  // Fetch username from backend after login
  useEffect(() => {
    if (token) {
      // Make a request to fetch the username from the backend
      const fetchUsername = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/auth/user/', {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          setUsername(response.data.username); // Assuming the backend returns { username: "JohnDoe" }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      };

      fetchUsername();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername(null); // Clear username on logout
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md fixed w-full top-0 left-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-2xl font-semibold hover:text-gray-300">
            MyApp
          </Link>
          <div className="hidden md:flex space-x-6">
            {/* Show links based on login status */}
            <Link
              to="/"
              className="text-lg hover:text-gray-300 transition duration-200"
            >
              Home
            </Link>
            <Link
              to="/ProductDetails"
              className="text-lg hover:text-gray-300 transition duration-200"
            >
              Product Analysis
            </Link>
            <Link
              to="/about"
              className="text-lg hover:text-gray-300 transition duration-200"
            >
              About
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {token ? (
            <>
              {/* Display the username if logged in */}
              <Link
              to="/user-details"
              className="text-lg hover:text-blue-300 transition duration-100"
            >
              <span className="text-lg">{username}</span>
            </Link>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-200"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
