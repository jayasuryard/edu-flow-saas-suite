
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Bell, Check, CheckCheck, Send, Users } from 'lucide-react';

const NotificationsPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    message: '',
    type: '',
    targetAudience: '',
    priority: 'normal'
  });

  const queryClient = useQueryClient();

  const { data: notificationsResponse, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.getNotifications(),
  });

  const { data: statsResponse } = useQuery({
    queryKey: ['notificationStats'],
    queryFn: () => api.getNotificationStats(),
  });

  const createNotificationMutation = useMutation({
    mutationFn: (data: any) => api.createNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationStats'] });
      setIsCreateDialogOpen(false);
      setCreateForm({
        title: '',
        message: '',
        type: '',
        targetAudience: '',
        priority: 'normal'
      });
      toast.success('Notification sent successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send notification');
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => api.markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationStats'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => api.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationStats'] });
      toast.success('All notifications marked as read');
    },
  });

  const createBulkNotificationMutation = useMutation({
    mutationFn: (data: any) => api.createBulkNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Bulk notification sent successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send bulk notification');
    },
  });

  const handleCreateNotification = (e: React.FormEvent) => {
    e.preventDefault();
    createNotificationMutation.mutate(createForm);
  };

  const notifications = notificationsResponse?.data || [];
  const stats = statsResponse?.data || {};

  const notificationTypes = [
    { value: 'announcement', label: 'Announcement' },
    { value: 'reminder', label: 'Reminder' },
    { value: 'alert', label: 'Alert' },
    { value: 'event', label: 'Event' },
    { value: 'exam', label: 'Exam' },
    { value: 'attendance', label: 'Attendance' }
  ];

  const targetAudiences = [
    { value: 'all', label: 'All Users' },
    { value: 'students', label: 'Students' },
    { value: 'teachers', label: 'Teachers' },
    { value: 'parents', label: 'Parents' },
    { value: 'admins', label: 'Administrators' }
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-600">Manage school notifications and announcements</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Send New Notification</DialogTitle>
                <DialogDescription>
                  Create and send a notification to users
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateNotification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    placeholder="Notification title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={createForm.message}
                    onChange={(e) => setCreateForm({ ...createForm, message: e.target.value })}
                    placeholder="Notification message..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={createForm.type}
                      onValueChange={(value) => setCreateForm({ ...createForm, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {notificationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Select
                      value={createForm.targetAudience}
                      onValueChange={(value) => setCreateForm({ ...createForm, targetAudience: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        {targetAudiences.map((audience) => (
                          <SelectItem key={audience.value} value={audience.value}>
                            {audience.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={createForm.priority}
                      onValueChange={(value) => setCreateForm({ ...createForm, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createNotificationMutation.isPending}>
                    <Send className="h-4 w-4 mr-2" />
                    {createNotificationMutation.isPending ? 'Sending...' : 'Send Notification'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold">{stats.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Check className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Read</p>
                <p className="text-2xl font-bold">{stats.read || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold">{stats.unread || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recipients</p>
                <p className="text-2xl font-bold">{stats.totalRecipients || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>
            View and manage sent notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification: any) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg ${
                  notification.isRead ? 'bg-gray-50' : 'bg-white border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <Badge variant={notification.priority === 'urgent' ? 'destructive' : 'secondary'}>
                        {notification.priority}
                      </Badge>
                      <Badge variant="outline">
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="mr-4">To: {notification.targetAudience}</span>
                      <span>{new Date(notification.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!notification.isRead && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsReadMutation.mutate(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
