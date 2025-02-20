import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  FaUser,
  FaFileAlt,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import IconComponent from '../components/utils/IconComponent';

interface Submission {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  status: string;
  submittedAt: string;
  documentPath: string;
}

const AdminDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [kpi, setKpi] = useState({
    totalUsers: 0,
    totalKycSubmissions: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
  });
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetchSubmissions();
    fetchKPI();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await api.get('/kyc');
      setSubmissions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchKPI = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setKpi(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await api.patch(`/kyc/${id}`, { status });
      setMessage(res.data.message);
      // Update the submission status locally
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub._id === id ? { ...sub, status: res.data.submission.status } : sub
        )
      );
      fetchKPI();
    } catch (error) {
      console.error(error);
      setMessage('Failed to update status');
    }
  };

  // Helper: render a status chip with soft colors and an icon
  const renderStatusChip = (status: string) => {
    if (status === 'pending') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <IconComponent icon={FaHourglassHalf} />
          <span>Pending</span>
        </span>
      );
    } else if (status === 'approved') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <IconComponent icon={FaCheckCircle} />
          <span>Approved</span>
        </span>
      );
    } else if (status === 'rejected') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <IconComponent icon={FaTimesCircle} />
          <span>Rejected</span>
        </span>
      );
    }
    return <span>{status}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Dashboard</h2>

        {/* KPI Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <IconComponent icon={FaUser} />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-xl font-semibold text-gray-800">{kpi.totalUsers}</p>
            </div>
          </div>
          <div className="flex items-center bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <IconComponent icon={FaFileAlt} />
            <div className="ml-4">
              <p className="text-sm text-gray-500">KYC Submissions</p>
              <p className="text-xl font-semibold text-gray-800">{kpi.totalKycSubmissions}</p>
            </div>
          </div>
          <div className="flex items-center bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <IconComponent icon={FaHourglassHalf} />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-semibold text-gray-800">{kpi.pendingCount}</p>
            </div>
          </div>
          <div className="flex items-center bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <IconComponent icon={FaCheckCircle} />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-xl font-semibold text-gray-800">{kpi.approvedCount}</p>
            </div>
          </div>
          <div className="flex items-center bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <IconComponent icon={FaTimesCircle} />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-xl font-semibold text-gray-800">{kpi.rejectedCount}</p>
            </div>
          </div>
        </div>

        {message && (
          <div className="mb-4 text-center text-green-600 font-medium">
            {message}
          </div>
        )}

        {/* KYC Submissions Table */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Submitted At
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((sub) => (
                <tr key={sub._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{sub.user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{sub.user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <a
                      href={`${process.env.REACT_APP_BACKEND_URL}/${sub.documentPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Document
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{renderStatusChip(sub.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(sub.submittedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {sub.status === 'pending' ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateStatus(sub._id, 'approved')}
                          className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition"
                        >
                          <IconComponent icon={FaCheckCircle} />
                          <span className="text-xs font-medium">Approve</span>
                        </button>
                        <button
                          onClick={() => updateStatus(sub._id, 'rejected')}
                          className="flex items-center space-x-1 bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition"
                        >
                          <IconComponent icon={FaTimesCircle} />
                          <span className="text-xs font-medium">Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-xs">--</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
