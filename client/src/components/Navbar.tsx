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
            <Link to="/" className="text-2xl font-bold ">
              KYC App
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {token ? (
                <>
                  <Link to="/" >
                    Home
                  </Link>
                  {role === 'User' && (
                    <Link to="/kyc" >
                      My KYC
                    </Link>
                  )}
                  {role === 'Admin' && (
                    <Link to="/admin">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" >
                    Login
                  </Link>
                  <Link to="/register" >
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
                className="block "
              >
                Home
              </Link>
              {role === 'User' && (
                <Link
                  to="/kyc"
                  onClick={() => setIsOpen(false)}
                  className="block "
                >
                  My KYC
                </Link>
              )}
              {role === 'Admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block "
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left "
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block "
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block "
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
