
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
import { Plus, Search, Edit, Trash2, BookOpen } from 'lucide-react';

const SubjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    code: '',
    description: '',
    type: '',
    credits: ''
  });

  const queryClient = useQueryClient();

  const { data: subjectsResponse, isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects', searchTerm],
    queryFn: () => api.getSubjects({ search: searchTerm }),
  });

  const createSubjectMutation = useMutation({
    mutationFn: (data: any) => api.createSubject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setIsCreateDialogOpen(false);
      setCreateForm({
        name: '',
        code: '',
        description: '',
        type: '',
        credits: ''
      });
      toast.success('Subject created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create subject');
    },
  });

  const updateSubjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateSubject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setIsEditDialogOpen(false);
      setSelectedSubject(null);
      toast.success('Subject updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update subject');
    },
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: (id: string) => api.deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete subject');
    },
  });

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subjectData = {
      ...createForm,
      credits: parseInt(createForm.credits),
    };

    createSubjectMutation.mutate(subjectData);
  };

  const handleUpdateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const updateData = {
      name: formData.get('name'),
      code: formData.get('code'),
      description: formData.get('description'),
      type: formData.get('type'),
      credits: parseInt(formData.get('credits') as string),
    };

    updateSubjectMutation.mutate({ id: selectedSubject.id, data: updateData });
  };

  const subjects = subjectsResponse?.data || [];

  const subjectTypes = [
    { value: 'core', label: 'Core' },
    { value: 'elective', label: 'Elective' },
    { value: 'optional', label: 'Optional' },
    { value: 'language', label: 'Language' },
    { value: 'science', label: 'Science' },
    { value: 'arts', label: 'Arts' },
    { value: 'commerce', label: 'Commerce' }
  ];

  if (subjectsLoading) {
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
          <h1 className="text-3xl font-bold">Subjects</h1>
          <p className="text-gray-600">Manage school subjects and curriculum</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
              <DialogDescription>
                Create a new subject for the curriculum
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Subject Name</Label>
                  <Input
                    id="name"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="e.g., Mathematics, Physics"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Subject Code</Label>
                  <Input
                    id="code"
                    value={createForm.code}
                    onChange={(e) => setCreateForm({ ...createForm, code: e.target.value })}
                    placeholder="e.g., MATH101, PHY201"
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
                  placeholder="Subject description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Subject Type</Label>
                  <Select
                    value={createForm.type}
                    onValueChange={(value) => setCreateForm({ ...createForm, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject type" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credits">Credits</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={createForm.credits}
                    onChange={(e) => setCreateForm({ ...createForm, credits: e.target.value })}
                    min="1"
                    max="10"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createSubjectMutation.isPending}>
                  {createSubjectMutation.isPending ? 'Creating...' : 'Create Subject'}
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
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Subjects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subjects List</CardTitle>
          <CardDescription>
            Manage your school's subjects and curriculum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Teachers</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject: any) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{subject.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={subject.type === 'core' ? 'default' : 'secondary'}
                    >
                      {subject.type?.charAt(0).toUpperCase() + subject.type?.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{subject.credits}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {subject.classes?.slice(0, 2).map((cls: any, index: number) => (
                        <Badge key={index} variant="secondary">
                          {cls.name}
                        </Badge>
                      ))}
                      {subject.classes?.length > 2 && (
                        <Badge variant="outline">+{subject.classes.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {subject.teachers?.slice(0, 2).map((teacher: any, index: number) => (
                        <Badge key={index} variant="secondary">
                          {teacher.user?.firstName} {teacher.user?.lastName}
                        </Badge>
                      ))}
                      {subject.teachers?.length > 2 && (
                        <Badge variant="outline">+{subject.teachers.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedSubject(subject);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this subject?')) {
                            deleteSubjectMutation.mutate(subject.id);
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

      {/* Edit Subject Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>
              Update subject information
            </DialogDescription>
          </DialogHeader>
          {selectedSubject && (
            <form onSubmit={handleUpdateSubject} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Subject Name</Label>
                  <Input
                    name="name"
                    defaultValue={selectedSubject.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Subject Code</Label>
                  <Input
                    name="code"
                    defaultValue={selectedSubject.code}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  name="description"
                  defaultValue={selectedSubject.description}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Subject Type</Label>
                  <Select name="type" defaultValue={selectedSubject.type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject type" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credits">Credits</Label>
                  <Input
                    name="credits"
                    type="number"
                    defaultValue={selectedSubject.credits}
                    min="1"
                    max="10"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateSubjectMutation.isPending}>
                  {updateSubjectMutation.isPending ? 'Updating...' : 'Update Subject'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubjectsPage;
