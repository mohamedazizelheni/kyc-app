import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaBars, FaTimesCircle } from 'react-icons/fa';
import IconComponent from '../components/utils/IconComponent';

const Navbar: React.FC = () => {
  const { token, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-200 shadow-lg text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold hover:text-gray-200">
              KYC App
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {token ? (
                <>
                  <Link to="/" className="hover:text-gray-200">
                    Home
                  </Link>
                  {role === 'User' && (
                    <Link to="/kyc" className="hover:text-gray-200">
                      My KYC
                    </Link>
                  )}
                  {role === 'Admin' && (
                    <Link to="/admin" className="hover:text-gray-200">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="hover:text-gray-200">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-gray-200">
                    Login
                  </Link>
                  <Link to="/register" className="hover:text-gray-200">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
              {isOpen ? (
                <IconComponent icon={FaTimesCircle} />
              ) : (
                <IconComponent icon={FaBars} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {token ? (
            <>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block hover:text-gray-200"
              >
                Home
              </Link>
              {role === 'User' && (
                <Link
                  to="/kyc"
                  onClick={() => setIsOpen(false)}
                  className="block hover:text-gray-200"
                >
                  My KYC
                </Link>
              )}
              {role === 'Admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block hover:text-gray-200"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left hover:text-gray-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block hover:text-gray-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block hover:text-gray-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
