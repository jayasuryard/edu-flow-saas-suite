
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundaryProvider } from './hooks/useErrorBoundary';
import DashboardLayout from './components/Layout/DashboardLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import StudentsPage from './pages/StudentsPage';
import TeachersPage from './pages/TeachersPage';
import ClassesPage from './pages/ClassesPage';
import SubjectsPage from './pages/SubjectsPage';
import TimetablesPage from './pages/TimetablesPage';
import AttendancePage from './pages/AttendancePage';
import ExamsPage from './pages/ExamsPage';
import ExamRoomsPage from './pages/ExamRoomsPage';
import TeacherHierarchiesPage from './pages/TeacherHierarchiesPage';
import NotificationsPage from './pages/NotificationsPage';
import PromotionsPage from './pages/PromotionsPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import HolidaysPage from './pages/HolidaysPage';
import DashboardPage from './pages/DashboardPage';
import NotFound from './pages/NotFound';

// Create a query client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 401, 403, or 404 errors
        if (error?.status === 401 || error?.status === 403 || error?.status === 404) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry mutations on client errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundaryProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <div className="App">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/" element={<DashboardLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="students" element={<StudentsPage />} />
                  <Route path="teachers" element={<TeachersPage />} />
                  <Route path="classes" element={<ClassesPage />} />
                  <Route path="subjects" element={<SubjectsPage />} />
                  <Route path="timetables" element={<TimetablesPage />} />
                  <Route path="attendance" element={<AttendancePage />} />
                  <Route path="exams" element={<ExamsPage />} />
                  <Route path="exam-rooms" element={<ExamRoomsPage />} />
                  <Route path="teacher-hierarchies" element={<TeacherHierarchiesPage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="promotions" element={<PromotionsPage />} />
                  <Route path="announcements" element={<AnnouncementsPage />} />
                  <Route path="holidays" element={<HolidaysPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster richColors position="top-right" />
            </div>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundaryProvider>
  );
}

export default App;
