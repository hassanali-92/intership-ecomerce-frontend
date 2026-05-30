import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User as UserIcon, Lock, Eye, EyeOff, ArrowRight, UserPlus } from 'lucide-react';

const AdminLogin = ({ setPage, setUser }) => {
  // Backend identifier accept karta hai (Email/Username dono ho sakte hain)
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const toastId = toast.loading('Authenticating Admin... 👑');

    try {
      // Backend Admin Login API Request
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/login-admin`, { 
        identifier, 
        password 
      });
      
      if (response.data && response.data.token) {
        
        // 🛠️ Fixed Crash Bug: Backend direct response.data mein fields bhejta hai
        const formattedAdmin = {
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          isAdmin: true // Admin panel bypass aur controls ke liye
        };

        // 1. Token aur User Data LocalStorage mein save kiya
        localStorage.setItem('shop_token', response.data.token);
        localStorage.setItem('shop_user', JSON.stringify(formattedAdmin));
        
        // 2. Global State update ki
        if (setUser) setUser(formattedAdmin);
        
        toast.success(`Welcome Control Center, ${formattedAdmin.name}! 🚀`, { id: toastId });
        
        // Redirect to Admin Dashboard or Home
        setPage('admin-dashboard'); 
      }
    } catch (error) {
      console.error('Admin Login Error:', error);
      const errorMsg = error.response?.data?.message || 'Access Denied! Invalid Admin Credentials.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
      {/* Dark theme wrapper taaki Admin Panel alag aur premium dikhe */}
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-2xl border border-gray-200">
        
        {/* 👑 New Admin Registration Portal Link */}
        <div className="flex justify-end mb-2">
          <button 
            type="button"
            onClick={() => setPage('admin-register')}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors border border-red-200"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Register Admin
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Control Panel</h2>
          <p className="text-sm text-gray-500 mt-2">Authorized personnel login only</p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-5">
          {/* Identifier Field (Email or Username) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin Identifier</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <UserIcon className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Username or Email"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-500 text-sm transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-500 text-sm transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-sm disabled:bg-red-400 disabled:cursor-not-allowed mt-6"
          >
            <span>{loading ? 'Verifying Admin...' : 'Secure Log In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footers links section */}
        <div className="text-sm text-center text-gray-500 mt-6 flex flex-col gap-2 border-t border-gray-100 pt-4">
          <div>
            New manager?{' '}
            <button type="button" onClick={() => setPage('admin-register')} className="text-red-600 font-semibold hover:underline bg-transparent border-none cursor-pointer">
              Create Admin Account
            </button>
          </div>
          <div>
            Not an Admin?{' '}
            <button type="button" onClick={() => setPage('login')} className="text-gray-600 font-semibold hover:underline bg-transparent border-none cursor-pointer">
              User Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;