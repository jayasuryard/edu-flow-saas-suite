
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Search, Edit, Trash2, Users, BookOpen } from 'lucide-react';

const ClassesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    grade: '',
    description: '',
    capacity: '',
    classTeacherId: '',
    academicYear: new Date().getFullYear().toString()
  });

  const queryClient = useQueryClient();

  const { data: classesResponse, isLoading: classesLoading } = useQuery({
    queryKey: ['classes', searchTerm],
    queryFn: () => api.getClasses({ search: searchTerm }),
  });

  const { data: teachersResponse } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => api.getTeachers(),
  });

  const { data: subjectsResponse } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => api.getSubjects(),
  });

  const createClassMutation = useMutation({
    mutationFn: (data: any) => api.createClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setIsCreateDialogOpen(false);
      setCreateForm({
        name: '',
        grade: '',
        description: '',
        capacity: '',
        classTeacherId: '',
        academicYear: new Date().getFullYear().toString()
      });
      toast.success('Class created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create class');
    },
  });

  const updateClassMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateClass(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setIsEditDialogOpen(false);
      setSelectedClass(null);
      toast.success('Class updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update class');
    },
  });

  const deleteClassMutation = useMutation({
    mutationFn: (id: string) => api.deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete class');
    },
  });

  const assignSubjectsMutation = useMutation({
    mutationFn: ({ classId, subjectIds }: { classId: string; subjectIds: string[] }) =>
      api.assignSubjectsToClass(classId, subjectIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      setIsAssignDialogOpen(false);
      setSelectedClass(null);
      toast.success('Subjects assigned successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to assign subjects');
    },
  });

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    
    const classData = {
      ...createForm,
      grade: parseInt(createForm.grade),
      capacity: parseInt(createForm.capacity),
    };

    createClassMutation.mutate(classData);
  };

  const handleUpdateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const updateData = {
      name: formData.get('name'),
      description: formData.get('description'),
      capacity: parseInt(formData.get('capacity') as string),
      classTeacherId: formData.get('classTeacherId'),
    };

    updateClassMutation.mutate({ id: selectedClass.id, data: updateData });
  };

  const handleAssignSubjects = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const subjectIds = Array.from(formData.getAll('subjects')).map(id => id.toString());

    assignSubjectsMutation.mutate({ classId: selectedClass.id, subjectIds });
  };

  const classes = classesResponse?.data || [];
  const teachers = teachersResponse?.data || [];
  const subjects = subjectsResponse?.data || [];

  if (classesLoading) {
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
          <h1 className="text-3xl font-bold">Classes</h1>
          <p className="text-gray-600">Manage school classes and their subjects</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
              <DialogDescription>
                Create a new class with details
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Class Name</Label>
                  <Input
                    id="name"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="e.g., 10-A, Mathematics"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    type="number"
                    value={createForm.grade}
                    onChange={(e) => setCreateForm({ ...createForm, grade: e.target.value })}
                    min="1"
                    max="12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Class description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={createForm.capacity}
                    onChange={(e) => setCreateForm({ ...createForm, capacity: e.target.value })}
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Input
                    id="academicYear"
                    value={createForm.academicYear}
                    onChange={(e) => setCreateForm({ ...createForm, academicYear: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="classTeacherId">Class Teacher</Label>
                <Select
                  value={createForm.classTeacherId}
                  onValueChange={(value) => setCreateForm({ ...createForm, classTeacherId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher: any) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.user?.firstName} {teacher.user?.lastName} - {teacher.teacherId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createClassMutation.isPending}>
                  {createClassMutation.isPending ? 'Creating...' : 'Create Class'}
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
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Classes List</CardTitle>
          <CardDescription>
            Manage your school's classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Class Teacher</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls: any) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  <TableCell>{cls.grade}</TableCell>
                  <TableCell>
                    {cls.classTeacher ? (
                      `${cls.classTeacher.firstName} ${cls.classTeacher.lastName}`
                    ) : (
                      <Badge variant="outline">Not Assigned</Badge>
                    )}
                  </TableCell>
                  <TableCell>{cls.capacity}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {cls.studentCount || 0}/{cls.capacity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {cls.subjects?.slice(0, 2).map((subject: any, index: number) => (
                        <Badge key={index} variant="secondary">
                          {subject.name}
                        </Badge>
                      ))}
                      {cls.subjects?.length > 2 && (
                        <Badge variant="outline">+{cls.subjects.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedClass(cls);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedClass(cls);
                          setIsAssignDialogOpen(true);
                        }}
                      >
                        <BookOpen className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this class?')) {
                            deleteClassMutation.mutate(cls.id);
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

      {/* Edit Class Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>
              Update class information
            </DialogDescription>
          </DialogHeader>
          {selectedClass && (
            <form onSubmit={handleUpdateClass} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Class Name</Label>
                <Input
                  name="name"
                  defaultValue={selectedClass.name}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  name="description"
                  defaultValue={selectedClass.description}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  name="capacity"
                  type="number"
                  defaultValue={selectedClass.capacity}
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="classTeacherId">Class Teacher</Label>
                <Select name="classTeacherId" defaultValue={selectedClass.classTeacher?.id}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher: any) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.user?.firstName} {teacher.user?.lastName} - {teacher.teacherId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateClassMutation.isPending}>
                  {updateClassMutation.isPending ? 'Updating...' : 'Update Class'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Subjects Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Subjects</DialogTitle>
            <DialogDescription>
              Select subjects for {selectedClass?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedClass && (
            <form onSubmit={handleAssignSubjects} className="space-y-4">
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {subjects.map((subject: any) => (
                  <div key={subject.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="subjects"
                      value={subject.id}
                      id={subject.id}
                      className="rounded border-gray-300"
                      defaultChecked={selectedClass.subjects?.some((s: any) => s.id === subject.id)}
                    />
                    <label htmlFor={subject.id} className="text-sm">
                      {subject.name} ({subject.code})
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={assignSubjectsMutation.isPending}>
                  {assignSubjectsMutation.isPending ? 'Assigning...' : 'Assign Subjects'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassesPage;
