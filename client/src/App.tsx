import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import KycSubmission from './pages/KycSubmission';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="Admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route path="/kyc" element={<PrivateRoute requiredRole="User"><KycSubmission /></PrivateRoute>} />
          </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
