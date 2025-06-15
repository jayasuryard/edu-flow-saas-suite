
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  GraduationCap, Mail, ArrowLeft, School, Star, 
  Globe2, Book, Trophy, Apple, PenTool, Calculator, Microscope, CheckCircle
} from 'lucide-react';
import { api } from '../../services/api';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await api.forgotPassword(data.email);
      if (response.success) {
        setIsSuccess(true);
        toast.success('Password reset instructions sent to your email');
      } else {
        toast.error(response.message || 'Failed to send reset instructions');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset instructions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
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

        <div className="absolute top-32 sm:top-40 left-1/4 transform rotate-6 animate-float">
          <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-lg border border-green-300/30">
            <Book className="h-6 w-6 sm:h-10 sm:w-10 text-green-700" />
          </div>
        </div>

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

        <div className="absolute top-12 sm:top-20 right-1/4 transform -rotate-12">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full p-1.5 sm:p-2 shadow-xl animate-pulse">
            <Trophy className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-800" />
          </div>
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px] sm:bg-[size:60px_60px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
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

          {/* Forgot Password Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl transform rotate-2 scale-105 opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl transform -rotate-1 scale-102 opacity-5"></div>
            
            <Card className="relative bg-white/90 backdrop-blur-xl shadow-2xl border-0 rounded-3xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
              
              <CardHeader className="text-center pb-6 pt-8 px-4 sm:px-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-4 shadow-lg">
                    {isSuccess ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <Mail className="h-8 w-8 text-blue-600" />
                    )}
                  </div>
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                  {isSuccess ? 'Check Your Email' : 'Forgot Password?'}
                </CardTitle>
                <CardDescription className="text-slate-600 text-base sm:text-lg">
                  {isSuccess 
                    ? 'We\'ve sent password reset instructions to your email address'
                    : 'Enter your email address and we\'ll send you a link to reset your password'
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-4 sm:px-8 pb-8">
                {!isSuccess ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-bold text-slate-700 flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-blue-600" />
                              Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your email address"
                                className="h-12 rounded-xl border-slate-200 bg-white/70 backdrop-blur-sm focus:border-blue-400 focus:ring-blue-400/30 transition-all duration-300 text-base shadow-lg"
                                {...field}
                              />
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
                            <span>Sending Instructions...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-3">
                            <Mail className="h-5 w-5" />
                            <span>Send Reset Instructions</span>
                          </div>
                        )}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-slate-600">
                      Didn't receive the email? Check your spam folder or try again.
                    </p>
                    <Button
                      onClick={() => setIsSuccess(false)}
                      variant="outline"
                      className="w-full h-12 rounded-xl border-slate-200 hover:border-blue-400 transition-all duration-300"
                    >
                      Try Again
                    </Button>
                  </div>
                )}

                <div className="mt-8 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-bold transition-colors duration-200 hover:underline text-sm sm:text-base"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Link>
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

export default ForgotPasswordPage;
