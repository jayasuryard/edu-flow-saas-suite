import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">EduFlow</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={closeSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {filteredMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start px-3 py-2 text-left font-medium",
                    isActive 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => {
                    navigate(item.path);
                    closeSidebar();
                  }}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Badge>
              )}
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
