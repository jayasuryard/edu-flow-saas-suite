import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  GraduationCap, School, Star, Apple, Book, Calculator, Microscope, Trophy,
  ChevronRight, User, Building, Globe, Mail, Phone, MapPin, Lock, Eye, EyeOff
} from 'lucide-react';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
  schoolName: z.string().min(2, 'School name must be at least 2 characters'),
  domain: z.string().min(2, 'Domain must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.object({
    street: z.string().min(2, 'Street address must be at least 2 characters'),
    city: z.string().min(2, 'City must be at least 2 characters'),
    state: z.string().min(2, 'State must be at least 2 characters'),
    zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
    country: z.string().min(2, 'Country must be at least 2 characters')
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      schoolName: '',
      domain: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
      }
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    
    // Prepare the registration data according to the API requirements
    const registrationData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      tenantDomain: data.domain,
      schoolName: data.schoolName,
      domain: data.domain,
      phone: data.phone,
      address: {
        street: data.address.street,
        city: data.address.city,
        state: data.address.state,
        zipCode: data.address.zipCode,
        country: data.address.country
      },
      // Admin details (since this is school registration, the registrant becomes the admin)
      adminFirstName: data.firstName,
      adminLastName: data.lastName,
      adminEmail: data.email,
      adminPassword: data.password
    };

    const success = await register(registrationData);
    setIsLoading(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-4 left-4 transform -rotate-12 animate-pulse">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-xl border border-blue-200/50">
            <School className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        
        <div className="absolute top-16 right-6 transform rotate-12 animate-bounce" style={{ animationDelay: '2s' }}>
          <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full p-2 shadow-lg">
            <Apple className="h-4 w-4 text-white" />
          </div>
        </div>

        <div className="absolute top-32 left-1/4 transform rotate-6 animate-float">
          <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-green-300/30">
            <Book className="h-6 w-6 text-green-700" />
          </div>
        </div>

        <div className="absolute bottom-20 left-8 transform -rotate-6 animate-pulse">
          <div className="bg-purple-500/20 backdrop-blur-sm rounded-xl p-2 shadow-lg">
            <Calculator className="h-6 w-6 text-purple-700" />
          </div>
        </div>

        <div className="absolute bottom-12 right-12 transform rotate-12 animate-bounce" style={{ animationDelay: '1s' }}>
          <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-2 shadow-lg">
            <Microscope className="h-6 w-6 text-red-700" />
          </div>
        </div>

        <div className="absolute top-12 right-1/4 transform -rotate-12">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full p-1.5 shadow-xl animate-pulse">
            <Trophy className="h-4 w-4 text-yellow-800" />
          </div>
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-3 shadow-xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h1 className="ml-3 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-800 to-indigo-900 bg-clip-text text-transparent">
                EduFlow
              </h1>
            </div>
          </div>

          {/* Registration Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl transform rotate-1 scale-105 opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl transform -rotate-1 scale-102 opacity-5"></div>
            
            <Card className="relative bg-white/90 backdrop-blur-xl shadow-2xl border-0 rounded-3xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
              
              <CardHeader className="text-center pb-4 pt-6 px-4 sm:px-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-3 shadow-lg">
                    <School className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">Launch Your Academy</CardTitle>
                <CardDescription className="text-slate-600 text-sm sm:text-base">
                  Join the future of educational management
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-4 sm:px-6 pb-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-700 flex items-center">
                              <User className="h-3 w-3 mr-1 text-blue-600" />
                              First Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter first name"
                                className="h-10 rounded-lg border-slate-200 bg-white/70 backdrop-blur-sm focus:border-blue-400 focus:ring-blue-400/30 transition-all duration-300 text-sm shadow-md"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-700 flex items-center">
                              <User className="h-3 w-3 mr-1 text-blue-600" />
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter last name"
                                className="h-10 rounded-lg border-slate-200 bg-white/70 backdrop-blur-sm focus:border-blue-400 focus:ring-blue-400/30 transition-all duration-300 text-sm shadow-md"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* School Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="schoolName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-700 flex items-center">
                              <Building className="h-3 w-3 mr-1 text-blue-600" />
                              School Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter school name"
                                className="h-10 rounded-lg border-slate-200 bg-white/70 backdrop-blur-sm focus:border-blue-400 focus:ring-blue-400/30 transition-all duration-300 text-sm shadow-md"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="domain"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-700 flex items-center">
                              <Globe className="h-3 w-3 mr-1 text-blue-600" />
                              Domain
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="schoolname"
                                className="h-10 rounded-lg border-slate-200 bg-white/70 backdrop-blur-sm focus:border-blue-400 focus:ring-blue-400/30 transition-all duration-300 text-sm shadow-md"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-700 flex items-center">
                              <Mail className="h-3 w-3 mr-1 text-blue-600" />
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="admin@school.com"
                                className="h-10 rounded-lg border-slate-200 bg-white/70 backdrop-blur-sm focus:border-blue-400 focus:ring-blue-400/30 transition-all duration-300 text-sm shadow-md"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-700 flex items-center">
                              <Phone className="h-3 w-3 mr-1 text-blue-600" />
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="(555) 123-4567"
                                className="h-10 rounded-lg border-slate-200 bg-white/70 backdrop-blur-sm focus:border-blue-400 focus:ring-blue-400/30 transition-all duration-300 text-sm shadow-md"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Address Information */}
                    <FormField
                      control={form.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-700 flex items-center">
                            <MapPin className="h-3 w-3 mr-1 text-blue-600" />
                            Street Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 School Street"
                              className="h-10 rounded-lg border-slate-200 bg-white/70 backdrop-blur-sm focus:border-blue-400 focus:ring-blue-400/30 transition-all duration-300 text-sm shadow-md"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-700">City</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="City"
                                className="h-10 rounded-lg border-slate-200 bg-white/70 backdrop-blur-sm focus:border-blue-400 focus:ring-blue-400/30 transition-all duration-300 text-sm shadow-md"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-700">State</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="State"
                                className="h-10 rounded-lg border-slate-200 bg-white/70 backdrop-blur-sm focus:border-blue-400 focus:ring-blue-400/30 transition-all duration-300 text-sm shadow-md"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address.zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-700">ZIP Code</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="12345"
                                className="h-10 rounded-lg border-slate-200 bg-white/70 backdrop-blur-sm focus:border-blue-400 focus:ring-blue-400/30 transition-all duration-300 text-sm shadow-md"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-700 flex items-center">
                              <Lock className="h-3 w-3 mr-1 text-blue-600" />
                              Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Create password"
                                  className="h-10 rounded-lg border-slate-200 bg-white/70 backdrop-blur-sm focus:border-blue-400 focus:ring-blue-400/30 transition-all duration-300 text-sm shadow-md pr-10"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  onClick={togglePasswordVisibility}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 transition-all duration-300 group"
                                >
                                  <div className="relative">
                                    {showPassword ? (
                                      <EyeOff className="h-4 w-4 text-slate-600 group-hover:text-blue-600 transition-all duration-300 transform group-hover:scale-110" />
                                    ) : (
                                      <Eye className="h-4 w-4 text-slate-600 group-hover:text-blue-600 transition-all duration-300 transform group-hover:scale-110" />
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

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-slate-700 flex items-center">
                              <Lock className="h-3 w-3 mr-1 text-blue-600" />
                              Confirm Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Confirm password"
                                  className="h-10 rounded-lg border-slate-200 bg-white/70 backdrop-blur-sm focus:border-blue-400 focus:ring-blue-400/30 transition-all duration-300 text-sm shadow-md pr-10"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  onClick={toggleConfirmPasswordVisibility}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 transition-all duration-300 group"
                                >
                                  <div className="relative">
                                    {showConfirmPassword ? (
                                      <EyeOff className="h-4 w-4 text-slate-600 group-hover:text-blue-600 transition-all duration-300 transform group-hover:scale-110" />
                                    ) : (
                                      <Eye className="h-4 w-4 text-slate-600 group-hover:text-blue-600 transition-all duration-300 transform group-hover:scale-110" />
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
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] text-base mt-6"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Creating Academy...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-3">
                          <School className="h-5 w-5" />
                          <span>Launch Academy</span>
                          <ChevronRight className="h-5 w-5" />
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>

                <div className="mt-6 text-center">
                  <div className="text-slate-600 text-sm">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-700 font-bold transition-colors duration-200 hover:underline"
                    >
                      Sign in here
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
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

export default RegisterPage;
