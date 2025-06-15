
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { GraduationCap, Mail, Lock, BookOpen, Users, Award, ChevronRight, School, Star, Globe2 } from 'lucide-react';

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
      const parts = hostname.split('.');
      if (parts.length > 2) {
        domain = parts[0];
      } else {
        domain = parts[0];
      }
    } else {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-indigo-200/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-1/4 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-300/25 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Enhanced Branding */}
        <div className="hidden lg:flex lg:w-3/5 xl:w-2/3 relative">
          {/* Main content area */}
          <div className="flex flex-col justify-center px-12 xl:px-20 py-20 w-full">
            {/* Logo and brand */}
            <div className="mb-12">
              <div className="flex items-center mb-8">
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 shadow-2xl transform rotate-3">
                    <GraduationCap className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                    <Star className="h-3 w-3 text-yellow-800" />
                  </div>
                </div>
                <div className="ml-6">
                  <h1 className="text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-800 to-indigo-900 bg-clip-text text-transparent">
                    EduFlow
                  </h1>
                  <p className="text-slate-600 text-lg font-medium">Modern School Management</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-4xl xl:text-5xl font-bold text-slate-800 leading-tight">
                  Welcome Back to Your
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Digital Campus
                  </span>
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                  Empowering education through intelligent management. Connect, collaborate, and excel in the digital age.
                </p>
              </div>
            </div>

            {/* Features with overlapping cards */}
            <div className="grid grid-cols-1 gap-6 max-w-2xl">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300 border border-white/50">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Smart Learning</h3>
                    <p className="text-slate-600">AI-powered academic management</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300 border border-white/50 ml-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Connected Community</h3>
                    <p className="text-slate-600">Seamless collaboration platform</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300 border border-white/50">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Excellence Tracking</h3>
                    <p className="text-slate-600">Advanced analytics & insights</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote section */}
            <div className="mt-12 relative">
              <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl p-8 backdrop-blur-sm border border-white/30">
                <blockquote className="text-xl text-slate-700 italic leading-relaxed">
                  "The future belongs to those who learn more skills and combine them in creative ways."
                </blockquote>
                <cite className="block text-blue-600 font-semibold mt-4">- Robert Greene</cite>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-2/5 xl:w-1/3 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-3">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h1 className="ml-3 text-3xl font-bold bg-gradient-to-r from-blue-800 to-indigo-900 bg-clip-text text-transparent">
                  EduFlow
                </h1>
              </div>
            </div>

            {/* Login Card with overlapping design */}
            <div className="relative">
              {/* Background card for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl transform rotate-1 scale-105 opacity-10"></div>
              
              <Card className="relative bg-white/80 backdrop-blur-xl shadow-2xl border-0 rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
                
                <CardHeader className="text-center pb-8 pt-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-4">
                      <School className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</CardTitle>
                  <CardDescription className="text-slate-600 text-lg">
                    Sign in to your school dashboard
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="px-8 pb-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-slate-700 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-blue-600" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your school email"
                        className="h-14 rounded-xl border-slate-200 bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300 text-lg"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold text-slate-700 flex items-center">
                        <Lock className="h-4 w-4 mr-2 text-blue-600" />
                        Password
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        className="h-14 rounded-xl border-slate-200 bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300 text-lg"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Signing In...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>Sign In</span>
                          <ChevronRight className="h-5 w-5" />
                        </div>
                      )}
                    </Button>
                  </form>

                  <div className="mt-8 space-y-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-slate-500 font-medium">Need assistance?</span>
                      </div>
                    </div>
                    
                    <div className="text-center space-y-4">
                      <Link
                        to="/forgot-password"
                        className="block text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                      <div className="text-slate-600">
                        New to our platform?{' '}
                        <Link
                          to="/register"
                          className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
                        >
                          Create school account
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
