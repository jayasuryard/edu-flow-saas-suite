import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Users, 
  Calendar, 
  Settings, 
  Bell, 
  User,
  LogOut,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DashboardLayout = () => {
  const { user, logout, state } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to login if not authenticated
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-lg font-medium text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  if (!state.isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.getNotificationStats();
        if (response.success) {
          setNotificationCount(response.data.unreadCount || 0);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', roles: ['super_admin', 'school_admin', 'teacher', 'student'] },
    { path: '/students', icon: Users, label: 'Students', roles: ['super_admin', 'school_admin', 'teacher'] },
    { path: '/teachers', icon: Users, label: 'Teachers', roles: ['super_admin', 'school_admin'] },
    { path: '/classes', icon: Calendar, label: 'Classes', roles: ['super_admin', 'school_admin', 'teacher'] },
    { path: '/subjects', icon: Calendar, label: 'Subjects', roles: ['super_admin', 'school_admin', 'teacher'] },
    { path: '/timetables', icon: Calendar, label: 'Timetables', roles: ['super_admin', 'school_admin', 'teacher'] },
    { path: '/attendance', icon: Calendar, label: 'Attendance', roles: ['super_admin', 'school_admin', 'teacher'] },
    { path: '/exams', icon: Calendar, label: 'Exams', roles: ['super_admin', 'school_admin', 'teacher'] },
    { path: '/exam-rooms', icon: Calendar, label: 'Exam Rooms', roles: ['super_admin', 'school_admin'] },
    { path: '/teacher-hierarchies', icon: Users, label: 'Hierarchies', roles: ['super_admin', 'school_admin'] },
    { path: '/promotions', icon: Users, label: 'Promotions', roles: ['super_admin', 'school_admin'] },
    { path: '/holidays', icon: Calendar, label: 'Holidays', roles: ['super_admin', 'school_admin'] },
    { path: '/calendar-events', icon: Calendar, label: 'Events', roles: ['super_admin', 'school_admin', 'teacher'] },
    { path: '/notifications', icon: Bell, label: 'Notifications', roles: ['super_admin', 'school_admin', 'teacher', 'student'] },
    { path: '/announcements', icon: Bell, label: 'Announcements', roles: ['super_admin', 'school_admin', 'teacher', 'student'] },
    { path: '/admin-settings', icon: Settings, label: 'Settings', roles: ['super_admin', 'school_admin'] },
    { path: '/superadmin', icon: Settings, label: 'Super Admin', roles: ['super_admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  const handleLogout = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Smooth transition
    logout();
    navigate('/login');
    setIsLoading(false);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    closeSidebar();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-lg shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200/50",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-full blur-sm opacity-20"></div>
              <GraduationCap className="relative h-8 w-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">EduFlow</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:bg-white/20"
            onClick={closeSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-3 space-y-1">
          {filteredMenuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "w-full justify-start px-4 py-3 text-left font-medium transition-all duration-200 group animate-fade-in",
                  isActive 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105" 
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 hover:scale-102"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className={cn(
                  "mr-3 h-5 w-5 transition-transform duration-200",
                  isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600",
                  "group-hover:scale-110"
                )} />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Button>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center mb-4 p-3 bg-white/80 rounded-lg backdrop-blur-sm shadow-sm">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
              <div className="mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {user?.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                <span>Signing out...</span>
              </div>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-200/50 h-16 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden hover:bg-blue-50"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Page Title */}
            <div className="hidden md:block">
              <h2 className="text-xl font-semibold text-gray-800">
                {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="relative hover:bg-blue-50 transition-colors duration-200"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-bounce"
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Badge>
              )}
            </Button>

            {/* User Avatar */}
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
