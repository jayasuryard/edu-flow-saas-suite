
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { GraduationCap, Mail, Lock, Building2, User, Phone, MapPin, Globe, ChevronRight, ChevronLeft, School, BookOpen, Star, Sparkles, Users, Award, Rocket, Target, Trophy } from 'lucide-react';

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
    "Institution Setup",
    "Location Details", 
    "Administrator Account"
  ];

  const stepDescriptions = [
    "Configure your educational institution",
    "Set your school's physical presence",
    "Create your administrative access"
  ];

  const stepIcons = [School, MapPin, User];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-950 via-indigo-900 to-blue-900">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Geometric Shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-500/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-32 left-0 w-64 h-64 bg-gradient-to-br from-teal-500/15 to-emerald-500/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating Academic Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-16 left-16 w-20 h-20 bg-white transform rotate-45 rounded-xl animate-bounce"></div>
          <div className="absolute top-32 right-24 w-16 h-16 bg-white transform rotate-12 rounded-xl animate-bounce delay-500"></div>
          <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-white transform -rotate-45 rounded-xl animate-bounce delay-1000"></div>
          <div className="absolute bottom-24 right-16 w-18 h-18 bg-white transform rotate-30 rounded-xl animate-bounce delay-1500"></div>
        </div>
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Progressive Showcase */}
        <div className="hidden lg:flex lg:w-3/5 xl:w-2/3 relative">
          {/* Multi-layered Glass Background */}
          <div className="absolute inset-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
          </div>
          <div className="absolute inset-10 bg-white/3 backdrop-blur-lg rounded-2xl border border-white/5"></div>
          
          <div className="relative p-10 xl:p-14 flex flex-col justify-center w-full">
            {/* Floating Brand with Animation */}
            <div className="mb-10 relative">
              <div className="absolute -inset-6 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 transform hover:scale-105 transition-all duration-500">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 rounded-3xl p-5 shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-700">
                      <GraduationCap className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 animate-bounce">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="ml-8">
                    <h1 className="text-6xl xl:text-7xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                      EduFlow
                    </h1>
                    <p className="text-cyan-200 text-xl font-medium">Educational Revolution</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Step Progress */}
            <div className="mb-10">
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Rocket className="h-6 w-6 text-cyan-400 mr-3" />
                  Setup Progress
                </h3>
                <div className="space-y-4">
                  {stepTitles.map((title, index) => {
                    const StepIcon = stepIcons[index];
                    return (
                      <div key={index} className="relative">
                        <div className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-500 transform ${
                          currentStep > index + 1 ? 'bg-emerald-500/20 border border-emerald-400/40 scale-95' : 
                          currentStep === index + 1 ? 'bg-white/20 backdrop-blur-sm shadow-xl border border-cyan-400/60 scale-100' : 
                          'bg-white/5 border border-white/10 scale-95'
                        }`}>
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                            currentStep > index + 1 ? 'bg-emerald-500 text-white shadow-lg' :
                            currentStep === index + 1 ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-xl animate-pulse' : 
                            'bg-white/20 text-white/60'
                          }`}>
                            {currentStep > index + 1 ? '✓' : <StepIcon className="h-5 w-5" />}
                          </div>
                          <div>
                            <h4 className={`font-bold text-base transition-colors duration-300 ${
                              currentStep >= index + 1 ? 'text-white' : 'text-white/60'
                            }`}>
                              {title}
                            </h4>
                            <p className={`text-sm transition-colors duration-300 ${
                              currentStep >= index + 1 ? 'text-cyan-200' : 'text-white/40'
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
            </div>

            {/* Feature Showcase Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 transform hover:scale-110 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl p-3">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Smart Learning</h3>
                      <p className="text-cyan-200 text-xs">AI-powered</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 transform hover:scale-110 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl p-3">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Community</h3>
                      <p className="text-cyan-200 text-xs">Connected</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 transform hover:scale-110 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl p-3">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Excellence</h3>
                      <p className="text-cyan-200 text-xs">Tracking</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 transform hover:scale-110 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl p-3">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Analytics</h3>
                      <p className="text-cyan-200 text-xs">Insights</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Multi-layered Registration Form */}
        <div className="w-full lg:w-2/5 xl:w-1/3 flex items-center justify-center p-4 relative">
          {/* Mobile Header */}
          <div className="lg:hidden absolute top-6 left-4 right-4">
            <div className="flex items-center justify-center">
              <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl p-3">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h1 className="ml-3 text-3xl font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                EduFlow
              </h1>
            </div>
          </div>

          {/* Overlapped Glass Registration Card */}
          <div className="w-full max-w-lg relative mt-20 lg:mt-0">
            {/* Multi-layer background effects */}
            <div className="absolute -inset-6 bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl blur-3xl animate-pulse"></div>
            <div className="absolute -inset-4 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl backdrop-blur-xl"></div>
            <div className="absolute -inset-2 bg-gradient-to-br from-white/10 to-transparent rounded-2xl backdrop-blur-lg"></div>
            
            <Card className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
              {/* Animated top accent */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 animate-pulse"></div>
              
              {/* Floating decorations */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full animate-bounce delay-1000"></div>
              <div className="absolute top-1/2 -right-2 w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-pulse delay-500"></div>
              
              <CardHeader className="text-center pb-4 pt-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-br from-cyan-100/20 to-blue-100/20 rounded-3xl p-5 backdrop-blur-sm border border-white/10">
                    <Building2 className="h-8 w-8 text-cyan-300" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  {stepTitles[currentStep - 1]}
                </CardTitle>
                <CardDescription className="text-cyan-200 text-lg">
                  {stepDescriptions[currentStep - 1]}
                </CardDescription>
                <div className="flex justify-center mt-4">
                  <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full px-4 py-2 backdrop-blur-sm border border-cyan-400/30">
                    <span className="text-sm font-bold text-cyan-300">
                      Step {currentStep} of 3
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Step 1: Institution Setup */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="schoolName" className="text-sm font-semibold text-cyan-100 flex items-center">
                            <School className="h-4 w-4 mr-2 text-cyan-300" />
                            Institution Name *
                          </Label>
                          <Input
                            id="schoolName"
                            name="schoolName"
                            placeholder="e.g. Greenwood Academy"
                            className="h-11 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-cyan-200 focus:border-cyan-400 focus:ring-cyan-400/30 transition-all duration-300"
                            value={formData.schoolName}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="domain" className="text-sm font-semibold text-cyan-100 flex items-center">
                            <Globe className="h-4 w-4 mr-2 text-cyan-300" />
                            Domain Identifier *
                          </Label>
                          <Input
                            id="domain"
                            name="domain"
                            placeholder="e.g. greenwood"
                            className="h-11 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-cyan-200 focus:border-cyan-400 focus:ring-cyan-400/30 transition-all duration-300"
                            value={formData.domain}
                            onChange={handleChange}
                            required
                          />
                          <p className="text-xs text-cyan-200">Your unique web identifier</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-cyan-100 flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-cyan-300" />
                              Contact Email
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="info@greenwood.edu"
                              className="h-11 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-cyan-200 focus:border-cyan-400 focus:ring-cyan-400/30 transition-all duration-300"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-semibold text-cyan-100 flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-cyan-300" />
                              Phone Number
                            </Label>
                            <Input
                              id="phone"
                              name="phone"
                              placeholder="+1 (555) 123-4567"
                              className="h-11 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-cyan-200 focus:border-cyan-400 focus:ring-cyan-400/30 transition-all duration-300"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Location Details */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="flex items-center mb-4">
                        <MapPin className="h-5 w-5 mr-2 text-cyan-300" />
                        <h3 className="text-lg font-medium text-white">Institution Address</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="address.street" className="text-sm font-medium text-cyan-100">Street Address</Label>
                          <Input
                            id="address.street"
                            name="address.street"
                            placeholder="123 Education Boulevard"
                            className="h-11 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-cyan-200 focus:border-cyan-400 focus:ring-cyan-400/30"
                            value={formData.address.street}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="address.city" className="text-sm font-medium text-cyan-100">City</Label>
                            <Input
                              id="address.city"
                              name="address.city"
                              placeholder="Springfield"
                              className="h-11 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-cyan-200 focus:border-cyan-400 focus:ring-cyan-400/30"
                              value={formData.address.city}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address.state" className="text-sm font-medium text-cyan-100">State/Province</Label>
                            <Input
                              id="address.state"
                              name="address.state"
                              placeholder="California"
                              className="h-11 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-cyan-200 focus:border-cyan-400 focus:ring-cyan-400/30"
                              value={formData.address.state}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="address.zipCode" className="text-sm font-medium text-cyan-100">Zip/Postal Code</Label>
                            <Input
                              id="address.zipCode"
                              name="address.zipCode"
                              placeholder="12345"
                              className="h-11 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-cyan-200 focus:border-cyan-400 focus:ring-cyan-400/30"
                              value={formData.address.zipCode}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address.country" className="text-sm font-medium text-cyan-100">Country</Label>
                            <Input
                              id="address.country"
                              name="address.country"
                              placeholder="United States"
                              className="h-11 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-cyan-200 focus:border-cyan-400 focus:ring-cyan-400/30"
                              value={formData.address.country}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Administrator Account */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="flex items-center mb-4">
                        <User className="h-5 w-5 mr-2 text-cyan-300" />
                        <h3 className="text-lg font-medium text-white">Administrator Setup</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="adminFirstName" className="text-sm font-medium text-cyan-100">First Name *</Label>
                            <Input
                              id="adminFirstName"
                              name="adminFirstName"
                              placeholder="John"
                              className="h-11 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-cyan-200 focus:border-cyan-400 focus:ring-cyan-400/30"
                              value={formData.adminFirstName}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="adminLastName" className="text-sm font-medium text-cyan-100">Last Name *</Label>
                            <Input
                              id="adminLastName"
                              name="adminLastName"
                              placeholder="Smith"
                              className="h-11 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-cyan-200 focus:border-cyan-400 focus:ring-cyan-400/30"
                              value={formData.adminLastName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="adminEmail" className="text-sm font-medium text-cyan-100 flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-cyan-300" />
                            Email Address *
                          </Label>
                          <Input
                            id="adminEmail"
                            name="adminEmail"
                            type="email"
                            placeholder="admin@greenwood.edu"
                            className="h-11 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-cyan-200 focus:border-cyan-400 focus:ring-cyan-400/30"
                            value={formData.adminEmail}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="adminPassword" className="text-sm font-medium text-cyan-100 flex items-center">
                            <Lock className="h-4 w-4 mr-2 text-cyan-300" />
                            Secure Password *
                          </Label>
                          <Input
                            id="adminPassword"
                            name="adminPassword"
                            type="password"
                            placeholder="Create a strong password"
                            className="h-11 rounded-xl border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-cyan-200 focus:border-cyan-400 focus:ring-cyan-400/30"
                            value={formData.adminPassword}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="px-6 py-3 h-12 border-2 border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 rounded-xl font-semibold transition-all duration-300 flex items-center backdrop-blur-sm"
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                    )}
                    
                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="ml-auto px-6 py-3 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
                      >
                        Continue Journey
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="ml-auto px-8 py-3 h-12 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Creating Your Institution...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Rocket className="h-5 w-5" />
                            <span>Launch EduFlow</span>
                          </div>
                        )}
                      </Button>
                    )}
                  </div>
                </form>

                <div className="mt-8 text-center">
                  <div className="text-cyan-200 text-sm">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors duration-200 hover:underline"
                    >
                      Access your dashboard
                    </Link>
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

export default RegisterPage;
