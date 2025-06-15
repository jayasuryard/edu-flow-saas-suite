
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Search, Edit, Trash2, Megaphone, Eye } from 'lucide-react';

const AnnouncementsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    content: '',
    priority: 'normal',
    targetAudience: 'all'
  });

  const queryClient = useQueryClient();

  const { data: announcementsResponse, isLoading } = useQuery({
    queryKey: ['announcements', searchTerm],
    queryFn: () => api.getAnnouncements({ search: searchTerm }),
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: (data: any) => api.createAnnouncement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setIsCreateDialogOpen(false);
      setCreateForm({
        title: '',
        content: '',
        priority: 'normal',
        targetAudience: 'all'
      });
      toast.success('Announcement created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create announcement');
    },
  });

  const updateAnnouncementMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateAnnouncement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setIsEditDialogOpen(false);
      setSelectedAnnouncement(null);
      toast.success('Announcement updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update announcement');
    },
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: (id: string) => api.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('Announcement deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete announcement');
    },
  });

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    createAnnouncementMutation.mutate(createForm);
  };

  const handleUpdateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnnouncement) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const updateData = {
      title: formData.get('title'),
      content: formData.get('content'),
      priority: formData.get('priority'),
      targetAudience: formData.get('targetAudience'),
    };

    updateAnnouncementMutation.mutate({ id: selectedAnnouncement.id, data: updateData });
  };

  const announcements = announcementsResponse?.data || [];

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
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-gray-600">Manage school announcements and notices</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
              <DialogDescription>
                Create a new announcement for the school
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="Announcement title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={createForm.content}
                  onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
                  placeholder="Announcement content..."
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={createForm.priority}
                    onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <select
                    id="targetAudience"
                    value={createForm.targetAudience}
                    onChange={(e) => setCreateForm({ ...createForm, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="students">Students</option>
                    <option value="teachers">Teachers</option>
                    <option value="parents">Parents</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createAnnouncementMutation.isPending}>
                  {createAnnouncementMutation.isPending ? 'Creating...' : 'Create Announcement'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Announcements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Announcements List</CardTitle>
          <CardDescription>
            Manage your school's announcements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Target Audience</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((announcement: any) => (
                <TableRow key={announcement.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Megaphone className="h-4 w-4 mr-2 text-blue-600" />
                      <div>
                        <div className="font-medium">{announcement.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {announcement.content}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        announcement.priority === 'urgent' ? 'destructive' :
                        announcement.priority === 'high' ? 'default' : 'secondary'
                      }
                    >
                      {announcement.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {announcement.targetAudience}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {announcement.views || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedAnnouncement(announcement);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this announcement?')) {
                            deleteAnnouncementMutation.mutate(announcement.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Announcement Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Update announcement information
            </DialogDescription>
          </DialogHeader>
          {selectedAnnouncement && (
            <form onSubmit={handleUpdateAnnouncement} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  name="title"
                  defaultValue={selectedAnnouncement.title}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  name="content"
                  defaultValue={selectedAnnouncement.content}
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    name="priority"
                    defaultValue={selectedAnnouncement.priority}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <select
                    name="targetAudience"
                    defaultValue={selectedAnnouncement.targetAudience}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="students">Students</option>
                    <option value="teachers">Teachers</option>
                    <option value="parents">Parents</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateAnnouncementMutation.isPending}>
                  {updateAnnouncementMutation.isPending ? 'Updating...' : 'Update Announcement'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnnouncementsPage;
