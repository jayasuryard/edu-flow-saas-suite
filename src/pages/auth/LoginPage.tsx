import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  GraduationCap, Mail, Lock, BookOpen, Users, Award, ChevronRight, School, Star, 
  Globe2, Book, Lightbulb, Trophy, Apple, PenTool, Calculator, Microscope, Eye, EyeOff 
} from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  tenantDomain: z.string().min(1, 'Domain is required')
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      tenantDomain: ''
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Enhanced intelligent domain extraction
    const hostname = window.location.hostname;
    let domain = '';
    
    // Handle localhost development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      domain = 'demo';
    } 
    else {
      // Clean hostname by removing www prefix first
      const cleanHostname = hostname.replace(/^www\./, '');
      const parts = cleanHostname.split('.');
      
      if (parts.length === 1) {
        // Single part domain (unlikely in production)
        domain = parts[0];
      }
      else if (parts.length === 2) {
        // Direct domain patterns: schoolname.com, schoolname.edu, schoolname.app
        domain = parts[0];
      }
      else if (parts.length >= 3) {
        // Multi-part domains need intelligent detection
        const firstPart = parts[0].toLowerCase();
        const secondPart = parts[1].toLowerCase();
        const thirdPart = parts.length > 2 ? parts[2].toLowerCase() : '';
        
        // Common technical/platform subdomains that indicate school name is likely in second position
        const technicalSubdomains = [
          'app', 'platform', 'portal', 'admin', 'dashboard', 'student', 'teacher', 
          'staff', 'parent', 'api', 'cdn', 'static', 'assets', 'media', 'files',
          'mail', 'email', 'calendar', 'library', 'lms', 'sms', 'sis'
        ];
        
        // Geographic/location subdomains that might indicate school name is in second position
        const locationSubdomains = [
          'us', 'uk', 'ca', 'au', 'north', 'south', 'east', 'west', 'central',
          'main', 'campus', 'online', 'remote'
        ];
        
        // Educational department subdomains
        const departmentSubdomains = [
          'admissions', 'registrar', 'financial', 'housing', 'dining', 'athletics',
          'academics', 'research', 'alumni', 'events', 'news'
        ];
        
        // All subdomains that suggest the school name is in the second part
        const allKnownSubdomains = [
          ...technicalSubdomains, 
          ...locationSubdomains, 
          ...departmentSubdomains
        ];
        
        // Check if second part looks generic or is a known platform
        const isSecondPartGeneric = (
          secondPart.match(/^(school|edu|university|college|academy|institute)$/) ||
          secondPart.length <= 3
        );
        
        if (allKnownSubdomains.includes(firstPart)) {
          // First part is a known subdomain, school name is likely second part
          domain = secondPart;
        }
        else {
          // First part might be the school name, but let's do additional checks
          
          // Check if first part looks like a school name (longer, not generic)
          const isFirstPartLikelySchoolName = (
            firstPart.length > 2 && 
            !technicalSubdomains.includes(firstPart) &&
            !firstPart.match(/^(test|dev|staging|prod|beta|alpha|demo)$/)
          );
          
          if (isFirstPartLikelySchoolName && !isSecondPartGeneric) {
            // First part is likely the school name
            domain = firstPart;
          }
          else if (!isSecondPartGeneric) {
            // Second part is likely the school name
            domain = secondPart;
          }
          else {
            // Fallback: use first part
            domain = firstPart;
          }
        }
        
        // Special handling for common educational TLDs in multi-part domains
        // Example: something.schoolname.edu -> schoolname
        if (parts.length === 3 && (thirdPart === 'edu' || thirdPart === 'ac')) {
          if (!allKnownSubdomains.includes(firstPart)) {
            // If first part is not a known subdomain, it might be the school name
            // But if second part looks more like a school name, use that
            if (secondPart.length > firstPart.length && !isSecondPartGeneric) {
              domain = secondPart;
            } else {
              domain = firstPart;
            }
          } else {
            domain = secondPart;
          }
        }
      }
    }

    // Clean up the domain (remove any remaining dots or invalid characters)
    domain = domain.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
    
    // Ensure domain is not empty and not a generic term
    if (!domain || domain.match(/^(www|app|platform|portal|admin|api|cdn|static)$/)) {
      domain = 'school';
    }
    
    console.log(`Domain extraction: ${hostname} -> ${domain}`);
    form.setValue('tenantDomain', domain);
  }, [form]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const loginCredentials = {
      email: data.email,
      password: data.password,
      tenantDomain: data.tenantDomain
    };
    const success = await login(loginCredentials);
    setIsLoading(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced School-themed Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating School Buildings */}
        <div className="absolute top-4 sm:top-10 left-4 sm:left-8 transform -rotate-12 animate-pulse">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-xl border border-blue-200/50">
            <School className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="absolute top-16 sm:top-32 right-6 sm:right-12 transform rotate-12 animate-bounce" style={{ animationDelay: '2s' }}>
          <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full p-2 sm:p-3 shadow-lg">
            <Apple className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
        </div>

        {/* Floating Books */}
        <div className="absolute top-32 sm:top-40 left-1/4 transform rotate-6 animate-float">
          <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-lg border border-green-300/30">
            <Book className="h-6 w-6 sm:h-10 sm:w-10 text-green-700" />
          </div>
        </div>

        {/* Floating Academic Tools */}
        <div className="absolute bottom-20 sm:bottom-32 left-8 sm:left-16 transform -rotate-6 animate-pulse">
          <div className="bg-purple-500/20 backdrop-blur-sm rounded-xl p-2 sm:p-3 shadow-lg">
            <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-purple-700" />
          </div>
        </div>

        <div className="absolute bottom-12 sm:bottom-20 right-12 sm:right-20 transform rotate-12 animate-bounce" style={{ animationDelay: '1s' }}>
          <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-lg">
            <Microscope className="h-6 w-6 sm:h-8 sm:w-8 text-red-700" />
          </div>
        </div>

        {/* Academic Achievement Badges */}
        <div className="absolute top-12 sm:top-20 right-1/4 transform -rotate-12">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full p-1.5 sm:p-2 shadow-xl animate-pulse">
            <Trophy className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-800" />
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px] sm:bg-[size:60px_60px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - School-themed Branding */}
        <div className="hidden lg:flex lg:w-3/5 xl:w-1/2 relative">
          <div className="flex flex-col justify-center px-6 xl:px-8 py-8 w-full">
            {/* Enhanced Brand Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <GraduationCap className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-1 animate-spin" style={{ animationDuration: '3s' }}>
                    <Star className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-6">
                  <h1 className="text-4xl xl:text-5xl font-bold bg-gradient-to-r from-blue-800 to-indigo-900 bg-clip-text text-transparent">
                    EduFlow
                  </h1>
                  <p className="text-slate-600 text-lg font-medium flex items-center mt-1">
                    <PenTool className="h-4 w-4 mr-2 text-blue-600" />
                    Modern School Management
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl xl:text-4xl font-bold text-slate-800 leading-tight">
                  Welcome Back to Your
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Digital Campus
                  </span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                  Where education meets innovation. Empowering schools with intelligent management solutions.
                </p>
              </div>
            </div>

            {/* School-themed Feature Cards */}
            <div className="grid grid-cols-1 gap-4 max-w-lg">
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl transform hover:scale-105 transition-all duration-300 border border-blue-200/50 hover:border-blue-300">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 group-hover:rotate-6 transition-transform duration-300">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Smart Learning Hub</h3>
                    <p className="text-sm text-slate-600">AI-powered educational management</p>
                  </div>
                </div>
              </div>
              
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl transform hover:scale-105 transition-all duration-300 border border-purple-200/50 hover:border-purple-300 ml-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3 group-hover:-rotate-6 transition-transform duration-300">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Connected Community</h3>
                    <p className="text-sm text-slate-600">Seamless school collaboration</p>
                  </div>
                </div>
              </div>
              
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl transform hover:scale-105 transition-all duration-300 border border-green-200/50 hover:border-green-300">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 group-hover:rotate-12 transition-transform duration-300">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Excellence Tracking</h3>
                    <p className="text-sm text-slate-600">Advanced academic analytics</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Achievement Showcase */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center">
                    <Trophy className="h-4 w-4 text-yellow-500 mr-2" />
                    Trusted by 1000+ Schools
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">Join the educational revolution</p>
                </div>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Enhanced Login Form */}
        <div className="w-full lg:w-2/5 xl:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:pl-2">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-3 shadow-xl">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h1 className="ml-3 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-800 to-indigo-900 bg-clip-text text-transparent">
                  EduFlow
                </h1>
              </div>
            </div>

            {/* Enhanced Login Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl transform rotate-2 scale-105 opacity-10"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl transform -rotate-1 scale-102 opacity-5"></div>
              
              <Card className="relative bg-white/90 backdrop-blur-xl shadow-2xl border-0 rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
                
                <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-2 shadow-lg animate-bounce">
                  <Apple className="h-4 w-4 text-yellow-800" />
                </div>
                
                <CardHeader className="text-center pb-6 pt-8 px-4 sm:px-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-4 shadow-lg">
                      <School className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Welcome Back</CardTitle>
                  <CardDescription className="text-slate-600 text-base sm:text-lg">
                    Sign in to your academic dashboard
                  </CardDescription>
                  <div className="flex items-center justify-center mt-3 space-x-2">
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                      Secure School Portal
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="px-4 sm:px-8 pb-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-bold text-slate-700 flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-blue-600" />
                              School Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your school email"
                                className="h-12 rounded-xl border-slate-200 bg-white/70 backdrop-blur-sm focus:border-blue-400 focus:ring-blue-400/30 transition-all duration-300 text-base shadow-lg"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-bold text-slate-700 flex items-center">
                              <Lock className="h-4 w-4 mr-2 text-blue-600" />
                              Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter your password"
                                  className="h-12 rounded-xl border-slate-200 bg-white/70 backdrop-blur-sm focus:border-blue-400 focus:ring-blue-400/30 transition-all duration-300 text-base shadow-lg pr-12"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  onClick={togglePasswordVisibility}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 transition-all duration-300 group"
                                >
                                  <div className="relative">
                                    {showPassword ? (
                                      <EyeOff className="h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-all duration-300 transform group-hover:scale-110" />
                                    ) : (
                                      <Eye className="h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-all duration-300 transform group-hover:scale-110" />
                                    )}
                                    <div className="absolute inset-0 bg-blue-400/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                  </div>
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] text-base"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Accessing Campus...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-3">
                            <School className="h-5 w-5" />
                            <span>Enter Campus</span>
                            <ChevronRight className="h-5 w-5" />
                          </div>
                        )}
                      </Button>
                    </form>
                  </Form>

                  <div className="mt-8 space-y-5">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-slate-500 font-semibold">Academic Support</span>
                      </div>
                    </div>
                    
                    <div className="text-center space-y-4">
                      <Link
                        to="/forgot-password"
                        className="block text-blue-600 hover:text-blue-700 font-bold transition-colors duration-200 hover:underline text-sm sm:text-base"
                      >
                        🔐 Forgot your credentials?
                      </Link>
                      <div className="text-slate-600 text-sm sm:text-base">
                        New educational institution?{' '}
                        <Link
                          to="/register"
                          className="text-blue-600 hover:text-blue-700 font-bold transition-colors duration-200 hover:underline"
                        >
                          🏫 Register your school
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

      {/* Custom CSS for animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(6deg); }
            50% { transform: translateY(-10px) rotate(6deg); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;
