
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Search, Edit, Trash2, UserPlus, BookOpen, Users } from 'lucide-react';

const TeachersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assignmentType, setAssignmentType] = useState<'subjects' | 'classes'>('subjects');
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    teacherId: '',
    employeeId: '',
    qualification: '',
    experience: 0,
    specialization: ''
  });

  const queryClient = useQueryClient();

  const { data: teachersResponse, isLoading: teachersLoading } = useQuery({
    queryKey: ['teachers', searchTerm],
    queryFn: () => api.getTeachers({ search: searchTerm }),
  });

  const { data: subjectsResponse } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => api.getSubjects(),
  });

  const { data: classesResponse } = useQuery({
    queryKey: ['classes'],
    queryFn: () => api.getClasses(),
  });

  const createTeacherMutation = useMutation({
    mutationFn: (data: any) => api.createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setIsCreateDialogOpen(false);
      setCreateForm({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        teacherId: '',
        employeeId: '',
        qualification: '',
        experience: 0,
        specialization: ''
      });
      toast.success('Teacher created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create teacher');
    },
  });

  const updateTeacherMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateTeacher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setIsEditDialogOpen(false);
      setSelectedTeacher(null);
      toast.success('Teacher updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update teacher');
    },
  });

  const deleteTeacherMutation = useMutation({
    mutationFn: (id: string) => api.deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast.success('Teacher deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete teacher');
    },
  });

  const assignSubjectsMutation = useMutation({
    mutationFn: ({ teacherId, subjectIds }: { teacherId: string; subjectIds: string[] }) =>
      api.assignSubjectsToTeacher(teacherId, subjectIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setIsAssignDialogOpen(false);
      setSelectedTeacher(null);
      toast.success('Subjects assigned successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to assign subjects');
    },
  });

  const assignClassesMutation = useMutation({
    mutationFn: ({ teacherId, classIds }: { teacherId: string; classIds: string[] }) =>
      api.assignClassesToTeacher(teacherId, classIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setIsAssignDialogOpen(false);
      setSelectedTeacher(null);
      toast.success('Classes assigned successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to assign classes');
    },
  });

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    
    const teacherData = {
      ...createForm,
      qualification: createForm.qualification.split(',').map(q => q.trim()),
      specialization: createForm.specialization.split(',').map(s => s.trim()),
    };

    createTeacherMutation.mutate(teacherData);
  };

  const handleUpdateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const updateData = {
      email: formData.get('email'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      qualification: (formData.get('qualification') as string).split(',').map(q => q.trim()),
      experience: parseInt(formData.get('experience') as string),
      specialization: (formData.get('specialization') as string).split(',').map(s => s.trim()),
    };

    updateTeacherMutation.mutate({ id: selectedTeacher.id, data: updateData });
  };

  const handleAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const selectedIds = Array.from(formData.getAll('items')).map(id => id.toString());

    if (assignmentType === 'subjects') {
      assignSubjectsMutation.mutate({ teacherId: selectedTeacher.id, subjectIds: selectedIds });
    } else {
      assignClassesMutation.mutate({ teacherId: selectedTeacher.id, classIds: selectedIds });
    }
  };

  const teachers = teachersResponse?.data || [];
  const subjects = subjectsResponse?.data || [];
  const classes = classesResponse?.data || [];

  if (teachersLoading) {
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
          <h1 className="text-3xl font-bold">Teachers</h1>
          <p className="text-gray-600">Manage school teachers and their assignments</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
              <DialogDescription>
                Create a new teacher profile with their details
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTeacher} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={createForm.firstName}
                    onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={createForm.lastName}
                    onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacherId">Teacher ID</Label>
                  <Input
                    id="teacherId"
                    value={createForm.teacherId}
                    onChange={(e) => setCreateForm({ ...createForm, teacherId: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    value={createForm.employeeId}
                    onChange={(e) => setCreateForm({ ...createForm, employeeId: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualification">Qualifications (comma-separated)</Label>
                <Input
                  id="qualification"
                  value={createForm.qualification}
                  onChange={(e) => setCreateForm({ ...createForm, qualification: e.target.value })}
                  placeholder="B.Ed, M.A, Ph.D"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={createForm.experience}
                    onChange={(e) => setCreateForm({ ...createForm, experience: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization (comma-separated)</Label>
                  <Input
                    id="specialization"
                    value={createForm.specialization}
                    onChange={(e) => setCreateForm({ ...createForm, specialization: e.target.value })}
                    placeholder="Mathematics, Science"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createTeacherMutation.isPending}>
                  {createTeacherMutation.isPending ? 'Creating...' : 'Create Teacher'}
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
          <CardTitle>Teachers List</CardTitle>
          <CardDescription>
            Manage your school's teaching staff
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Teacher ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher: any) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">
                    {teacher.user?.firstName} {teacher.user?.lastName}
                  </TableCell>
                  <TableCell>{teacher.teacherId}</TableCell>
                  <TableCell>{teacher.user?.email}</TableCell>
                  <TableCell>{teacher.experience} years</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects?.slice(0, 2).map((subject: any, index: number) => (
                        <Badge key={index} variant="secondary">
                          {subject.name}
                        </Badge>
                      ))}
                      {teacher.subjects?.length > 2 && (
                        <Badge variant="outline">+{teacher.subjects.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.classes?.slice(0, 2).map((cls: any, index: number) => (
                        <Badge key={index} variant="secondary">
                          {cls.name}
                        </Badge>
                      ))}
                      {teacher.classes?.length > 2 && (
                        <Badge variant="outline">+{teacher.classes.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setAssignmentType('subjects');
                          setIsAssignDialogOpen(true);
                        }}
                      >
                        <BookOpen className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setAssignmentType('classes');
                          setIsAssignDialogOpen(true);
                        }}
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this teacher?')) {
                            deleteTeacherMutation.mutate(teacher.id);
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

      {/* Edit Teacher Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogDescription>
              Update teacher information
            </DialogDescription>
          </DialogHeader>
          {selectedTeacher && (
            <form onSubmit={handleUpdateTeacher} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    name="firstName"
                    defaultValue={selectedTeacher.user?.firstName}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    name="lastName"
                    defaultValue={selectedTeacher.user?.lastName}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  name="email"
                  type="email"
                  defaultValue={selectedTeacher.user?.email}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualification">Qualifications (comma-separated)</Label>
                <Input
                  name="qualification"
                  defaultValue={selectedTeacher.qualification?.join(', ')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (years)</Label>
                  <Input
                    name="experience"
                    type="number"
                    defaultValue={selectedTeacher.experience}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization (comma-separated)</Label>
                  <Input
                    name="specialization"
                    defaultValue={selectedTeacher.specialization?.join(', ')}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateTeacherMutation.isPending}>
                  {updateTeacherMutation.isPending ? 'Updating...' : 'Update Teacher'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Assign {assignmentType === 'subjects' ? 'Subjects' : 'Classes'}
            </DialogTitle>
            <DialogDescription>
              Select {assignmentType} to assign to {selectedTeacher?.user?.firstName} {selectedTeacher?.user?.lastName}
            </DialogDescription>
          </DialogHeader>
          {selectedTeacher && (
            <form onSubmit={handleAssignment} className="space-y-4">
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {(assignmentType === 'subjects' ? subjects : classes).map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="items"
                      value={item.id}
                      id={item.id}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={item.id} className="text-sm">
                      {item.name} {assignmentType === 'subjects' && `(${item.code})`}
                      {assignmentType === 'classes' && `- Grade ${item.grade}`}
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={assignSubjectsMutation.isPending || assignClassesMutation.isPending}>
                  {(assignSubjectsMutation.isPending || assignClassesMutation.isPending) ? 'Assigning...' : 'Assign'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeachersPage;
