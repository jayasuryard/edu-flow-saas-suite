
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Users, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const AttendancePage = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);

  const queryClient = useQueryClient();

  const { data: classesResponse } = useQuery({
    queryKey: ['classes'],
    queryFn: () => api.getClasses(),
  });

  const { data: studentsResponse } = useQuery({
    queryKey: ['students', selectedClass],
    queryFn: () => selectedClass ? api.getStudents({ classId: selectedClass }) : null,
    enabled: !!selectedClass,
  });

  const { data: attendanceResponse, isLoading } = useQuery({
    queryKey: ['attendance', selectedClass, selectedDate],
    queryFn: () => selectedClass ? api.getClassAttendance(selectedClass, { date: selectedDate }) : null,
    enabled: !!selectedClass,
  });

  const { data: attendanceStats } = useQuery({
    queryKey: ['attendanceStats', selectedClass],
    queryFn: () => selectedClass ? api.getAttendanceStats(selectedClass) : null,
    enabled: !!selectedClass,
  });

  const markAttendanceMutation = useMutation({
    mutationFn: ({ classId, data }: { classId: string; data: any }) => 
      api.markAttendance(classId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['attendanceStats'] });
      toast.success('Attendance marked successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark attendance');
    },
  });

  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    setAttendanceData(prev => {
      const existing = prev.find(item => item.studentId === studentId);
      if (existing) {
        return prev.map(item => 
          item.studentId === studentId ? { ...item, isPresent } : item
        );
      } else {
        return [...prev, { studentId, isPresent, date: selectedDate }];
      }
    });
  };

  const handleSubmitAttendance = () => {
    if (!selectedClass || attendanceData.length === 0) {
      toast.error('Please select a class and mark attendance');
      return;
    }

    markAttendanceMutation.mutate({
      classId: selectedClass,
      data: {
        date: selectedDate,
        attendance: attendanceData
      }
    });
  };

  const classes = classesResponse?.data || [];
  const students = studentsResponse?.data || [];
  const attendance = attendanceResponse?.data || [];
  const stats = attendanceStats?.data || {};

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-gray-600">Track and manage student attendance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <Label>Select Class</Label>
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

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <Label>Select Date</Label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {selectedClass && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Attendance Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Present Rate</span>
                <Badge variant="secondary">
                  {stats.presentRate || 0}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Students</span>
                <Badge variant="outline">
                  {stats.totalStudents || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedClass && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Mark Attendance - {selectedDate}
            </CardTitle>
            <CardDescription>
              Mark attendance for students in the selected class
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Present</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student: any) => {
                      const existingAttendance = attendance.find((att: any) => att.studentId === student.id);
                      const currentAttendance = attendanceData.find(item => item.studentId === student.id);
                      const isPresent = currentAttendance?.isPresent ?? existingAttendance?.isPresent ?? false;
                      
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.studentId}
                          </TableCell>
                          <TableCell>
                            {student.user?.firstName} {student.user?.lastName}
                          </TableCell>
                          <TableCell>
                            <Badge variant={isPresent ? "default" : "destructive"}>
                              {isPresent ? (
                                <><CheckCircle className="h-3 w-3 mr-1" /> Present</>
                              ) : (
                                <><XCircle className="h-3 w-3 mr-1" /> Absent</>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={isPresent}
                              onCheckedChange={(checked) => 
                                handleAttendanceChange(student.id, checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={!isPresent}
                              onCheckedChange={(checked) => 
                                handleAttendanceChange(student.id, !(checked as boolean))
                              }
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSubmitAttendance}
                    disabled={markAttendanceMutation.isPending || attendanceData.length === 0}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {markAttendanceMutation.isPending ? 'Saving...' : 'Save Attendance'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendancePage;
