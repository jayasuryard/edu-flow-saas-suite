
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExamRoom {
  id: string;
  name: string;
  capacity: number;
  location: string;
  facilities: string[];
  isActive: boolean;
}

const ExamRoomsPage = () => {
  const [examRooms, setExamRooms] = useState<ExamRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<ExamRoom | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    location: '',
    facilities: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchExamRooms();
  }, []);

  const fetchExamRooms = async () => {
    try {
      setIsLoading(true);
      const response = await api.getExamRooms();
      if (response.success) {
        setExamRooms(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch exam rooms:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch exam rooms',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const roomData = {
      name: formData.name,
      capacity: parseInt(formData.capacity),
      location: formData.location,
      facilities: formData.facilities.split(',').map(f => f.trim()),
    };

    try {
      if (selectedRoom) {
        await api.updateExamRoom(selectedRoom.id, roomData);
        toast({
          title: 'Success',
          description: 'Exam room updated successfully',
        });
      } else {
        await api.createExamRoom(roomData);
        toast({
          title: 'Success',
          description: 'Exam room created successfully',
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchExamRooms();
    } catch (error) {
      console.error('Failed to save exam room:', error);
      toast({
        title: 'Error',
        description: 'Failed to save exam room',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (room: ExamRoom) => {
    setSelectedRoom(room);
    setFormData({
      name: room.name,
      capacity: room.capacity.toString(),
      location: room.location,
      facilities: room.facilities.join(', '),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (roomId: string) => {
    if (confirm('Are you sure you want to delete this exam room?')) {
      try {
        await api.deleteExamRoom(roomId);
        toast({
          title: 'Success',
          description: 'Exam room deleted successfully',
        });
        fetchExamRooms();
      } catch (error) {
        console.error('Failed to delete exam room:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete exam room',
          variant: 'destructive',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', capacity: '', location: '', facilities: '' });
    setSelectedRoom(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Exam Rooms</h1>
          <p className="text-gray-600 mt-1">Manage examination rooms and facilities</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedRoom ? 'Edit' : 'Add'} Exam Room</DialogTitle>
              <DialogDescription>
                {selectedRoom ? 'Update' : 'Create a new'} exam room with capacity and facilities.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Room Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Room A-101"
                  required
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="e.g., 30"
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Building A, First Floor"
                  required
                />
              </div>
              <div>
                <Label htmlFor="facilities">Facilities (comma-separated)</Label>
                <Input
                  id="facilities"
                  value={formData.facilities}
                  onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                  placeholder="e.g., Projector, AC, Whiteboard"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {selectedRoom ? 'Update' : 'Create'} Room
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
          <CardTitle>Exam Rooms ({examRooms.length})</CardTitle>
          <CardDescription>
            Manage examination rooms, their capacity, and available facilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {examRooms.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No exam rooms</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new exam room.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Facilities</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>{room.location}</TableCell>
                    <TableCell>{room.capacity} students</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {room.facilities.slice(0, 3).map((facility, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                        {room.facilities.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{room.facilities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={room.isActive ? "default" : "secondary"}>
                        {room.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(room)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(room.id)}
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
    </div>
  );
};

export default ExamRoomsPage;
