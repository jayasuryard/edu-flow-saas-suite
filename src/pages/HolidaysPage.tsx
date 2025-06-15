
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Holiday {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  type: string;
  isRecurring: boolean;
}

const HolidaysPage = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    type: 'national',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      setIsLoading(true);
      const response = await api.getHolidays();
      if (response.success) {
        setHolidays(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch holidays:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch holidays',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const holidayData = {
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate || formData.startDate,
      type: formData.type,
      isRecurring: false,
    };

    try {
      if (selectedHoliday) {
        await api.updateHoliday(selectedHoliday.id, holidayData);
        toast({
          title: 'Success',
          description: 'Holiday updated successfully',
        });
      } else {
        await api.createHoliday(holidayData);
        toast({
          title: 'Success',
          description: 'Holiday created successfully',
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchHolidays();
    } catch (error) {
      console.error('Failed to save holiday:', error);
      toast({
        title: 'Error',
        description: 'Failed to save holiday',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setFormData({
      name: holiday.name,
      description: holiday.description,
      startDate: holiday.startDate,
      endDate: holiday.endDate,
      type: holiday.type,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (holidayId: string) => {
    if (confirm('Are you sure you want to delete this holiday?')) {
      try {
        await api.deleteHoliday(holidayId);
        toast({
          title: 'Success',
          description: 'Holiday deleted successfully',
        });
        fetchHolidays();
      } catch (error) {
        console.error('Failed to delete holiday:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete holiday',
          variant: 'destructive',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', startDate: '', endDate: '', type: 'national' });
    setSelectedHoliday(null);
  };

  const isHolidayDate = (date: Date) => {
    return holidays.some(holiday => {
      const startDate = new Date(holiday.startDate);
      const endDate = new Date(holiday.endDate);
      return date >= startDate && date <= endDate;
    });
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
          <h1 className="text-3xl font-bold text-gray-900">Holiday Calendar</h1>
          <p className="text-gray-600 mt-1">Manage school holidays and academic calendar</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Holiday
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedHoliday ? 'Edit' : 'Add'} Holiday</DialogTitle>
              <DialogDescription>
                {selectedHoliday ? 'Update' : 'Create a new'} holiday in the academic calendar.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Holiday Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Christmas Day, Summer Break"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description of the holiday"
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  placeholder="Leave empty for single day holiday"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {selectedHoliday ? 'Update' : 'Create'} Holiday
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar View */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
            <CardDescription>
              Visual representation of holidays throughout the year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                holiday: isHolidayDate,
              }}
              modifiersStyles={{
                holiday: { backgroundColor: '#fef3c7', color: '#d97706' },
              }}
            />
          </CardContent>
        </Card>

        {/* Upcoming Holidays */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Holidays</CardTitle>
            <CardDescription>
              Next holidays in the academic calendar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {holidays.filter(holiday => new Date(holiday.startDate) >= new Date()).slice(0, 5).map((holiday) => (
              <div key={holiday.id} className="flex items-center justify-between p-3 border rounded-lg mb-3 last:mb-0">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">{holiday.name}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(holiday.startDate).toLocaleDateString()}
                      {holiday.endDate !== holiday.startDate && (
                        <> - {new Date(holiday.endDate).toLocaleDateString()}</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {holidays.filter(holiday => new Date(holiday.startDate) >= new Date()).length === 0 && (
              <p className="text-gray-500 text-center py-4">No upcoming holidays</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Holidays ({holidays.length})</CardTitle>
          <CardDescription>
            Complete list of holidays in the academic calendar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {holidays.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No holidays scheduled</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding holidays to the calendar.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Holiday Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holidays.map((holiday) => {
                  const startDate = new Date(holiday.startDate);
                  const endDate = new Date(holiday.endDate);
                  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
                  
                  return (
                    <TableRow key={holiday.id}>
                      <TableCell className="font-medium">
                        {holiday.name}
                        {holiday.description && (
                          <p className="text-sm text-gray-500">{holiday.description}</p>
                        )}
                      </TableCell>
                      <TableCell>{startDate.toLocaleDateString()}</TableCell>
                      <TableCell>{endDate.toLocaleDateString()}</TableCell>
                      <TableCell>
                        {duration === 1 ? '1 day' : `${duration} days`}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(holiday)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(holiday.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HolidaysPage;
