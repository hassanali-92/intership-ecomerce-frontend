import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

const Signup = ({ setPage }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 🌟 Loading toast start kiya
    const toastId = toast.loading('Creating your account... 🛠️');

    try {
      // Backend Signup API Request
      const response = await axios.post('${import.meta.env.VITE_API_BASE_URL}/api/users/register', { 
        name, 
        email, 
        password 
      });
      
      // Check: Agar data milta hai aur token bhej raha hai backend register par bhi
      if (response.data && response.data.token) {
        toast.success('Account Created Successfully! Please login now. 🎉', { id: toastId });
        setPage('login'); // 🟢 Kamyabi ke baad automatic login screen open
      }
    } catch (error) {
      console.error('Signup Error:', error);
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md border border-shade-border">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-dark">Create Account</h2>
          <p className="text-sm text-secondary mt-2">Join us to manage products and browse shop.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-shade-border rounded-lg outline-none focus:border-primary text-sm transition-colors"
              />
            </div>
          </div>

          {/* Email Address */}
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                minLength="6"
                required
                className="w-full pl-10 pr-4 py-2.5 border border-shade-border rounded-lg outline-none focus:border-primary text-sm transition-colors"
              />
            </div>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              required
              className="mt-1 h-4 w-4 text-primary border-shade-border rounded focus:ring-primary"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-secondary select-none">
              I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-sm disabled:bg-primary/50 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-sm text-center text-secondary mt-6">
          Already have an account?{' '}
          <button onClick={() => setPage('login')} className="text-primary font-semibold hover:underline bg-transparent border-none cursor-pointer">
            Log in
          </button>
        </div>

      </div>
    </div>
  );
};

export default Signup;