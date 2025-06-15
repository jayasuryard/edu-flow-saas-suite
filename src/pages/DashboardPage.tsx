
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Calendar, Bell, Settings } from 'lucide-react';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  schoolStatus: string;
  recentActivity: {
    newStudents: number;
    newTeachers: number;
  };
  schoolInfo: {
    name: string;
    domain: string;
    subscriptionPlan: string;
    maxStudents: number;
    maxTeachers: number;
  };
}

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch dashboard data based on user role
        let dashboardResponse;
        if (user?.role === 'school_admin') {
          dashboardResponse = await api.getSchoolDashboard();
        }

        if (dashboardResponse?.success) {
          setDashboardData(dashboardResponse.data);
        }

        // Fetch recent announcements
        const announcementsResponse = await api.getAnnouncements({ limit: 5 });
        if (announcementsResponse?.success) {
          setRecentAnnouncements(announcementsResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getRoleBasedGreeting = () => {
    switch (user?.role) {
      case 'super_admin':
        return 'Super Admin Dashboard';
      case 'school_admin':
        return 'School Administration Dashboard';
      case 'teacher':
        return 'Teacher Dashboard';
      case 'student':
        return 'Student Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trial':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-1">{getRoleBasedGreeting()}</p>
        </div>
        {dashboardData?.schoolInfo && (
          <Badge className={getStatusColor(dashboardData.schoolStatus)}>
            {dashboardData.schoolStatus}
          </Badge>
        )}
      </div>

      {/* Stats Cards */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalStudents}</div>
              {dashboardData.schoolInfo?.maxStudents && (
                <div className="mt-2">
                  <Progress 
                    value={(dashboardData.totalStudents / dashboardData.schoolInfo.maxStudents) * 100} 
                    className="w-full h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {dashboardData.totalStudents} of {dashboardData.schoolInfo.maxStudents} max
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalTeachers}</div>
              {dashboardData.schoolInfo?.maxTeachers && (
                <div className="mt-2">
                  <Progress 
                    value={(dashboardData.totalTeachers / dashboardData.schoolInfo.maxTeachers) * 100} 
                    className="w-full h-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {dashboardData.totalTeachers} of {dashboardData.schoolInfo.maxTeachers} max
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalClasses}</div>
              <p className="text-xs text-muted-foreground">
                Active classes this year
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {dashboardData.schoolInfo?.subscriptionPlan || 'Basic'}
              </div>
              <p className="text-xs text-muted-foreground">
                Current plan
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* School Information */}
      {dashboardData?.schoolInfo && (
        <Card>
          <CardHeader>
            <CardTitle>School Information</CardTitle>
            <CardDescription>
              Current school details and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">School Name</p>
                <p className="text-lg">{dashboardData.schoolInfo.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Domain</p>
                <p className="text-lg">{dashboardData.schoolInfo.domain}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Announcements */}
      {recentAnnouncements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Recent Announcements
            </CardTitle>
            <CardDescription>
              Latest updates and announcements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnnouncements.slice(0, 3).map((announcement: any, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium">{announcement.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {announcement.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(announcement.publishDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions for different roles */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for your role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user?.role === 'school_admin' && (
              <>
                <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-medium">Add Student</p>
                </button>
                <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm font-medium">Add Teacher</p>
                </button>
                <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm font-medium">Create Class</p>
                </button>
                <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <p className="text-sm font-medium">Send Announcement</p>
                </button>
              </>
            )}
            
            {user?.role === 'teacher' && (
              <>
                <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-medium">Mark Attendance</p>
                </button>
                <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm font-medium">View Timetable</p>
                </button>
              </>
            )}
            
            {user?.role === 'student' && (
              <>
                <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-medium">View Timetable</p>
                </button>
                <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm font-medium">View Results</p>
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
