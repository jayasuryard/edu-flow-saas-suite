
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
  GraduationCap, Mail, Lock, Building2, User, Phone, MapPin, Globe, ChevronRight, 
  ChevronLeft, School, BookOpen, Star, Sparkles, Users, Award, Book, Apple, 
  Calculator, Microscope, Trophy, PenTool, Lightbulb, Ruler, Palette, Eye, EyeOff 
} from 'lucide-react';

const registrationSchema = z.object({
  schoolName: z.string().min(2, 'School name must be at least 2 characters'),
  domain: z.string().min(2, 'Domain must be at least 2 characters').regex(/^[a-zA-Z0-9-]+$/, 'Domain can only contain letters, numbers, and hyphens'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number').optional().or(z.literal('')),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().regex(/^[0-9]{5}(-[0-9]{4})?$/, 'Please enter a valid zip code').optional().or(z.literal('')),
  country: z.string().optional(),
  adminFirstName: z.string().min(2, 'First name must be at least 2 characters'),
  adminLastName: z.string().min(2, 'Last name must be at least 2 characters'),
  adminEmail: z.string().email('Please enter a valid email address'),
  adminPassword: z.string().min(8, 'Password must be at least 8 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      schoolName: '',
      domain: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      adminFirstName: '',
      adminLastName: '',
      adminEmail: '',
      adminPassword: ''
    }
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);
    
    const registerData = {
      firstName: data.adminFirstName,
      lastName: data.adminLastName,
      email: data.adminEmail,
      password: data.adminPassword,
      tenantDomain: data.domain,
      schoolName: data.schoolName,
      domain: data.domain,
      phone: data.phone,
      address: {
        street: data.street || '',
        city: data.city || '',
        state: data.state || '',
        zipCode: data.zipCode || '',
        country: data.country || ''
      },
      adminFirstName: data.adminFirstName,
      adminLastName: data.adminLastName,
      adminEmail: data.adminEmail,
      adminPassword: data.adminPassword,
    };

    const success = await register(registerData);
    setIsLoading(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  const nextStep = () => {
    const currentStepFields = getCurrentStepFields();
    form.trigger(currentStepFields).then((isValid) => {
      if (isValid && currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    });
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getCurrentStepFields = (): (keyof RegistrationFormData)[] => {
    switch (currentStep) {
      case 1:
        return ['schoolName', 'domain'];
      case 2:
        return [];
      case 3:
        return ['adminFirstName', 'adminLastName', 'adminEmail', 'adminPassword'];
      default:
        return [];
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const stepTitles = [
    "School Foundation",
    "Campus Location", 
    "Administrator Profile"
  ];

  const stepDescriptions = [
    "Establish your educational institution's digital presence",
    "Map your school's physical location and contact details",
    "Create your administrative access and leadership profile"
  ];

  const stepIcons = [School, MapPin, User];

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 relative overflow-hidden">
      {/* Enhanced School-themed Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Academic Elements - Responsive */}
        <div className="absolute top-4 sm:top-8 left-3 sm:left-6 transform -rotate-12 animate-bounce">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-xl sm:shadow-2xl border border-emerald-200/50">
            <Building2 className="h-6 w-6 sm:h-10 sm:w-10 text-emerald-600" />
          </div>
        </div>
        
        <div className="absolute top-12 sm:top-20 right-6 sm:right-10 transform rotate-12 animate-pulse">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full p-2 sm:p-4 shadow-lg sm:shadow-xl">
            <Apple className="h-4 w-4 sm:h-8 sm:w-8 text-white" />
          </div>
        </div>

        {/* Academic Tools Cluster - Hidden on mobile for cleaner look */}
        <div className="hidden sm:block absolute top-1/3 left-8 space-y-4">
          <div className="bg-purple-500/20 backdrop-blur-sm rounded-xl p-3 shadow-lg transform rotate-6 animate-pulse">
            <Calculator className="h-6 w-6 text-purple-700" />
          </div>
        </div>

        {/* Science Equipment - Positioned for mobile */}
        <div className="absolute bottom-16 sm:bottom-1/4 right-6 sm:right-12 transform rotate-12 animate-float">
          <div className="bg-red-500/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-lg sm:shadow-xl border border-red-300/30">
            <Microscope className="h-6 w-6 sm:h-10 sm:w-10 text-red-700" />
          </div>
        </div>

        {/* Floating Books Stack - Responsive positioning */}
        <div className="absolute top-1/2 right-1/4 transform rotate-3 animate-float hidden lg:block">
          <div className="space-y-1">
            <div className="bg-green-500/30 rounded-lg p-2 shadow-lg">
              <Book className="h-6 w-6 text-green-700" />
            </div>
            <div className="bg-blue-500/30 rounded-lg p-2 shadow-lg ml-2">
              <BookOpen className="h-6 w-6 text-blue-700" />
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px] sm:bg-[size:80px_80px]"></div>
      </div>

      <div className="relative z-10 flex h-full">
        {/* Left Side - Enhanced School-themed Branding - Hidden on mobile to save space */}
        <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 relative">
          <div className="flex flex-col justify-center px-6 xl:px-8 py-4 w-full">
            {/* Enhanced Brand Header */}
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="relative">
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-4 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                    <GraduationCap className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-2 animate-spin" style={{ animationDuration: '4s' }}>
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-6">
                  <h1 className="text-4xl xl:text-5xl font-bold bg-gradient-to-r from-emerald-800 to-teal-900 bg-clip-text text-transparent">
                    EduFlow
                  </h1>
                  <p className="text-slate-600 text-lg font-semibold flex items-center mt-2">
                    <PenTool className="h-5 w-5 mr-3 text-emerald-600" />
                    Educational Excellence Platform
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-3xl xl:text-4xl font-bold text-slate-800 leading-tight">
                  Build Your School's
                  <span className="block bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                    Digital Academy
                  </span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                  Join thousands of educational institutions creating their digital transformation story.
                </p>
              </div>
            </div>

            {/* Enhanced Step Indicator */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                Foundation Progress
              </h3>
              <div className="space-y-3">
                {stepTitles.map((title, index) => {
                  const StepIcon = stepIcons[index];
                  return (
                    <div key={index} className="relative">
                      <div className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-500 ${
                        currentStep > index + 1 ? 'bg-emerald-100/70 border-2 border-emerald-300 shadow-lg' : 
                        currentStep === index + 1 ? 'bg-white/90 backdrop-blur-sm shadow-xl border-2 border-emerald-400 scale-105' : 
                        'bg-white/40 border-2 border-slate-200'
                      }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                          currentStep > index + 1 ? 'bg-emerald-500 text-white shadow-lg' :
                          currentStep === index + 1 ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl' : 
                          'bg-slate-200 text-slate-500'
                        }`}>
                          {currentStep > index + 1 ? '✓' : <StepIcon className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold text-sm transition-colors ${
                            currentStep >= index + 1 ? 'text-slate-800' : 'text-slate-500'
                          }`}>
                            {title}
                          </h4>
                          <p className={`text-xs transition-colors ${
                            currentStep >= index + 1 ? 'text-slate-600' : 'text-slate-400'
                          }`}>
                            {stepDescriptions[index]}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <h4 className="text-base font-bold text-slate-800 flex items-center">
                <Trophy className="h-4 w-4 text-yellow-500 mr-2" />
                Why Choose EduFlow?
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50">
                  <span className="text-slate-700 font-medium text-sm">🏫 Complete School Management</span>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50">
                  <span className="text-slate-700 font-medium text-sm">📚 Smart Academic Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Enhanced Registration Form */}
        <div className="w-full lg:w-3/5 xl:w-1/2 flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-xl h-full flex flex-col justify-center">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-4">
              <div className="flex items-center justify-center mb-3">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-3 shadow-xl">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-emerald-800 to-teal-900 bg-clip-text text-transparent">
                  EduFlow
                </h1>
              </div>
              {/* Mobile Step Indicator */}
              <div className="flex justify-center space-x-2 mb-4">
                {stepTitles.map((_, index) => (
                  <div key={index} className={`w-8 h-2 rounded-full transition-all duration-300 ${
                    currentStep > index + 1 ? 'bg-emerald-500' :
                    currentStep === index + 1 ? 'bg-emerald-400' : 'bg-slate-200'
                  }`} />
                ))}
              </div>
            </div>

            {/* Enhanced Registration Card */}
            <div className="relative flex-1 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl sm:rounded-3xl transform rotate-1 scale-105 opacity-10"></div>
              
              <Card className="relative bg-white/90 backdrop-blur-xl shadow-2xl border-0 rounded-2xl sm:rounded-3xl overflow-hidden w-full max-h-[90vh] flex flex-col">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
                
                <CardHeader className="text-center pb-4 pt-6 px-4 sm:px-6 flex-shrink-0">
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl p-3 shadow-lg">
                      {React.createElement(stepIcons[currentStep - 1], { className: "h-6 w-6 text-emerald-600" })}
                    </div>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
                    {stepTitles[currentStep - 1]}
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-sm sm:text-base">
                    {stepDescriptions[currentStep - 1]}
                  </CardDescription>
                  <div className="flex justify-center mt-3">
                    <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full px-3 py-1 shadow-md">
                      <span className="text-xs font-bold text-emerald-700 flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        Step {currentStep} of 3
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="px-4 sm:px-6 pb-6 flex-1 overflow-y-auto">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      {/* Step 1: Enhanced School Info */}
                      {currentStep === 1 && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="schoolName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-bold text-slate-700 flex items-center">
                                    <School className="h-4 w-4 mr-2 text-emerald-600" />
                                    School Name *
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g. Greenwood Academy"
                                      className="h-10 rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm focus:border-emerald-400 focus:ring-emerald-400/30 transition-all duration-300 shadow-md"
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
                                  <FormLabel className="text-sm font-bold text-slate-700 flex items-center">
                                    <Globe className="h-4 w-4 mr-2 text-emerald-600" />
                                    School Domain *
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g. greenwood"
                                      className="h-10 rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm focus:border-emerald-400 focus:ring-emerald-400/30 transition-all duration-300 shadow-md"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-bold text-slate-700 flex items-center">
                                    <Mail className="h-4 w-4 mr-2 text-emerald-600" />
                                    School Email
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="info@greenwood.edu"
                                      className="h-10 rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm focus:border-emerald-400 focus:ring-emerald-400/30 transition-all duration-300 shadow-md"
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
                                  <FormLabel className="text-sm font-bold text-slate-700 flex items-center">
                                    <Phone className="h-4 w-4 mr-2 text-emerald-600" />
                                    Phone Number
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="+1 (555) 123-4567"
                                      className="h-10 rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm focus:border-emerald-400 focus:ring-emerald-400/30 transition-all duration-300 shadow-md"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 2: Enhanced Address Details */}
                      {currentStep === 2 && (
                        <div className="space-y-4">
                          <div className="flex items-center mb-3 bg-emerald-50 rounded-xl p-3">
                            <MapPin className="h-4 w-4 mr-2 text-emerald-600" />
                            <h3 className="text-base font-bold text-gray-900">Campus Address Information</h3>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            <FormField
                              control={form.control}
                              name="street"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-bold text-gray-700">Street Address</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="123 Education Boulevard"
                                      className="h-10 rounded-xl border-gray-300 bg-white/80 focus:border-emerald-500 focus:ring-emerald-500/30 shadow-md"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-2 gap-3">
                              <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-bold text-gray-700">City</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Springfield"
                                        className="h-10 rounded-xl border-gray-300 bg-white/80 focus:border-emerald-500 focus:ring-emerald-500/30 shadow-md"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-bold text-gray-700">State</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="California"
                                        className="h-10 rounded-xl border-gray-300 bg-white/80 focus:border-emerald-500 focus:ring-emerald-500/30 shadow-md"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <FormField
                                control={form.control}
                                name="zipCode"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-bold text-gray-700">Zip Code</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="12345"
                                        className="h-10 rounded-xl border-gray-300 bg-white/80 focus:border-emerald-500 focus:ring-emerald-500/30 shadow-md"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-bold text-gray-700">Country</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="United States"
                                        className="h-10 rounded-xl border-gray-300 bg-white/80 focus:border-emerald-500 focus:ring-emerald-500/30 shadow-md"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Enhanced Admin Account */}
                      {currentStep === 3 && (
                        <div className="space-y-4">
                          <div className="flex items-center mb-3 bg-blue-50 rounded-xl p-3">
                            <User className="h-4 w-4 mr-2 text-blue-600" />
                            <h3 className="text-base font-bold text-gray-900">Administrator Profile Setup</h3>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <FormField
                              control={form.control}
                              name="adminFirstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-bold text-gray-700">First Name *</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="John"
                                      className="h-10 rounded-xl border-gray-300 bg-white/80 focus:border-emerald-500 focus:ring-emerald-500/30 shadow-md"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="adminLastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-bold text-gray-700">Last Name *</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Smith"
                                      className="h-10 rounded-xl border-gray-300 bg-white/80 focus:border-emerald-500 focus:ring-emerald-500/30 shadow-md"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="adminEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-bold text-gray-700 flex items-center">
                                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                                    Email Address *
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="admin@greenwood.edu"
                                      className="h-10 rounded-xl border-gray-300 bg-white/80 focus:border-emerald-500 focus:ring-emerald-500/30 shadow-md"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="adminPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-bold text-gray-700 flex items-center">
                                    <Lock className="h-4 w-4 mr-2 text-gray-500" />
                                    Password *
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        className="h-10 rounded-xl border-gray-300 bg-white/80 focus:border-emerald-500 focus:ring-emerald-500/30 shadow-md pr-12"
                                        {...field}
                                      />
                                      <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 transition-all duration-300 group"
                                      >
                                        <div className="relative">
                                          {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-slate-600 group-hover:text-emerald-600 transition-all duration-300 transform group-hover:scale-110" />
                                          ) : (
                                            <Eye className="h-4 w-4 text-slate-600 group-hover:text-emerald-600 transition-all duration-300 transform group-hover:scale-110" />
                                          )}
                                          <div className="absolute inset-0 bg-emerald-400/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                                        </div>
                                      </button>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {/* Enhanced Navigation Buttons */}
                      <div className="flex justify-between pt-4 flex-shrink-0">
                        {currentStep > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            className="px-4 py-2 h-10 border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl font-bold transition-all duration-300 flex items-center shadow-md text-sm"
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                          </Button>
                        )}
                        
                        {currentStep < 3 ? (
                          <Button
                            type="button"
                            onClick={nextStep}
                            className="ml-auto px-4 py-2 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center text-sm"
                          >
                            Continue
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            className="ml-auto px-4 py-2 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Building...</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1">
                                <School className="h-4 w-4" />
                                <span>Launch Academy</span>
                              </div>
                            )}
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>

                  <div className="mt-6 text-center flex-shrink-0">
                    <div className="text-slate-600 text-sm">
                      Already have a school account?{' '}
                      <Link
                        to="/login"
                        className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors duration-200 hover:underline"
                      >
                        🏫 Sign in to your campus
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Custom CSS for school animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(3deg); }
            50% { transform: translateY(-15px) rotate(3deg); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default RegisterPage;
