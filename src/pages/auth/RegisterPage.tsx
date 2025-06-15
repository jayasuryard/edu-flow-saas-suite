import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { GraduationCap, Mail, Lock, Building2, User, Phone, MapPin, Globe, ChevronRight, ChevronLeft, School, BookOpen, Star, Sparkles, Users, Award } from 'lucide-react';

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
    "School Details",
    "Location & Contact", 
    "Administrator Setup"
  ];

  const stepDescriptions = [
    "Tell us about your educational institution",
    "Where can we find your school?",
    "Create your admin account to get started"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated floating shapes */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-emerald-200/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-32 right-16 w-56 h-56 bg-teal-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-cyan-200/25 rounded-full blur-3xl"></div>
        <div className="absolute bottom-16 right-8 w-48 h-48 bg-emerald-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        
        {/* Floating icons */}
        <div className="absolute top-20 left-1/4 text-emerald-200/40">
          <BookOpen className="h-8 w-8 animate-pulse" />
        </div>
        <div className="absolute top-60 right-1/4 text-teal-200/40">
          <Award className="h-6 w-6 animate-pulse delay-700" />
        </div>
        <div className="absolute bottom-32 left-1/6 text-cyan-200/40">
          <Users className="h-10 w-10 animate-pulse delay-300" />
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Enhanced Branding */}
        <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 relative">
          <div className="flex flex-col justify-center px-12 xl:px-16 py-20 w-full">
            {/* Brand Header */}
            <div className="mb-12">
              <div className="flex items-center mb-8">
                <div className="relative">
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-4 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                    <GraduationCap className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-2 animate-pulse">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-6">
                  <h1 className="text-5xl xl:text-6xl font-bold bg-gradient-to-r from-emerald-800 to-teal-900 bg-clip-text text-transparent">
                    EduFlow
                  </h1>
                  <p className="text-slate-600 text-lg font-medium">School Management Platform</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-4xl xl:text-5xl font-bold text-slate-800 leading-tight">
                  Transform Your School's
                  <span className="block bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                    Digital Future
                  </span>
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                  Join thousands of educational institutions revolutionizing their management systems with our comprehensive platform.
                </p>
              </div>
            </div>

            {/* Enhanced Step Indicator */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <Star className="h-6 w-6 text-yellow-500 mr-2" />
                Setup Progress
              </h3>
              <div className="space-y-4">
                {stepTitles.map((title, index) => (
                  <div key={index} className="relative">
                    <div className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 ${
                      currentStep > index + 1 ? 'bg-emerald-100/50 border border-emerald-200' : 
                      currentStep === index + 1 ? 'bg-white/80 backdrop-blur-sm shadow-lg border border-emerald-300' : 
                      'bg-white/30 border border-slate-200'
                    }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        currentStep > index + 1 ? 'bg-emerald-500 text-white' :
                        currentStep === index + 1 ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 
                        'bg-slate-200 text-slate-500'
                      }`}>
                        {currentStep > index + 1 ? '✓' : index + 1}
                      </div>
                      <div>
                        <h4 className={`font-semibold transition-colors ${
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
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits with overlapping design */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 transform hover:scale-105">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div>
                  <span className="text-slate-700 font-medium">Streamlined Administration</span>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 ml-6 transform hover:scale-105">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full"></div>
                  <span className="text-slate-700 font-medium">Enhanced Communication</span>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 transform hover:scale-105">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full"></div>
                  <span className="text-slate-700 font-medium">Real-time Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-3/5 xl:w-1/2 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-2xl">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-3">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h1 className="ml-3 text-3xl font-bold bg-gradient-to-r from-emerald-800 to-teal-900 bg-clip-text text-transparent">
                  EduFlow
                </h1>
              </div>
            </div>

            {/* Registration Card with overlapping design */}
            <div className="relative">
              {/* Background cards for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl transform rotate-1 scale-105 opacity-10"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-emerald-600 rounded-3xl transform -rotate-1 scale-102 opacity-5"></div>
              
              <Card className="relative bg-white/85 backdrop-blur-xl shadow-2xl border-0 rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
                
                <CardHeader className="text-center pb-6 pt-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl p-4">
                      <Building2 className="h-8 w-8 text-emerald-600" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-slate-800 mb-2">
                    {stepTitles[currentStep - 1]}
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-lg">
                    {stepDescriptions[currentStep - 1]}
                  </CardDescription>
                  <div className="flex justify-center mt-4">
                    <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full px-4 py-2">
                      <span className="text-sm font-semibold text-emerald-700">
                        Step {currentStep} of 3
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="px-8 pb-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Enhanced School Info */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="schoolName" className="text-sm font-semibold text-slate-700 flex items-center">
                              <School className="h-4 w-4 mr-2 text-emerald-600" />
                              School Name *
                            </Label>
                            <Input
                              id="schoolName"
                              name="schoolName"
                              placeholder="e.g. Greenwood Academy"
                              className="h-12 rounded-xl border-slate-200 bg-white/70 backdrop-blur-sm focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300"
                              value={formData.schoolName}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="domain" className="text-sm font-semibold text-slate-700 flex items-center">
                              <Globe className="h-4 w-4 mr-2 text-emerald-600" />
                              School Domain *
                            </Label>
                            <Input
                              id="domain"
                              name="domain"
                              placeholder="e.g. greenwood"
                              className="h-12 rounded-xl border-slate-200 bg-white/70 backdrop-blur-sm focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300"
                              value={formData.domain}
                              onChange={handleChange}
                              required
                            />
                            <p className="text-xs text-slate-500 font-medium">Your school's unique web address</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700 flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-emerald-600" />
                              School Email
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="info@greenwood.edu"
                              className="h-12 rounded-xl border-slate-200 bg-white/70 backdrop-blur-sm focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-emerald-600" />
                              Phone Number
                            </Label>
                            <Input
                              id="phone"
                              name="phone"
                              placeholder="+1 (555) 123-4567"
                              className="h-12 rounded-xl border-slate-200 bg-white/70 backdrop-blur-sm focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-300"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Address Details */}
                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <div className="flex items-center mb-4">
                          <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                          <h3 className="text-lg font-medium text-gray-900">School Address</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="address.street" className="text-sm font-medium text-gray-700">Street Address</Label>
                            <Input
                              id="address.street"
                              name="address.street"
                              placeholder="123 Education Street"
                              className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                              value={formData.address.street}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="address.city" className="text-sm font-medium text-gray-700">City</Label>
                              <Input
                                id="address.city"
                                name="address.city"
                                placeholder="Springfield"
                                className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                                value={formData.address.city}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="address.state" className="text-sm font-medium text-gray-700">State/Province</Label>
                              <Input
                                id="address.state"
                                name="address.state"
                                placeholder="California"
                                className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                                value={formData.address.state}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="address.zipCode" className="text-sm font-medium text-gray-700">Zip/Postal Code</Label>
                              <Input
                                id="address.zipCode"
                                name="address.zipCode"
                                placeholder="12345"
                                className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                                value={formData.address.zipCode}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="address.country" className="text-sm font-medium text-gray-700">Country</Label>
                              <Input
                                id="address.country"
                                name="address.country"
                                placeholder="United States"
                                className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                                value={formData.address.country}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Admin Account */}
                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <div className="flex items-center mb-4">
                          <User className="h-5 w-5 mr-2 text-emerald-600" />
                          <h3 className="text-lg font-medium text-gray-900">Administrator Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="adminFirstName" className="text-sm font-medium text-gray-700">First Name *</Label>
                            <Input
                              id="adminFirstName"
                              name="adminFirstName"
                              placeholder="John"
                              className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                              value={formData.adminFirstName}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="adminLastName" className="text-sm font-medium text-gray-700">Last Name *</Label>
                            <Input
                              id="adminLastName"
                              name="adminLastName"
                              placeholder="Smith"
                              className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                              value={formData.adminLastName}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="adminEmail" className="text-sm font-medium text-gray-700 flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-gray-500" />
                              Email Address *
                            </Label>
                            <Input
                              id="adminEmail"
                              name="adminEmail"
                              type="email"
                              placeholder="admin@greenwood.edu"
                              className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                              value={formData.adminEmail}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="adminPassword" className="text-sm font-medium text-gray-700 flex items-center">
                              <Lock className="h-4 w-4 mr-2 text-gray-500" />
                              Password *
                            </Label>
                            <Input
                              id="adminPassword"
                              name="adminPassword"
                              type="password"
                              placeholder="Create a strong password"
                              className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
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
                          className="px-8 py-3 h-12 border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl font-semibold transition-all duration-300 flex items-center"
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Previous
                        </Button>
                      )}
                      
                      {currentStep < 3 ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="ml-auto px-8 py-3 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
                        >
                          Continue
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="ml-auto px-8 py-3 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Creating Account...</span>
                            </div>
                          ) : (
                            'Launch Your School'
                          )}
                        </Button>
                      )}
                    </div>
                  </form>

                  <div className="mt-8 text-center">
                    <div className="text-slate-600">
                      Already have an account?{' '}
                      <Link
                        to="/login"
                        className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200 hover:underline"
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
      </div>
    </div>
  );
};

export default RegisterPage;
