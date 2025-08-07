import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
  const navigate = useNavigate(); // Corrected variable name

  useEffect(() => {
    localStorage.removeItem('token'); // Clear authentication token
    navigate('/login'); // Redirect to login page
  }, []); // Run only once
  
  return <div>Logging out...</div>;
};

export default LogoutPage;
