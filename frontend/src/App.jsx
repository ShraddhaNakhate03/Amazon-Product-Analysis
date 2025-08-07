import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserDetailsPage from './pages/UserDetailsPage';
import LogoutPage from './pages/LogoutPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import RegistrationPage from './pages/RegistrationPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DarkModeToggle from './components/DarkMode';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import About from './pages/About';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetails from './pages/ProductDetails';
import ReviewAnalysis from './pages/ReviewAnalysis';
import ProductBuy from './pages/ProductBuy';
import axios from 'axios';
import React,{ useEffect } from 'react';
function App() {

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    }
}, []);


  return (
    <>
      {/* Dark Mode Toggle */}
      <DarkModeToggle />
      
      <Router>
        {/* Always visible NavBar */}
        <NavBar />

        <div className="pt-24"> {/* Add padding to prevent overlap with sticky NavBar */}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/changePassword" element={<ChangePasswordPage />} />
            <Route path="/resetPassword" element={<ResetPasswordPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            
            {/* Protected Routes */}
            <Route path="/user-details" element={ <ProtectedRoute> <UserDetailsPage /> </ProtectedRoute> } />
            <Route path="/ProductDetails" element={<ProtectedRoute><ProductDetails/></ProtectedRoute>} />
            <Route path='/ReviewAnalysis' element={<ProtectedRoute><ReviewAnalysis/></ProtectedRoute>} />
            <Route path='/product-buy' element={<ProtectedRoute><ProductBuy/></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
