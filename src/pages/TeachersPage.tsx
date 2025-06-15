
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { handleApiError, handleApiSuccess } from '../utils/errorHandler';
import { Plus, Search, Edit, Trash2, GraduationCap, AlertCircle, Loader2 } from 'lucide-react';

const TeachersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    qualification: '',
    experience: ''
  });

  const queryClient = useQueryClient();

  const { data: teachersResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['teachers', searchTerm],
    queryFn: () => api.getTeachers({ search: searchTerm || undefined }),
    retry: 2,
    staleTime: 30000,
  });

  const createTeacherMutation = useMutation({
    mutationFn: (data: any) => api.createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setIsCreateDialogOpen(false);
      setCreateForm({
        firstName: '',
        lastName: '',
        email: '',
        employeeId: '',
        qualification: '',
        experience: ''
      });
      handleApiSuccess('Teacher created successfully!');
    },
    onError: (error: any) => {
      handleApiError(error, 'Failed to create teacher');
    },
  });

  const deleteTeacherMutation = useMutation({
    mutationFn: (id: string) => api.deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      handleApiSuccess('Teacher deleted successfully!');
    },
    onError: (error: any) => {
      handleApiError(error, 'Failed to delete teacher');
    },
  });

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createForm.firstName || !createForm.lastName || !createForm.email) {
      handleApiError('Please fill in all required fields', 'Validation Error');
      return;
    }

    createTeacherMutation.mutate({
      user: {
        firstName: createForm.firstName,
        lastName: createForm.lastName,
        email: createForm.email,
        role: 'TEACHER'
      },
      employeeId: createForm.employeeId,
      qualification: createForm.qualification ? [createForm.qualification] : [],
      experience: createForm.experience ? parseInt(createForm.experience) : 0
    });
  };

  const handleDeleteTeacher = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      deleteTeacherMutation.mutate(id);
    }
  };

  const teachers = teachersResponse?.data || [];

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load teachers. {error.message}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="ml-4"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teachers</h1>
          <p className="text-gray-600">Manage teaching staff and their information</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
              <DialogDescription>Create a new teacher record</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTeacher} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <Input
                    value={createForm.firstName}
                    onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name *</Label>
                  <Input
                    value={createForm.lastName}
                    onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Employee ID</Label>
                  <Input
                    value={createForm.employeeId}
                    onChange={(e) => setCreateForm({ ...createForm, employeeId: e.target.value })}
                    placeholder="Enter employee ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Experience (years)</Label>
                  <Input
                    type="number"
                    value={createForm.experience}
                    onChange={(e) => setCreateForm({ ...createForm, experience: e.target.value })}
                    placeholder="Years of experience"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Qualification</Label>
                <Input
                  value={createForm.qualification}
                  onChange={(e) => setCreateForm({ ...createForm, qualification: e.target.value })}
                  placeholder="Enter qualification"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createTeacherMutation.isPending}>
                  {createTeacherMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Teacher'
                  )}
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Teachers List
          </CardTitle>
          <CardDescription>
            Total teachers: {teachers.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading teachers...</span>
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No teachers found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new teacher.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher: any) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">
                      {teacher.user?.firstName} {teacher.user?.lastName}
                    </TableCell>
                    <TableCell>{teacher.user?.email}</TableCell>
                    <TableCell>{teacher.employeeId || 'N/A'}</TableCell>
                    <TableCell>{teacher.experience || 0} years</TableCell>
                    <TableCell>
                      <Badge variant={teacher.user?.isActive ? 'default' : 'destructive'}>
                        {teacher.user?.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteTeacher(
                            teacher.id, 
                            `${teacher.user?.firstName} ${teacher.user?.lastName}`
                          )}
                          disabled={deleteTeacherMutation.isPending}
                        >
                          {deleteTeacherMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeachersPage;
