import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/authSlice';
import { motion } from 'framer-motion'; // <-- import motion

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://backend-bsay.onrender.com//login', { email, password },{withCredentials: true});
      localStorage.setItem('token', res.data.token);

      dispatch(loginSuccess({
        token: res.data.token,
        user: res.data.user,
      }));

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome Back!</h2>

        {error && (
          <div className="text-red-500 mb-4 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-200 font-semibold"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-blue-600 hover:underline text-sm">
            Forgot Password?
          </Link>
        </div>

        <div className="text-center mt-4 text-sm text-gray-700 font-medium">
          Don't have an account? 
          <Link to="/register" className="text-blue-600 hover:underline ml-1">
            Register
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

