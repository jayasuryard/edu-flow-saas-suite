import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Users, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

interface Student {
  id: string;
  studentId: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  class: {
    name: string;
    grade: number;
  };
  admissionNumber: string;
  admissionDate: string;
  parentContact: any;
  academicInfo: any;
}

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    studentId: '',
    classId: '',
    admissionNumber: '',
    admissionDate: new Date().toISOString().split('T')[0],
    parentContact: {
      fatherName: '',
      motherName: '',
      fatherPhone: '',
      motherPhone: '',
      address: ''
    },
    academicInfo: {
      currentSession: new Date().getFullYear().toString()
    }
  });

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, [pagination.page, searchTerm]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm })
      };
      
      const response = await api.getStudents(params);
      if (response.success) {
        setStudents(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages
        }));
      }
    } catch (error) {
      toast.error('Failed to fetch students');
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.getClasses();
      if (response.success) {
        setClasses(response.data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('parentContact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        parentContact: {
          ...prev.parentContact,
          [field]: value
        }
      }));
    } else if (name.startsWith('academicInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        academicInfo: {
          ...prev.academicInfo,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      studentId: '',
      classId: '',
      admissionNumber: '',
      admissionDate: new Date().toISOString().split('T')[0],
      parentContact: {
        fatherName: '',
        motherName: '',
        fatherPhone: '',
        motherPhone: '',
        address: ''
      },
      academicInfo: {
        currentSession: new Date().getFullYear().toString()
      }
    });
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await api.createStudent(formData);
      if (response.success) {
        toast.success('Student created successfully!');
        setIsCreateDialogOpen(false);
        resetForm();
        fetchStudents();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create student');
    }
  };

  const handleEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent) return;
    
    try {
      const updateData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        classId: formData.classId,
        parentContact: formData.parentContact,
        academicInfo: formData.academicInfo
      };
      
      const response = await api.updateStudent(selectedStudent.id, updateData);
      if (response.success) {
        toast.success('Student updated successfully!');
        setIsEditDialogOpen(false);
        setSelectedStudent(null);
        resetForm();
        fetchStudents();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update student');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
      const response = await api.deleteStudent(studentId);
      if (response.success) {
        toast.success('Student deleted successfully!');
        fetchStudents();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete student');
    }
  };

  const openEditDialog = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      email: student.user.email,
      password: '',
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      studentId: student.studentId,
      classId: student.class ? student.class.name : '',
      admissionNumber: student.admissionNumber,
      admissionDate: student.admissionDate.split('T')[0],
      parentContact: student.parentContact || {
        fatherName: '',
        motherName: '',
        fatherPhone: '',
        motherPhone: '',
        address: ''
      },
      academicInfo: student.academicInfo || {
        currentSession: new Date().getFullYear().toString()
      }
    });
    setIsEditDialogOpen(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (isLoading && students.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">Manage student records and information</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Create a new student record with their details
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID *</Label>
                  <Input
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="classId">Class *</Label>
                  <Select onValueChange={(value) => handleSelectChange(value, 'classId')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class" />
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
                
                <div className="space-y-2">
                  <Label htmlFor="admissionNumber">Admission Number *</Label>
                  <Input
                    id="admissionNumber"
                    name="admissionNumber"
                    value={formData.admissionNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admissionDate">Admission Date *</Label>
                  <Input
                    id="admissionDate"
                    name="admissionDate"
                    type="date"
                    value={formData.admissionDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              {/* Parent Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Parent Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentContact.fatherName">Father's Name</Label>
                    <Input
                      id="parentContact.fatherName"
                      name="parentContact.fatherName"
                      value={formData.parentContact.fatherName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="parentContact.motherName">Mother's Name</Label>
                    <Input
                      id="parentContact.motherName"
                      name="parentContact.motherName"
                      value={formData.parentContact.motherName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="parentContact.fatherPhone">Father's Phone</Label>
                    <Input
                      id="parentContact.fatherPhone"
                      name="parentContact.fatherPhone"
                      value={formData.parentContact.fatherPhone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="parentContact.motherPhone">Mother's Phone</Label>
                    <Input
                      id="parentContact.motherPhone"
                      name="parentContact.motherPhone"
                      value={formData.parentContact.motherPhone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parentContact.address">Address</Label>
                  <Input
                    id="parentContact.address"
                    name="parentContact.address"
                    value={formData.parentContact.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Student</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students by name, email, or student ID..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Students ({pagination.total})
          </CardTitle>
          <CardDescription>
            Complete list of registered students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Student Info</th>
                  <th className="text-left py-2">Class</th>
                  <th className="text-left py-2">Admission</th>
                  <th className="text-left py-2">Contact</th>
                  <th className="text-right py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="py-4">
                      <div>
                        <p className="font-medium">
                          {student.user.firstName} {student.user.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{student.user.email}</p>
                        <p className="text-sm text-gray-500">ID: {student.studentId}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      {student.class ? (
                        <Badge variant="secondary">
                          {student.class.name} - Grade {student.class.grade}
                        </Badge>
                      ) : (
                        <span className="text-gray-500">No class assigned</span>
                      )}
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="text-sm">#{student.admissionNumber}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(student.admissionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="text-sm">
                        {student.parentContact?.fatherPhone && (
                          <p>Father: {student.parentContact.fatherPhone}</p>
                        )}
                        {student.parentContact?.motherPhone && (
                          <p>Mother: {student.parentContact.motherPhone}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} students
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update student information
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditStudent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="classId">Class *</Label>
              <Select onValueChange={(value) => handleSelectChange(value, 'classId')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
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

            {/* Parent Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Parent Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentContact.fatherName">Father's Name</Label>
                  <Input
                    id="parentContact.fatherName"
                    name="parentContact.fatherName"
                    value={formData.parentContact.fatherName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parentContact.motherName">Mother's Name</Label>
                  <Input
                    id="parentContact.motherName"
                    name="parentContact.motherName"
                    value={formData.parentContact.motherName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parentContact.fatherPhone">Father's Phone</Label>
                  <Input
                    id="parentContact.fatherPhone"
                    name="parentContact.fatherPhone"
                    value={formData.parentContact.fatherPhone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parentContact.motherPhone">Mother's Phone</Label>
                  <Input
                    id="parentContact.motherPhone"
                    name="parentContact.motherPhone"
                    value={formData.parentContact.motherPhone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="parentContact.address">Address</Label>
                <Input
                  id="parentContact.address"
                  name="parentContact.address"
                  value={formData.parentContact.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="academicInfo.currentSession">Current Session</Label>
                  <Input
                    id="academicInfo.currentSession"
                    name="academicInfo.currentSession"
                    value={formData.academicInfo.currentSession}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Student</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsPage;
