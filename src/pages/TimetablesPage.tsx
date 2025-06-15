
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
import { toast } from 'sonner';
import { Plus, Clock, Calendar, Edit, Trash2 } from 'lucide-react';

const TimetablesPage = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    classId: '',
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    subjectId: '',
    teacherId: ''
  });

  const queryClient = useQueryClient();

  const { data: classesResponse } = useQuery({
    queryKey: ['classes'],
    queryFn: () => api.getClasses(),
  });

  const { data: subjectsResponse } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => api.getSubjects(),
  });

  const { data: teachersResponse } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => api.getTeachers(),
  });

  const { data: timetableResponse, isLoading } = useQuery({
    queryKey: ['timetable', selectedClass],
    queryFn: () => selectedClass ? api.getClassTimetable(selectedClass) : null,
    enabled: !!selectedClass,
  });

  const createTimetableMutation = useMutation({
    mutationFn: (data: any) => api.createTimetable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
      setIsCreateDialogOpen(false);
      setCreateForm({
        classId: '',
        dayOfWeek: '',
        startTime: '',
        endTime: '',
        subjectId: '',
        teacherId: ''
      });
      toast.success('Timetable entry created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create timetable entry');
    },
  });

  const deleteTimetableMutation = useMutation({
    mutationFn: (id: string) => api.deleteTimetable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
      toast.success('Timetable entry deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete timetable entry');
    },
  });

  const handleCreateTimetable = (e: React.FormEvent) => {
    e.preventDefault();
    createTimetableMutation.mutate(createForm);
  };

  const classes = classesResponse?.data || [];
  const subjects = subjectsResponse?.data || [];
  const teachers = teachersResponse?.data || [];
  const timetable = timetableResponse?.data || [];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Timetables</h1>
          <p className="text-gray-600">Manage class schedules and timetables</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Timetable Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Timetable Entry</DialogTitle>
              <DialogDescription>Create a new timetable entry</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTimetable} className="space-y-4">
              <div className="space-y-2">
                <Label>Class</Label>
                <Select
                  value={createForm.classId}
                  onValueChange={(value) => setCreateForm({ ...createForm, classId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls: any) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Day of Week</Label>
                  <Select
                    value={createForm.dayOfWeek}
                    onValueChange={(value) => setCreateForm({ ...createForm, dayOfWeek: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day} value={day.toLowerCase()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select
                    value={createForm.subjectId}
                    onValueChange={(value) => setCreateForm({ ...createForm, subjectId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject: any) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={createForm.startTime}
                    onChange={(e) => setCreateForm({ ...createForm, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={createForm.endTime}
                    onChange={(e) => setCreateForm({ ...createForm, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Teacher</Label>
                <Select
                  value={createForm.teacherId}
                  onValueChange={(value) => setCreateForm({ ...createForm, teacherId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher: any) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.user?.firstName} {teacher.user?.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createTimetableMutation.isPending}>
                  {createTimetableMutation.isPending ? 'Creating...' : 'Create Entry'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <Label>Select Class to View Timetable</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls: any) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedClass && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Class Timetable
            </CardTitle>
            <CardDescription>
              Weekly schedule for selected class
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timetable.map((entry: any) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {entry.dayOfWeek?.charAt(0).toUpperCase() + entry.dayOfWeek?.slice(1)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {entry.startTime} - {entry.endTime}
                        </div>
                      </TableCell>
                      <TableCell>{entry.subject?.name}</TableCell>
                      <TableCell>
                        {entry.teacher?.user?.firstName} {entry.teacher?.user?.lastName}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this timetable entry?')) {
                                deleteTimetableMutation.mutate(entry.id);
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
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TimetablesPage;
