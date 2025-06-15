
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  GraduationCap, Mail, Lock, Building2, User, Phone, MapPin, Globe, ChevronRight, 
  ChevronLeft, School, BookOpen, Star, Sparkles, Users, Award, Book, Apple, 
  Calculator, Microscope, Trophy, PenTool, Lightbulb, Ruler, Palette 
} from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    schoolName: '',
    domain: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.schoolName || !formData.domain || !formData.adminEmail || !formData.adminPassword) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    const registerData = {
      firstName: formData.adminFirstName,
      lastName: formData.adminLastName,
      email: formData.adminEmail,
      password: formData.adminPassword,
      tenantDomain: formData.domain,
      schoolName: formData.schoolName,
      domain: formData.domain,
      phone: formData.phone,
      address: formData.address,
      adminFirstName: formData.adminFirstName,
      adminLastName: formData.adminLastName,
      adminEmail: formData.adminEmail,
      adminPassword: formData.adminPassword,
    };

    const success = await register(registerData);
    setIsLoading(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 relative overflow-hidden">
      {/* Enhanced School-themed Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Academic Elements */}
        <div className="absolute top-8 left-6 transform -rotate-12 animate-bounce">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-emerald-200/50">
            <Building2 className="h-10 w-10 text-emerald-600" />
            <div className="mt-2 w-8 h-1 bg-emerald-400 rounded"></div>
          </div>
        </div>
        
        <div className="absolute top-20 right-10 transform rotate-12 animate-pulse">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full p-4 shadow-xl">
            <Apple className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Academic Tools Cluster */}
        <div className="absolute top-1/3 left-8 space-y-4">
          <div className="bg-purple-500/20 backdrop-blur-sm rounded-xl p-3 shadow-lg transform rotate-6 animate-pulse">
            <Calculator className="h-6 w-6 text-purple-700" />
          </div>
          <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-3 shadow-lg transform -rotate-6 animate-pulse" style={{ animationDelay: '1s' }}>
            <Ruler className="h-6 w-6 text-blue-700" />
          </div>
        </div>

        {/* Science Equipment */}
        <div className="absolute bottom-1/4 right-12 transform rotate-12 animate-float">
          <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-red-300/30">
            <Microscope className="h-10 w-10 text-red-700" />
          </div>
        </div>

        {/* Art Supplies */}
        <div className="absolute bottom-20 left-20 transform -rotate-6 animate-bounce" style={{ animationDelay: '2s' }}>
          <div className="bg-pink-500/20 backdrop-blur-sm rounded-xl p-3 shadow-lg">
            <Palette className="h-8 w-8 text-pink-700" />
          </div>
        </div>

        {/* Floating Books Stack */}
        <div className="absolute top-1/2 right-1/4 transform rotate-3 animate-float">
          <div className="space-y-1">
            <div className="bg-green-500/30 rounded-lg p-2 shadow-lg">
              <Book className="h-6 w-6 text-green-700" />
            </div>
            <div className="bg-blue-500/30 rounded-lg p-2 shadow-lg ml-2">
              <BookOpen className="h-6 w-6 text-blue-700" />
            </div>
            <div className="bg-red-500/30 rounded-lg p-2 shadow-lg">
              <Book className="h-6 w-6 text-red-700" />
            </div>
          </div>
        </div>

        {/* Academic Achievement Badges */}
        <div className="absolute top-16 left-1/3 space-x-2 flex">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full p-2 shadow-xl animate-pulse">
            <Trophy className="h-5 w-5 text-yellow-800" />
          </div>
          <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full p-2 shadow-xl animate-pulse" style={{ animationDelay: '1s' }}>
            <Award className="h-5 w-5 text-emerald-800" />
          </div>
        </div>

        {/* Paper Texture and Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.1),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Enhanced School-themed Branding */}
        <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 relative">
          <div className="flex flex-col justify-center px-8 xl:px-10 py-6 w-full">
            {/* Enhanced Brand Header */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-4 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                    <GraduationCap className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-2 animate-spin" style={{ animationDuration: '4s' }}>
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 bg-blue-500 rounded-full p-1">
                    <Lightbulb className="h-4 w-4 text-white animate-pulse" />
                  </div>
                </div>
                <div className="ml-6">
                  <h1 className="text-5xl xl:text-6xl font-bold bg-gradient-to-r from-emerald-800 to-teal-900 bg-clip-text text-transparent">
                    EduFlow
                  </h1>
                  <p className="text-slate-600 text-xl font-semibold flex items-center mt-2">
                    <PenTool className="h-5 w-5 mr-3 text-emerald-600" />
                    Educational Excellence Platform
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl xl:text-5xl font-bold text-slate-800 leading-tight">
                  Build Your School's
                  <span className="block bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                    Digital Academy
                  </span>
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                  Join thousands of educational institutions creating their digital transformation story.
                </p>
              </div>
            </div>

            {/* Enhanced Step Indicator with School Theme */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <Star className="h-6 w-6 text-yellow-500 mr-3" />
                Foundation Progress
              </h3>
              <div className="space-y-4">
                {stepTitles.map((title, index) => {
                  const StepIcon = stepIcons[index];
                  return (
                    <div key={index} className="relative">
                      <div className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-500 ${
                        currentStep > index + 1 ? 'bg-emerald-100/70 border-2 border-emerald-300 shadow-lg' : 
                        currentStep === index + 1 ? 'bg-white/90 backdrop-blur-sm shadow-2xl border-2 border-emerald-400 scale-105' : 
                        'bg-white/40 border-2 border-slate-200 hover:bg-white/60'
                      }`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                          currentStep > index + 1 ? 'bg-emerald-500 text-white shadow-lg' :
                          currentStep === index + 1 ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl scale-110' : 
                          'bg-slate-200 text-slate-500'
                        }`}>
                          {currentStep > index + 1 ? '✓' : <StepIcon className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold text-base transition-colors ${
                            currentStep >= index + 1 ? 'text-slate-800' : 'text-slate-500'
                          }`}>
                            {title}
                          </h4>
                          <p className={`text-sm transition-colors ${
                            currentStep >= index + 1 ? 'text-slate-600' : 'text-slate-400'
                          }`}>
                            {stepDescriptions[index]}
                          </p>
                        </div>
                        {currentStep === index + 1 && (
                          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                            <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Benefits with School Icons */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-slate-800 flex items-center">
                <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                Why Choose EduFlow?
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 transform hover:scale-105 group">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full group-hover:scale-125 transition-transform"></div>
                    <span className="text-slate-700 font-semibold">🏫 Complete School Management</span>
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 ml-6 transform hover:scale-105 group">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full group-hover:scale-125 transition-transform"></div>
                    <span className="text-slate-700 font-semibold">📚 Smart Academic Tracking</span>
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 transform hover:scale-105 group">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full group-hover:scale-125 transition-transform"></div>
                    <span className="text-slate-700 font-semibold">📊 Real-time Analytics Dashboard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Enhanced Registration Form */}
        <div className="w-full lg:w-3/5 xl:w-1/2 flex items-center justify-center p-3 sm:p-6">
          <div className="w-full max-w-2xl">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-3 shadow-xl">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h1 className="ml-3 text-3xl font-bold bg-gradient-to-r from-emerald-800 to-teal-900 bg-clip-text text-transparent">
                  EduFlow
                </h1>
              </div>
            </div>

            {/* Enhanced Registration Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl transform rotate-2 scale-105 opacity-10"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-emerald-600 rounded-3xl transform -rotate-1 scale-102 opacity-5"></div>
              
              {/* Floating Academic Decorations */}
              <div className="absolute -top-6 -right-6 bg-yellow-400 rounded-full p-3 shadow-xl animate-bounce">
                <Apple className="h-6 w-6 text-yellow-800" />
              </div>
              <div className="absolute -top-4 left-6 bg-green-500 rounded-full p-2 shadow-lg animate-pulse">
                <Book className="h-4 w-4 text-white" />
              </div>
              
              <Card className="relative bg-white/90 backdrop-blur-xl shadow-2xl border-0 rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
                
                <CardHeader className="text-center pb-6 pt-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl p-4 shadow-xl">
                      {React.createElement(stepIcons[currentStep - 1], { className: "h-8 w-8 text-emerald-600" })}
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-slate-800 mb-2">
                    {stepTitles[currentStep - 1]}
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-lg">
                    {stepDescriptions[currentStep - 1]}
                  </CardDescription>
                  <div className="flex justify-center mt-4">
                    <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full px-4 py-2 shadow-lg">
                      <span className="text-sm font-bold text-emerald-700 flex items-center">
                        <Star className="h-4 w-4 mr-2" />
                        Step {currentStep} of 3
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="px-8 pb-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Enhanced School Info */}
                    {currentStep === 1 && (
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-3">
                            <Label htmlFor="schoolName" className="text-sm font-bold text-slate-700 flex items-center">
                              <School className="h-4 w-4 mr-2 text-emerald-600" />
                              School Name *
                            </Label>
                            <Input
                              id="schoolName"
                              name="schoolName"
                              placeholder="e.g. Greenwood Academy"
                              className="h-12 rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm focus:border-emerald-400 focus:ring-emerald-400/30 transition-all duration-300 shadow-lg"
                              value={formData.schoolName}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="domain" className="text-sm font-bold text-slate-700 flex items-center">
                              <Globe className="h-4 w-4 mr-2 text-emerald-600" />
                              School Domain *
                            </Label>
                            <Input
                              id="domain"
                              name="domain"
                              placeholder="e.g. greenwood"
                              className="h-12 rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm focus:border-emerald-400 focus:ring-emerald-400/30 transition-all duration-300 shadow-lg"
                              value={formData.domain}
                              onChange={handleChange}
                              required
                            />
                            <p className="text-xs text-slate-500 flex items-center">
                              <Globe className="h-3 w-3 mr-1" />
                              Your school's unique web address
                            </p>
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="email" className="text-sm font-bold text-slate-700 flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-emerald-600" />
                              School Email
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="info@greenwood.edu"
                              className="h-12 rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm focus:border-emerald-400 focus:ring-emerald-400/30 transition-all duration-300 shadow-lg"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="phone" className="text-sm font-bold text-slate-700 flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-emerald-600" />
                              Phone Number
                            </Label>
                            <Input
                              id="phone"
                              name="phone"
                              placeholder="+1 (555) 123-4567"
                              className="h-12 rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm focus:border-emerald-400 focus:ring-emerald-400/30 transition-all duration-300 shadow-lg"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Enhanced Address Details */}
                    {currentStep === 2 && (
                      <div className="space-y-5">
                        <div className="flex items-center mb-4 bg-emerald-50 rounded-xl p-3">
                          <MapPin className="h-5 w-5 mr-3 text-emerald-600" />
                          <h3 className="text-lg font-bold text-gray-900">Campus Address Information</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-3">
                            <Label htmlFor="address.street" className="text-sm font-bold text-gray-700">Street Address</Label>
                            <Input
                              id="address.street"
                              name="address.street"
                              placeholder="123 Education Boulevard"
                              className="h-12 rounded-xl border-gray-300 bg-white/80 focus:border-emerald-500 focus:ring-emerald-500/30 shadow-lg"
                              value={formData.address.street}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <Label htmlFor="address.city" className="text-sm font-bold text-gray-700">City</Label>
                              <Input
                                id="address.city"
                                name="address.city"
                                placeholder="Springfield"
                                className="h-12 rounded-xl border-gray-300 bg-white/80 focus:border-emerald-500 focus:ring-emerald-500/30 shadow-lg"
                                value={formData.address.city}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="space-y-3">
                              <Label htmlFor="address.state" className="text-sm font-bold text-gray-700">State/Province</Label>
                              <Input
                                id="address.state"
                                name="address.state"
                                placeholder="California"
                                className="h-12 rounded-xl border-gray-300 bg-white/80 focus:border-emerald-500 focus:ring-emerald-500/30 shadow-lg"
                                value={formData.address.state}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <Label htmlFor="address.zipCode" className="text-sm font-bold text-gray-700">Zip/Postal Code</Label>
                              <Input
                                id="address.zipCode"
                                name="address.zipCode"
                                placeholder="12345"
                                className="h-12 rounded-xl border-gray-300 bg-white/80 focus:border-emerald-500 focus:ring-emerald-500/30 shadow-lg"
                                value={formData.address.zipCode}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="space-y-3">
                              <Label htmlFor="address.country" className="text-sm font-bold text-gray-700">Country</Label>
                              <Input
                                id="address.country"
                                name="address.country"
                                placeholder="United States"
                                className="h-12 rounded-xl border-gray-300 bg-white/80 focus:border-emerald-500 focus:ring-emerald-500/30 shadow-lg"
                                value={formData.address.country}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Enhanced Admin Account */}
                    {currentStep === 3 && (
                      <div className="space-y-5">
                        <div className="flex items-center mb-4 bg-blue-50 rounded-xl p-3">
                          <User className="h-5 w-5 mr-3 text-blue-600" />
                          <h3 className="text-lg font-bold text-gray-900">Administrator Profile Setup</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <Label htmlFor="adminFirstName" className="text-sm font-bold text-gray-700">First Name *</Label>
                            <Input
                              id="adminFirstName"
                              name="adminFirstName"
                              placeholder="John"
                              className="h-12 rounded-xl border-gray-300 bg-white/80 focus:border-emerald-500 focus:ring-emerald-500/30 shadow-lg"
                              value={formData.adminFirstName}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="adminLastName" className="text-sm font-bold text-gray-700">Last Name *</Label>
                            <Input
                              id="adminLastName"
                              name="adminLastName"
                              placeholder="Smith"
                              className="h-12 rounded-xl border-gray-300 bg-white/80 focus:border-emerald-500 focus:ring-emerald-500/30 shadow-lg"
                              value={formData.adminLastName}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="adminEmail" className="text-sm font-bold text-gray-700 flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-gray-500" />
                              Email Address *
                            </Label>
                            <Input
                              id="adminEmail"
                              name="adminEmail"
                              type="email"
                              placeholder="admin@greenwood.edu"
                              className="h-12 rounded-xl border-gray-300 bg-white/80 focus:border-emerald-500 focus:ring-emerald-500/30 shadow-lg"
                              value={formData.adminEmail}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="adminPassword" className="text-sm font-bold text-gray-700 flex items-center">
                              <Lock className="h-4 w-4 mr-2 text-gray-500" />
                              Password *
                            </Label>
                            <Input
                              id="adminPassword"
                              name="adminPassword"
                              type="password"
                              placeholder="Create a strong password"
                              className="h-12 rounded-xl border-gray-300 bg-white/80 focus:border-emerald-500 focus:ring-emerald-500/30 shadow-lg"
                              value={formData.adminPassword}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Navigation Buttons */}
                    <div className="flex justify-between pt-8">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          className="px-8 py-3 h-12 border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl font-bold transition-all duration-300 flex items-center shadow-lg"
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Previous Step
                        </Button>
                      )}
                      
                      {currentStep < 3 ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="ml-auto px-8 py-3 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center"
                        >
                          Continue Setup
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="ml-auto px-8 py-3 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center space-x-3">
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Building Your School...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <School className="h-5 w-5" />
                              <span>Launch Your Academy</span>
                            </div>
                          )}
                        </Button>
                      )}
                    </div>
                  </form>

                  <div className="mt-8 text-center">
                    <div className="text-slate-600">
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
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(3deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
