
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { GraduationCap, Mail, Lock, Building2, User, Phone, MapPin, Globe, ChevronRight, ChevronLeft, School, BookOpen } from 'lucide-react';

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
    "School Information",
    "School Location", 
    "Administrator Account"
  ];

  const stepDescriptions = [
    "Basic details about your educational institution",
    "Where is your school located?",
    "Create your administrator account"
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - School Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-emerald-800 via-teal-700 to-cyan-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <School className="absolute top-20 left-20 h-24 w-24 text-white" />
          <BookOpen className="absolute top-40 right-20 h-20 w-20 text-white" />
          <GraduationCap className="absolute bottom-32 left-16 h-28 w-28 text-white" />
          <Building2 className="absolute bottom-20 right-24 h-16 w-16 text-white" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-20 text-white">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-white/20 rounded-full p-3 mr-4">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold">EduFlow</h1>
            </div>
            <h2 className="text-3xl font-light mb-4">Create Your School's Digital Hub</h2>
            <p className="text-emerald-200 text-lg leading-relaxed mb-8">
              Join thousands of educational institutions worldwide in transforming 
              their management systems with our comprehensive platform.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Setup Progress</h3>
            <div className="space-y-3">
              {stepTitles.map((title, index) => (
                <div key={index} className={`flex items-center space-x-3 ${
                  currentStep > index + 1 ? 'text-emerald-200' : 
                  currentStep === index + 1 ? 'text-white' : 'text-emerald-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > index + 1 ? 'bg-emerald-500' :
                    currentStep === index + 1 ? 'bg-white text-emerald-800' : 'bg-emerald-700'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium">{title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-300 rounded-full mr-3"></div>
              <span className="text-emerald-100">Streamlined Administration</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-300 rounded-full mr-3"></div>
              <span className="text-emerald-100">Enhanced Communication</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-300 rounded-full mr-3"></div>
              <span className="text-emerald-100">Real-time Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-2xl">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-emerald-600 rounded-full p-3 mr-3">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">EduFlow</h1>
            </div>
            <p className="text-gray-600">Create Your School Account</p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {stepTitles[currentStep - 1]}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {stepDescriptions[currentStep - 1]}
              </CardDescription>
              <div className="flex justify-center mt-4">
                <span className="text-sm text-gray-500">Step {currentStep} of 3</span>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Basic School Info */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="schoolName" className="text-sm font-medium text-gray-700 flex items-center">
                          <School className="h-4 w-4 mr-2 text-gray-500" />
                          School Name *
                        </Label>
                        <Input
                          id="schoolName"
                          name="schoolName"
                          placeholder="e.g. Greenwood High School"
                          className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                          value={formData.schoolName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="domain" className="text-sm font-medium text-gray-700 flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-gray-500" />
                          School Domain *
                        </Label>
                        <Input
                          id="domain"
                          name="domain"
                          placeholder="e.g. greenwood"
                          className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                          value={formData.domain}
                          onChange={handleChange}
                          required
                        />
                        <p className="text-xs text-gray-500">This will be your school's unique identifier</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          School Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="info@greenwood.edu"
                          className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="+1 (555) 123-4567"
                          className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20"
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

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="px-6 py-2 h-12 border-emerald-300 text-emerald-700 hover:bg-emerald-50 flex items-center"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                  )}
                  
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="ml-auto px-6 py-2 h-12 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center"
                    >
                      Continue
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="ml-auto px-6 py-2 h-12 bg-emerald-600 hover:bg-emerald-700 text-white"
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

              <div className="mt-6 text-center">
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
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
