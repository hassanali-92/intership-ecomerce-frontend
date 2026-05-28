import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = ({ setPage, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 🌟 Loading toast start kiya
    const toastId = toast.loading('Logging you in... Please wait 🚀');

    try {
      // Backend Login API Request
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/login`, { email, password });
      
      // Check: Backend response mein direct token bhej raha hai
      if (response.data && response.data.token) {
        
        // Backend ke 'role' string ko check karke formatted object banana
        const formattedUser = {
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          isAdmin: response.data.role === 'admin' // 👑 Navbar control karne ke liye
        };

        // 1. Credentials ko LocalStorage mein hamesha ke liye save kiya
        localStorage.setItem('shop_token', response.data.token);
        localStorage.setItem('shop_user', JSON.stringify(formattedUser));
        
        // 2. React Global State update ki taake Header change ho jaye
        if (setUser) setUser(formattedUser);
        
        // Toast ko success par set kiya
        toast.success(`Welcome back, ${formattedUser.name}! 🎉`, { id: toastId });
        
        // Main page par transfer kiya
        setPage('home');
      }
    } catch (error) {
      console.error('Login Error:', error);
      const errorMsg = error.response?.data?.message || 'Invalid Credentials or Server Error!';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md border border-shade-border">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-dark">Sign In</h2>
          <p className="text-sm text-secondary mt-2">Welcome back! Please enter your details.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-shade-border rounded-lg outline-none focus:border-primary text-sm transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-medium text-dark">Password</label>
              <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 border border-shade-border rounded-lg outline-none focus:border-primary text-sm transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary hover:text-dark"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary border-shade-border rounded focus:ring-primary"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-dark select-none">
              Remember me for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-sm disabled:bg-primary/50 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'Processing...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-sm text-center text-secondary mt-6">
          Don't have an account?{' '}
          <button onClick={() => setPage('signup')} className="text-primary font-semibold hover:underline bg-transparent border-none cursor-pointer">
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;