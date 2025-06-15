
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { GraduationCap, Mail, Lock, BookOpen, Users, Award, ChevronRight, School, Star, Globe2, Sparkles, Trophy, Target } from 'lucide-react';

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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Large Geometric Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-gradient-to-br from-purple-500/15 to-blue-500/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Hexagon Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-16 h-16 bg-white transform rotate-45 rounded-lg"></div>
          <div className="absolute top-40 right-32 w-12 h-12 bg-white transform rotate-12 rounded-lg"></div>
          <div className="absolute bottom-32 left-1/4 w-8 h-8 bg-white transform -rotate-45 rounded-lg"></div>
          <div className="absolute bottom-20 right-20 w-14 h-14 bg-white transform rotate-30 rounded-lg"></div>
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Modern Academic Showcase */}
        <div className="hidden lg:flex lg:w-3/5 xl:w-2/3 relative">
          {/* Overlapped Glass Card */}
          <div className="absolute inset-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
          </div>
          
          <div className="relative p-12 xl:p-16 flex flex-col justify-center w-full">
            {/* Floating Brand Header */}
            <div className="mb-12 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl p-4 shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                      <GraduationCap className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 animate-bounce">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h1 className="text-5xl xl:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                      EduFlow
                    </h1>
                    <p className="text-blue-200 text-lg font-medium">Next-Gen Education Platform</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlapped Hero Content */}
            <div className="space-y-8 relative">
              <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl blur-2xl"></div>
              <div className="relative">
                <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                  Welcome to the
                  <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                    Future of Learning
                  </span>
                </h2>
                <p className="text-xl text-blue-100 leading-relaxed mt-6 max-w-2xl">
                  Transform your educational institution with our cutting-edge management platform designed for the digital age.
                </p>
              </div>
            </div>

            {/* Floating Feature Cards */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-12 max-w-4xl">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl p-3">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Smart Analytics</h3>
                      <p className="text-blue-200 text-sm">AI-powered insights</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl p-3">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Collaboration Hub</h3>
                      <p className="text-blue-200 text-sm">Connected learning</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl p-3">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Excellence Tracking</h3>
                      <p className="text-blue-200 text-sm">Performance metrics</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl p-3">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Achievement System</h3>
                      <p className="text-blue-200 text-sm">Motivation & rewards</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Overlapped Login Form */}
        <div className="w-full lg:w-2/5 xl:w-1/3 flex items-center justify-center p-6 relative">
          {/* Mobile Header */}
          <div className="lg:hidden absolute top-8 left-6 right-6">
            <div className="flex items-center justify-center">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl p-3">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h1 className="ml-3 text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                EduFlow
              </h1>
            </div>
          </div>

          {/* Overlapped Glass Login Card */}
          <div className="w-full max-w-md relative mt-16 lg:mt-0">
            {/* Background blur layers */}
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
            <div className="absolute -inset-2 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-xl"></div>
            
            <Card className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
              {/* Top accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500"></div>
              
              {/* Floating decoration */}
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full animate-pulse delay-1000"></div>
              
              <CardHeader className="text-center pb-6 pt-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-br from-blue-100/20 to-indigo-100/20 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                    <School className="h-8 w-8 text-blue-300" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-white mb-2">Welcome Back</CardTitle>
                <CardDescription className="text-blue-200 text-lg">
                  Access your academic dashboard
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-blue-100 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-cyan-300" />
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your school email"
                        className="h-12 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-blue-200 focus:border-cyan-400 focus:ring-cyan-400/30 transition-all duration-300"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-blue-100 flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-cyan-300" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        className="h-12 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-blue-200 focus:border-cyan-400 focus:ring-cyan-400/30 transition-all duration-300"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-0"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Access Dashboard</span>
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </form>

                <div className="mt-8 space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-transparent text-blue-200 font-medium">Need help?</span>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <Link
                      to="/forgot-password"
                      className="block text-cyan-300 hover:text-cyan-200 font-semibold transition-colors duration-200 hover:underline text-sm"
                    >
                      Forgot your password?
                    </Link>
                    <div className="text-blue-200 text-sm">
                      New institution?{' '}
                      <Link
                        to="/register"
                        className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors duration-200 hover:underline"
                      >
                        Start your journey
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
  );
};

export default LoginPage;
