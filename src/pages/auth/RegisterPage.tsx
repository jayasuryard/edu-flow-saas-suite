
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { GraduationCap, Mail, Lock, Building2, User, Phone, MapPin } from 'lucide-react';

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
    const success = await register(formData);
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

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <GraduationCap className="absolute top-20 left-20 h-8 w-8 text-emerald-300 animate-bounce animation-delay-500" />
        <Building2 className="absolute top-32 right-32 h-6 w-6 text-cyan-300 animate-bounce animation-delay-1000" />
        <User className="absolute bottom-40 left-40 h-7 w-7 text-teal-300 animate-bounce animation-delay-1500" />
        <Mail className="absolute bottom-32 right-20 h-5 w-5 text-emerald-400 animate-bounce animation-delay-2000" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8">
          {/* Header with Animation */}
          <div className="text-center animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full blur-xl opacity-30 scale-110 animate-pulse"></div>
              <div className="relative bg-white rounded-full p-4 w-20 h-20 mx-auto mb-4 shadow-lg">
                <GraduationCap className="h-12 w-12 text-emerald-600 mx-auto" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              EduFlow
            </h1>
            <p className="text-gray-600 font-medium">Create your school management account</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center items-center space-x-4 animate-fade-in animation-delay-300">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white scale-110' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-1 mx-2 transition-all duration-300 ${
                    currentStep > step ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Registration Card */}
          <Card className="relative backdrop-blur-lg bg-white/80 shadow-2xl border-0 animate-scale-in animation-delay-500">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-lg"></div>
            <div className="relative z-10">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-center text-gray-800">
                  {currentStep === 1 && "School Information"}
                  {currentStep === 2 && "School Details"}
                  {currentStep === 3 && "Administrator Account"}
                </CardTitle>
                <CardDescription className="text-center text-gray-600">
                  Step {currentStep} of 3 - Set up your school management system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Basic School Info */}
                  {currentStep === 1 && (
                    <div className="space-y-4 animate-slide-in-right">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="schoolName" className="text-sm font-medium text-gray-700">School Name *</Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="schoolName"
                              name="schoolName"
                              placeholder="Enter school name"
                              className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300"
                              value={formData.schoolName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="domain" className="text-sm font-medium text-gray-700">Domain *</Label>
                          <div className="relative">
                            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="domain"
                              name="domain"
                              placeholder="yourschool"
                              className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300"
                              value={formData.domain}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700">School Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="school@example.com"
                              className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone"
                              name="phone"
                              placeholder="Phone number"
                              className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Address Details */}
                  {currentStep === 2 && (
                    <div className="space-y-4 animate-slide-in-right">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                        School Address
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="address.street" className="text-sm font-medium text-gray-700">Street Address</Label>
                          <Input
                            id="address.street"
                            name="address.street"
                            placeholder="Street address"
                            className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300"
                            value={formData.address.street}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address.city" className="text-sm font-medium text-gray-700">City</Label>
                          <Input
                            id="address.city"
                            name="address.city"
                            placeholder="City"
                            className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300"
                            value={formData.address.city}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address.state" className="text-sm font-medium text-gray-700">State</Label>
                          <Input
                            id="address.state"
                            name="address.state"
                            placeholder="State"
                            className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300"
                            value={formData.address.state}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address.zipCode" className="text-sm font-medium text-gray-700">Zip Code</Label>
                          <Input
                            id="address.zipCode"
                            name="address.zipCode"
                            placeholder="Zip code"
                            className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300"
                            value={formData.address.zipCode}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address.country" className="text-sm font-medium text-gray-700">Country</Label>
                          <Input
                            id="address.country"
                            name="address.country"
                            placeholder="Country"
                            className="h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300"
                            value={formData.address.country}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Admin Account */}
                  {currentStep === 3 && (
                    <div className="space-y-4 animate-slide-in-right">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <User className="h-5 w-5 mr-2 text-emerald-600" />
                        Administrator Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="adminFirstName" className="text-sm font-medium text-gray-700">First Name *</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="adminFirstName"
                              name="adminFirstName"
                              placeholder="Admin first name"
                              className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300"
                              value={formData.adminFirstName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="adminLastName" className="text-sm font-medium text-gray-700">Last Name *</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="adminLastName"
                              name="adminLastName"
                              placeholder="Admin last name"
                              className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300"
                              value={formData.adminLastName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="adminEmail" className="text-sm font-medium text-gray-700">Admin Email *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="adminEmail"
                              name="adminEmail"
                              type="email"
                              placeholder="admin@example.com"
                              className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300"
                              value={formData.adminEmail}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="adminPassword" className="text-sm font-medium text-gray-700">Admin Password *</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="adminPassword"
                              name="adminPassword"
                              type="password"
                              placeholder="Strong password"
                              className="pl-10 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-300"
                              value={formData.adminPassword}
                              onChange={handleChange}
                              required
                            />
                          </div>
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
                        className="px-6 py-2 h-12 border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
                      >
                        Previous
                      </Button>
                    )}
                    
                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="ml-auto px-6 py-2 h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white transition-all duration-300 transform hover:scale-105"
                      >
                        Next Step
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="ml-auto px-6 py-2 h-12 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white transition-all duration-300 transform hover:scale-105"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Creating Account...</span>
                          </div>
                        ) : (
                          'Create School Account'
                        )}
                      </Button>
                    )}
                  </div>
                </form>

                <div className="mt-6 text-center animate-fade-in">
                  <div className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200"
                    >
                      Sign in here
                    </Link>
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

export default RegisterPage;
