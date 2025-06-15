
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Search, Edit, Trash2, FileText, Users, Calendar, MapPin } from 'lucide-react';

const ExamsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    type: '',
    academicYear: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const queryClient = useQueryClient();

  const { data: examsResponse, isLoading: examsLoading } = useQuery({
    queryKey: ['exams', searchTerm],
    queryFn: () => api.getExams({ search: searchTerm }),
  });

  const { data: classesResponse } = useQuery({
    queryKey: ['classes'],
    queryFn: () => api.getClasses(),
  });

  const createExamMutation = useMutation({
    mutationFn: (data: any) => api.createExam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setIsCreateDialogOpen(false);
      setCreateForm({
        name: '',
        type: '',
        academicYear: '',
        startDate: '',
        endDate: '',
        description: ''
      });
      toast.success('Exam created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create exam');
    },
  });

  const updateExamMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateExam(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setIsEditDialogOpen(false);
      setSelectedExam(null);
      toast.success('Exam updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update exam');
    },
  });

  const deleteExamMutation = useMutation({
    mutationFn: (id: string) => api.deleteExam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      toast.success('Exam deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete exam');
    },
  });

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    createExamMutation.mutate(createForm);
  };

  const handleUpdateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const updateData = {
      name: formData.get('name'),
      type: formData.get('type'),
      academicYear: formData.get('academicYear'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      description: formData.get('description'),
    };

    updateExamMutation.mutate({ id: selectedExam.id, data: updateData });
  };

  const exams = examsResponse?.data || [];
  const classes = classesResponse?.data || [];

  const examTypes = [
    { value: 'midterm', label: 'Midterm' },
    { value: 'final', label: 'Final' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'unit_test', label: 'Unit Test' },
    { value: 'annual', label: 'Annual' },
    { value: 'monthly', label: 'Monthly' }
  ];

  if (examsLoading) {
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
          <h1 className="text-3xl font-bold">Exam Management</h1>
          <p className="text-gray-600">Manage exams, schedules, and results</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Exam</DialogTitle>
              <DialogDescription>
                Set up a new exam for your school
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateExam} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Exam Name</Label>
                  <Input
                    id="name"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="e.g., Midterm Exam 2024"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Exam Type</Label>
                  <Select
                    value={createForm.type}
                    onValueChange={(value) => setCreateForm({ ...createForm, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="academicYear">Academic Year</Label>
                <Input
                  id="academicYear"
                  value={createForm.academicYear}
                  onChange={(e) => setCreateForm({ ...createForm, academicYear: e.target.value })}
                  placeholder="e.g., 2024-2025"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={createForm.startDate}
                    onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={createForm.endDate}
                    onChange={(e) => setCreateForm({ ...createForm, endDate: e.target.value })}
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
                  placeholder="Exam description..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createExamMutation.isPending}>
                  {createExamMutation.isPending ? 'Creating...' : 'Create Exam'}
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
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Exams Table */}
      <Card>
        <CardHeader>
          <CardTitle>Exams List</CardTitle>
          <CardDescription>
            Manage your school's examinations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam: any) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {exam.type?.charAt(0).toUpperCase() + exam.type?.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{exam.academicYear}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(exam.startDate).toLocaleDateString()} - {new Date(exam.endDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={exam.status === 'active' ? 'default' : 'secondary'}
                    >
                      {exam.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {exam.classes?.slice(0, 2).map((cls: any, index: number) => (
                        <Badge key={index} variant="secondary">
                          {cls.name}
                        </Badge>
                      ))}
                      {exam.classes?.length > 2 && (
                        <Badge variant="outline">+{exam.classes.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedExam(exam);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this exam?')) {
                            deleteExamMutation.mutate(exam.id);
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

      {/* Edit Exam Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Exam</DialogTitle>
            <DialogDescription>
              Update exam information
            </DialogDescription>
          </DialogHeader>
          {selectedExam && (
            <form onSubmit={handleUpdateExam} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Exam Name</Label>
                  <Input
                    name="name"
                    defaultValue={selectedExam.name}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Exam Type</Label>
                  <Select name="type" defaultValue={selectedExam.type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="academicYear">Academic Year</Label>
                <Input
                  name="academicYear"
                  defaultValue={selectedExam.academicYear}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    name="startDate"
                    type="date"
                    defaultValue={selectedExam.startDate?.split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    name="endDate"
                    type="date"
                    defaultValue={selectedExam.endDate?.split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  name="description"
                  defaultValue={selectedExam.description}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateExamMutation.isPending}>
                  {updateExamMutation.isPending ? 'Updating...' : 'Update Exam'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamsPage;
