import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home: React.FC = () => {
  const { token } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to KYC App</h1>
        <p className="text-lg mb-6">
          A secure and efficient solution for Know Your Customer (KYC) compliance.
          Our application simplifies the process by allowing users to easily submit their identification
          documents and track the approval status in real-time.
        </p>
        {!token && (
          <div className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
