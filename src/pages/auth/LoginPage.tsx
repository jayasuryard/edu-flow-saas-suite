
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { GraduationCap, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    tenantDomain: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract domain from URL
    const hostname = window.location.hostname;
    let domain = '';
    
    if (hostname.includes('.')) {
      // For subdomains like school.lovable.app, extract 'school'
      const parts = hostname.split('.');
      if (parts.length > 2) {
        domain = parts[0]; // Get the subdomain
      } else {
        // For custom domains like school.com, use the full domain without TLD
        domain = parts[0];
      }
    } else {
      // For localhost or other cases, use the full hostname
      domain = hostname;
    }

    setFormData(prev => ({
      ...prev,
      tenantDomain: domain
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!formData.tenantDomain) {
      toast.error('Unable to determine school domain from URL');
      return;
    }

    setIsLoading(true);
    const success = await login(formData);
    setIsLoading(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <GraduationCap className="absolute top-20 left-20 h-8 w-8 text-blue-300 animate-bounce animation-delay-500" />
        <Mail className="absolute bottom-40 left-40 h-7 w-7 text-indigo-300 animate-bounce animation-delay-1500" />
        <Lock className="absolute bottom-32 right-20 h-5 w-5 text-blue-400 animate-bounce animation-delay-2000" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header with Animation */}
          <div className="text-center animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-30 scale-110 animate-pulse"></div>
              <div className="relative bg-white rounded-full p-4 w-20 h-20 mx-auto mb-4 shadow-lg">
                <GraduationCap className="h-12 w-12 text-blue-600 mx-auto" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              EduFlow
            </h1>
            <p className="text-gray-600 font-medium">Welcome back to your school management portal</p>
            {formData.tenantDomain && (
              <p className="text-sm text-blue-600 mt-2">
                Signing in to: <span className="font-semibold">{formData.tenantDomain}</span>
              </p>
            )}
          </div>

          {/* Login Card with Glass Effect */}
          <Card className="relative backdrop-blur-lg bg-white/80 shadow-2xl border-0 animate-scale-in animation-delay-300">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-lg"></div>
            <div className="relative z-10">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-center text-gray-800">Sign In</CardTitle>
                <CardDescription className="text-center text-gray-600">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2 animate-slide-in-right animation-delay-500">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 animate-slide-in-right animation-delay-700">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-fade-in animation-delay-900"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                <div className="mt-6 space-y-4 animate-fade-in animation-delay-1100">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white/80 text-gray-500">Need help?</span>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                    >
                      Forgot your password?
                    </Link>
                    <div className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <Link
                        to="/register"
                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                      >
                        Sign up here
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
