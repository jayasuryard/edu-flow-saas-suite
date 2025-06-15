
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TrendingUp, Users, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Promotion {
  id: string;
  studentId: string;
  student: any;
  fromClass: any;
  toClass: any;
  academicYear: string;
  status: string;
  processedAt: string;
  criteria: any;
}

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [targetClass, setTargetClass] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [promotionsResponse, classesResponse, studentsResponse] = await Promise.all([
        api.getPromotions(),
        api.getClasses(),
        api.getStudents()
      ]);
      
      if (promotionsResponse.success) {
        setPromotions(promotionsResponse.data);
      }
      if (classesResponse.success) {
        setClasses(classesResponse.data);
      }
      if (studentsResponse.success) {
        setStudents(studentsResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch promotion data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromoteStudents = async () => {
    if (!selectedClass || !targetClass) {
      toast({
        title: 'Error',
        description: 'Please select both source and target classes',
        variant: 'destructive',
      });
      return;
    }

    try {
      const promotionData = {
        fromClassId: selectedClass,
        toClassId: targetClass,
        academicYear,
        criteria: {
          minimumAttendance: 75,
          minimumGrade: 'C',
        },
      };

      await api.processPromotions(promotionData);
      toast({
        title: 'Success',
        description: 'Student promotions processed successfully',
      });
      
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to process promotions:', error);
      toast({
        title: 'Error',
        description: 'Failed to process student promotions',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'promoted':
        return 'bg-green-100 text-green-800';
      case 'retained':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Promotions</h1>
          <p className="text-gray-600 mt-1">Manage student promotions and academic progression</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <TrendingUp className="mr-2 h-4 w-4" />
              Process Promotions
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Process Student Promotions</DialogTitle>
              <DialogDescription>
                Promote students from one class to the next based on academic criteria.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Academic Year</label>
                <Select value={academicYear} onValueChange={setAcademicYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2025-2026">2025-2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">From Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls: any) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} - Grade {cls.grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">To Class</label>
                <Select value={targetClass} onValueChange={setTargetClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls: any) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} - Grade {cls.grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900">Promotion Criteria</h4>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Minimum 75% attendance</li>
                  <li>• Minimum grade C in all subjects</li>
                  <li>• No pending disciplinary actions</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePromoteStudents}>
                  Process Promotions
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Promotions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions.length}</div>
            <p className="text-xs text-muted-foreground">This academic year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promoted Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promotions.filter(p => p.status === 'promoted').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {promotions.length > 0 
                ? `${Math.round((promotions.filter(p => p.status === 'promoted').length / promotions.length) * 100)}% promotion rate`
                : 'No data'
              }
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retained Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promotions.filter(p => p.status === 'retained').length}
            </div>
            <p className="text-xs text-muted-foreground">Require additional support</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promotion History</CardTitle>
          <CardDescription>
            Track student academic progression and promotion records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {promotions.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No promotions processed</h3>
              <p className="mt-1 text-sm text-gray-500">Process student promotions to see records here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>From Class</TableHead>
                  <TableHead>To Class</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Processed Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell className="font-medium">
                      {promotion.student?.user?.firstName} {promotion.student?.user?.lastName}
                      <br />
                      <span className="text-sm text-gray-500">
                        {promotion.student?.studentId}
                      </span>
                    </TableCell>
                    <TableCell>
                      {promotion.fromClass?.name} - Grade {promotion.fromClass?.grade}
                    </TableCell>
                    <TableCell>
                      {promotion.toClass?.name} - Grade {promotion.toClass?.grade}
                    </TableCell>
                    <TableCell>{promotion.academicYear}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(promotion.status)}>
                        {promotion.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(promotion.processedAt).toLocaleDateString()}
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

export default PromotionsPage;
