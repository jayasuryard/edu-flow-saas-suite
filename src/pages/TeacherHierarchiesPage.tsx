
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trees, Plus, Edit, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeacherHierarchy {
  id: string;
  name: string;
  level: number;
  parentId?: string;
  teacherId?: string;
  teacher?: any;
  children?: TeacherHierarchy[];
}

const TeacherHierarchiesPage = () => {
  const [hierarchies, setHierarchies] = useState<TeacherHierarchy[]>([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHierarchy, setSelectedHierarchy] = useState<TeacherHierarchy | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    parentId: '',
    teacherId: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [hierarchiesResponse, teachersResponse] = await Promise.all([
        api.getTeacherHierarchyStructure(),
        api.getTeachers()
      ]);
      
      if (hierarchiesResponse.success) {
        setHierarchies(hierarchiesResponse.data);
      }
      if (teachersResponse.success) {
        setTeachers(teachersResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch teacher hierarchies',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hierarchyData = {
      name: formData.name,
      level: parseInt(formData.level),
      parentId: formData.parentId || undefined,
      teacherId: formData.teacherId || undefined,
    };

    try {
      if (selectedHierarchy) {
        await api.updateTeacherHierarchy(selectedHierarchy.id, hierarchyData);
        toast({
          title: 'Success',
          description: 'Teacher hierarchy updated successfully',
        });
      } else {
        await api.createTeacherHierarchy(hierarchyData);
        toast({
          title: 'Success',
          description: 'Teacher hierarchy created successfully',
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Failed to save teacher hierarchy:', error);
      toast({
        title: 'Error',
        description: 'Failed to save teacher hierarchy',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (hierarchy: TeacherHierarchy) => {
    setSelectedHierarchy(hierarchy);
    setFormData({
      name: hierarchy.name,
      level: hierarchy.level.toString(),
      parentId: hierarchy.parentId || '',
      teacherId: hierarchy.teacherId || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', level: '', parentId: '', teacherId: '' });
    setSelectedHierarchy(null);
  };

  const renderHierarchyTree = (hierarchies: TeacherHierarchy[], level = 0) => {
    return hierarchies.map((hierarchy) => (
      <div key={hierarchy.id} className={`ml-${level * 6} border-l-2 border-gray-200 pl-4 py-2`}>
        <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
          <div className="flex items-center space-x-3">
            <Trees className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-medium">{hierarchy.name}</h3>
              <p className="text-sm text-gray-500">
                Level {hierarchy.level}
                {hierarchy.teacher && (
                  <span className="ml-2">
                    • {hierarchy.teacher.user.firstName} {hierarchy.teacher.user.lastName}
                  </span>
                )}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(hierarchy)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        {hierarchy.children && hierarchy.children.length > 0 && (
          <div className="mt-2">
            {renderHierarchyTree(hierarchy.children, level + 1)}
          </div>
        )}
      </div>
    ));
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
          <h1 className="text-3xl font-bold text-gray-900">Teacher Hierarchies</h1>
          <p className="text-gray-600 mt-1">Manage organizational structure and reporting relationships</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Position
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedHierarchy ? 'Edit' : 'Add'} Hierarchy Position</DialogTitle>
              <DialogDescription>
                {selectedHierarchy ? 'Update' : 'Create a new'} position in the teacher hierarchy.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Position Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Principal, Vice Principal, Head of Department"
                  required
                />
              </div>
              <div>
                <Label htmlFor="level">Hierarchy Level</Label>
                <Input
                  id="level"
                  type="number"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  placeholder="e.g., 1 (higher numbers = lower level)"
                  required
                />
              </div>
              <div>
                <Label htmlFor="parentId">Reports To</Label>
                <Select value={formData.parentId} onValueChange={(value) => setFormData({ ...formData, parentId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent position (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No parent (top level)</SelectItem>
                    {hierarchies.map((hierarchy) => (
                      <SelectItem key={hierarchy.id} value={hierarchy.id}>
                        {hierarchy.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="teacherId">Assign Teacher</Label>
                <Select value={formData.teacherId} onValueChange={(value) => setFormData({ ...formData, teacherId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No teacher assigned</SelectItem>
                    {teachers.map((teacher: any) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.user.firstName} {teacher.user.lastName} - {teacher.employeeId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {selectedHierarchy ? 'Update' : 'Create'} Position
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organizational Structure</CardTitle>
          <CardDescription>
            Teacher hierarchy and reporting relationships within the school
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hierarchies.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hierarchy defined</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating organizational positions.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {renderHierarchyTree(hierarchies)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherHierarchiesPage;
