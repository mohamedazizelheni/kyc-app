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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">KYC Submission</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Upload ID Document:</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg,.pdf"
              className="block w-full text-gray-700 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Submit KYC
          </button>
        </form>
        {message && <p className="mt-4 text-center text-gray-800">{message}</p>}
        {submissionStatus && (
          <p className="mt-2 text-center">
            Current KYC Status: <strong>{submissionStatus}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default KycSubmission;
