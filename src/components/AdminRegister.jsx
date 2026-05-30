import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, ShieldAlert, Lock, ArrowRight } from 'lucide-react';

const AdminRegister = ({ setPage }) => {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // Email ki jagah identifier use hoga
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading('Initializing Admin Provisioning... 🛠️');

    try {
      // Backend Admin Register API Request
      // Note: Apne backend route ke mutabiq endpoint ko sahi kar lein (e.g., /api/users/register-admin)
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/register-admin`, { 
        name, 
        identifier, 
        password 
      });
      
      // Agar registration successful hoti hai
      if (response.data) {
        toast.success('Admin Created! Registration is now permanently locked. 🎉', { id: toastId });
        setPage('admin-login'); // Kamyaabi ke baad Admin Login page par redirect kiya
      }
    } catch (error) {
      console.error('Admin Signup Error:', error);
      // Agar admin pehle se exist karta hoga toh backend 403 Forbidden ke sath custom message bhejega
      const errorMsg = error.response?.data?.message || 'Registration failed or System Locked!';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-12">
      {/* Premium Dark Theme Core for Admin Operations */}
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-2xl border border-gray-200">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create Admin Account</h2>
          <p className="text-sm text-gray-500 mt-2">
            Security Lock: This form only works if no admin currently exists.
          </p>
        </div>

        <form onSubmit={handleAdminSignup} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Admin Master"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-500 text-sm transition-colors"
              />
            </div>
          </div>

          {/* Admin Identifier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin Identifier (Username/Email)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin_root or admin@shop.com"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-500 text-sm transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                minLength="6"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-500 text-sm transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-sm disabled:bg-red-400 disabled:cursor-not-allowed mt-6"
          >
            <span>{loading ? 'Deploying Credentials...' : 'Register Master Admin'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-sm text-center text-gray-500 mt-6">
          Already registered?{' '}
          <button onClick={() => setPage('admin-login')} className="text-red-600 font-semibold hover:underline bg-transparent border-none cursor-pointer">
            Admin Log in
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminRegister;