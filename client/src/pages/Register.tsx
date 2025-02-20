import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  submit?: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const initialValues: RegisterValues = { name: '', email: '', password: '' };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
  });

  const onSubmit = async (
    values: RegisterValues,
    { setSubmitting, setErrors }: FormikHelpers<RegisterValues>
  ) => {
    try {
      await api.post('/auth/register', values);
      const response = await api.post('/auth/login', { email: values.email, password: values.password });
      const token = response.data.token;
      const userRole = response.data.role || 'User';
      login(token, userRole);
      navigate('/');
    } catch (error: any) {
      console.error(error);
      setErrors({ submit: 'Registration failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({ isSubmitting, errors }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name:</label>
                <Field
                  type="text"
                  name="name"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email:</label>
                <Field
                  type="email"
                  name="email"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password:</label>
                <Field
                  type="password"
                  name="password"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              {errors.submit && <div className="text-red-500 text-sm mb-4">{errors.submit}</div>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
              >
                Register
              </button>
            </Form>
          )}
        </Formik>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
