import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center text-white">
      <div className="font-bold text-xl">
        <Link to="/dashboard">Resume Builder</Link>
      </div>
      <div className="flex gap-6">
        <Link to="/dashboard" className="hover:underline">
          Home
        </Link>
        <Link to="/saved-resumes" className="hover:underline">
          Saved Resumes
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
