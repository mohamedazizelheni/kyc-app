import React, { useState, useEffect } from 'react';
import api from '../services/api';

const KycSubmission: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/kyc/status');
        setSubmissionStatus(res.data.status);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStatus();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a document file.');
      return;
    }
    const formData = new FormData();
    formData.append('document', file);

    try {
      const res = await api.post('/kyc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message);
      setSubmissionStatus(res.data.submission.status);
    } catch (error: any) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Submission failed');
    }
  };

  // Helper function to render a colored chip for the status
  const renderStatusChip = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-2xl w-full max-w-lg transition transform hover:-translate-y-1 hover:shadow-xl">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">KYC Submission</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-lg font-medium mb-2">
              Upload ID Document:
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg,.pdf"
              className="block w-full text-gray-700 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Submit KYC
          </button>
        </form>
        {message && (
          <p className="mt-6 text-center text-lg text-gray-800 transition duration-300 ease-in-out">
            {message}
          </p>
        )}
        {submissionStatus && (
          <div className="mt-4 flex items-center justify-center space-x-2">
            <p className="text-lg text-gray-800">Current KYC Status:</p>
            {renderStatusChip(submissionStatus)}
          </div>
        )}
      </div>
    </div>
  );
};

export default KycSubmission;
