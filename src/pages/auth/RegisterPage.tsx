
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

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
    
    // Basic validation
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EduFlow</h1>
          <p className="text-gray-600">Create Your School Management Account</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>School Registration</CardTitle>
            <CardDescription>
              Set up your school's management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* School Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">School Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name *</Label>
                    <Input
                      id="schoolName"
                      name="schoolName"
                      placeholder="Enter school name"
                      value={formData.schoolName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain *</Label>
                    <Input
                      id="domain"
                      name="domain"
                      placeholder="yourschool"
                      value={formData.domain}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">School Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="school@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address.street">Street</Label>
                    <Input
                      id="address.street"
                      name="address.street"
                      placeholder="Street address"
                      value={formData.address.street}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address.city">City</Label>
                    <Input
                      id="address.city"
                      name="address.city"
                      placeholder="City"
                      value={formData.address.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address.state">State</Label>
                    <Input
                      id="address.state"
                      name="address.state"
                      placeholder="State"
                      value={formData.address.state}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address.zipCode">Zip Code</Label>
                    <Input
                      id="address.zipCode"
                      name="address.zipCode"
                      placeholder="Zip code"
                      value={formData.address.zipCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Admin Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Administrator Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminFirstName">First Name *</Label>
                    <Input
                      id="adminFirstName"
                      name="adminFirstName"
                      placeholder="Admin first name"
                      value={formData.adminFirstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminLastName">Last Name *</Label>
                    <Input
                      id="adminLastName"
                      name="adminLastName"
                      placeholder="Admin last name"
                      value={formData.adminLastName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email *</Label>
                    <Input
                      id="adminEmail"
                      name="adminEmail"
                      type="email"
                      placeholder="admin@example.com"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">Admin Password *</Label>
                    <Input
                      id="adminPassword"
                      name="adminPassword"
                      type="password"
                      placeholder="Strong password"
                      value={formData.adminPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create School Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
