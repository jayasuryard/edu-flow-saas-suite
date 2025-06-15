
const BASE_URL = 'https://team1-test-dev.ryoforge.com/api';

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId?: any;
  isActive: boolean;
  lastLogin?: string;
}

export interface School {
  id: string;
  name: string;
  domain: string;
  email: string;
  phone: string;
  address: any;
  status: string;
  subscriptionPlan: string;
  maxStudents: number;
  maxTeachers: number;
}

export interface Student {
  id: string;
  studentId: string;
  user: User;
  class: any;
  admissionNumber: string;
  admissionDate: string;
  parentContact: any;
  academicInfo: any;
}

export interface Teacher {
  id: string;
  teacherId: string;
  user: User;
  employeeId: string;
  qualification: string[];
  experience: number;
  subjects: any[];
  classes: any[];
}

export interface Class {
  id: string;
  name: string;
  grade: number;
  description: string;
  capacity: number;
  classTeacher: any;
  subjects: any[];
  academicYear: string;
  studentCount: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  type: string;
  credits: number;
  classes: any[];
  teachers: any[];
}

export interface Exam {
  id: string;
  name: string;
  type: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  classes: any[];
  subjects: any[];
  status: string;
}

// API Class
class SchoolManagementAPI {
  private token: string | null = null;
  private schoolId: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
    this.schoolId = localStorage.getItem('schoolId');
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': window.location.origin,
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors',
        credentials: 'include',
      });

      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        // Create a structured error
        const error = new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        (error as any).code = data.code;
        (error as any).response = { data, status: response.status };
        
        // Handle specific status codes
        if (response.status === 401) {
          // Token expired or invalid
          this.token = null;
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        
        throw error;
      }

      return data;
    } catch (error: any) {
      // Handle CORS and network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        error.message = 'Network error or CORS issue. Please check your connection and server configuration.';
      } else if (!error.status) {
        error.message = 'Network error. Please check your connection.';
      }
      throw error;
    }
  }

  // Auth APIs
  async register(data: any) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.success) {
      this.token = response.data.tokens.accessToken;
      localStorage.setItem('token', this.token!);
      if (response.data.tenant?.id) {
        this.schoolId = response.data.tenant.id;
        localStorage.setItem('schoolId', this.schoolId!);
      }
    }
    return response;
  }

  async login(data: any) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.success) {
      this.token = response.data.tokens.accessToken;
      localStorage.setItem('token', this.token!);
      // Extract school ID from user data or make a profile call
      const profile = await this.getProfile();
      if (profile.data.tenant?.id) {
        this.schoolId = profile.data.tenant.id;
        localStorage.setItem('schoolId', this.schoolId!);
      }
    }
    return response;
  }

  async logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await this.request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    }
    this.token = null;
    this.schoolId = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('schoolId');
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(resetToken: string, newPassword: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ resetToken, newPassword }),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // Students APIs
  async getStudents(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/schools/${this.schoolId}/students${query}`);
  }

  async getStudent(id: string) {
    return this.request(`/schools/${this.schoolId}/students/${id}`);
  }

  async createStudent(data: any) {
    return this.request(`/schools/${this.schoolId}/students`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStudent(id: string, data: any) {
    return this.request(`/schools/${this.schoolId}/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStudent(id: string) {
    return this.request(`/schools/${this.schoolId}/students/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkCreateStudents(students: any[]) {
    return this.request(`/schools/${this.schoolId}/students/bulk`, {
      method: 'POST',
      body: JSON.stringify({ students }),
    });
  }

  async getStudentResults(studentId: string, params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/schools/${this.schoolId}/students/${studentId}/results${query}`);
  }

  async exportStudents() {
    return this.request(`/schools/${this.schoolId}/export/students`);
  }

  async importStudents(formData: FormData) {
    return this.request(`/schools/${this.schoolId}/import/students`, {
      method: 'POST',
      body: formData,
    });
  }

  // Teachers APIs
  async getTeachers(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/schools/${this.schoolId}/teachers${query}`);
  }

  async getTeacher(id: string) {
    return this.request(`/schools/${this.schoolId}/teachers/${id}`);
  }

  async createTeacher(data: any) {
    return this.request(`/schools/${this.schoolId}/teachers`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTeacher(id: string, data: any) {
    return this.request(`/schools/${this.schoolId}/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTeacher(id: string) {
    return this.request(`/schools/${this.schoolId}/teachers/${id}`, {
      method: 'DELETE',
    });
  }

  async assignSubjectsToTeacher(teacherId: string, subjectIds: string[]) {
    return this.request(`/schools/${this.schoolId}/teachers/${teacherId}/subjects`, {
      method: 'POST',
      body: JSON.stringify({ subjectIds }),
    });
  }

  async assignClassesToTeacher(teacherId: string, classIds: string[]) {
    return this.request(`/schools/${this.schoolId}/teachers/${teacherId}/classes`, {
      method: 'POST',
      body: JSON.stringify({ classIds }),
    });
  }

  async getTeacherAvailability(examDate?: string) {
    const query = examDate ? `?examDate=${examDate}` : '';
    return this.request(`/schools/${this.schoolId}/teachers/availability${query}`);
  }

  // Classes APIs
  async getClasses(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/schools/${this.schoolId}/classes${query}`);
  }

  async getClass(id: string) {
    return this.request(`/schools/${this.schoolId}/classes/${id}`);
  }

  async createClass(data: any) {
    return this.request(`/schools/${this.schoolId}/classes`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClass(id: string, data: any) {
    return this.request(`/schools/${this.schoolId}/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteClass(id: string) {
    return this.request(`/schools/${this.schoolId}/classes/${id}`, {
      method: 'DELETE',
    });
  }

  async assignSubjectsToClass(classId: string, subjectIds: string[]) {
    return this.request(`/schools/${this.schoolId}/classes/${classId}/subjects`, {
      method: 'POST',
      body: JSON.stringify({ subjectIds }),
    });
  }

  // Subjects APIs
  async getSubjects(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/schools/${this.schoolId}/subjects${query}`);
  }

  async getSubject(id: string) {
    return this.request(`/schools/${this.schoolId}/subjects/${id}`);
  }

  async createSubject(data: any) {
    return this.request(`/schools/${this.schoolId}/subjects`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSubject(id: string, data: any) {
    return this.request(`/schools/${this.schoolId}/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSubject(id: string) {
    return this.request(`/schools/${this.schoolId}/subjects/${id}`, {
      method: 'DELETE',
    });
  }

  // Timetables APIs
  async getClassTimetable(classId: string) {
    return this.request(`/schools/${this.schoolId}/timetables/class/${classId}`);
  }

  async createTimetable(data: any) {
    return this.request(`/schools/${this.schoolId}/timetables`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTimetable(id: string, data: any) {
    return this.request(`/schools/${this.schoolId}/timetables/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTimetable(id: string) {
    return this.request(`/schools/${this.schoolId}/timetables/${id}`, {
      method: 'DELETE',
    });
  }

  async getTodaySchedule(classId: string) {
    return this.request(`/schools/${this.schoolId}/timetables/today/${classId}`);
  }

  // Attendance APIs
  async markAttendance(classId: string, data: any) {
    return this.request(`/schools/${this.schoolId}/attendance/class/${classId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getClassAttendance(classId: string, params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/schools/${this.schoolId}/attendance/class/${classId}${query}`);
  }

  async getStudentAttendance(studentId: string, params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/schools/${this.schoolId}/attendance/student/${studentId}${query}`);
  }

  async getAttendanceStats(classId: string) {
    return this.request(`/schools/${this.schoolId}/attendance/stats/${classId}`);
  }

  // Exams APIs
  async getExams(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/schools/${this.schoolId}/exams${query}`);
  }

  async getExam(id: string) {
    return this.request(`/schools/${this.schoolId}/exams/${id}`);
  }

  async createExam(data: any) {
    return this.request(`/schools/${this.schoolId}/exams`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateExam(id: string, data: any) {
    return this.request(`/schools/${this.schoolId}/exams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteExam(id: string) {
    return this.request(`/schools/${this.schoolId}/exams/${id}`, {
      method: 'DELETE',
    });
  }

  async getExamSeatAllocations(examId: string) {
    return this.request(`/schools/${this.schoolId}/exams/${examId}/seat-allocations`);
  }

  async sendSeatAllocationNotifications(examId: string) {
    return this.request(`/schools/${this.schoolId}/exams/${examId}/notifications/seat-allocations`, {
      method: 'POST',
    });
  }

  async getExamDuties(examId: string) {
    return this.request(`/schools/${this.schoolId}/exams/${examId}/duties`);
  }

  async sendDutyNotifications(examId: string) {
    return this.request(`/schools/${this.schoolId}/exams/${examId}/notifications/duties`, {
      method: 'POST',
    });
  }

  async getExamSeatAllocationReport(examId: string) {
    return this.request(`/schools/${this.schoolId}/exams/${examId}/reports/seat-allocations`);
  }

  async getExamDutyRosterReport(examId: string) {
    return this.request(`/schools/${this.schoolId}/exams/${examId}/reports/duty-roster`);
  }

  async bulkImportExamStudents(examId: string, students: any[]) {
    return this.request(`/schools/${this.schoolId}/exams/${examId}/bulk-import/students`, {
      method: 'POST',
      body: JSON.stringify({ students }),
    });
  }

  async submitExamResults(examId: string, results: any[]) {
    return this.request(`/schools/${this.schoolId}/exams/${examId}/results`, {
      method: 'POST',
      body: JSON.stringify({ results }),
    });
  }

  async getExamResults(examId: string, params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/schools/${this.schoolId}/exams/${examId}/results${query}`);
  }

  // Exam Rooms APIs
  async getExamRooms(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/schools/${this.schoolId}/exam-rooms${query}`);
  }

  async createExamRoom(data: any) {
    return this.request(`/schools/${this.schoolId}/exam-rooms`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateExamRoom(roomId: string, data: any) {
    return this.request(`/schools/${this.schoolId}/exam-rooms/${roomId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteExamRoom(roomId: string) {
    return this.request(`/schools/${this.schoolId}/exam-rooms/${roomId}`, {
      method: 'DELETE',
    });
  }

  async getExamRoomAvailability(examDate?: string) {
    const query = examDate ? `?examDate=${examDate}` : '';
    return this.request(`/schools/${this.schoolId}/exam-rooms/availability${query}`);
  }

  // Teacher Hierarchies APIs
  async getTeacherHierarchies(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/schools/${this.schoolId}/teacher-hierarchies${query}`);
  }

  async createTeacherHierarchy(data: any) {
    return this.request(`/schools/${this.schoolId}/teacher-hierarchies`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTeacherHierarchy(hierarchyId: string, data: any) {
    return this.request(`/schools/${this.schoolId}/teacher-hierarchies/${hierarchyId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getTeacherHierarchyStructure() {
    return this.request(`/schools/${this.schoolId}/teacher-hierarchies/structure`);
  }

  async assignClassesToHierarchy(hierarchyId: string, classIds: string[]) {
    return this.request(`/schools/${this.schoolId}/teacher-hierarchies/${hierarchyId}/assign-classes`, {
      method: 'POST',
      body: JSON.stringify({ classIds }),
    });
  }

  async assignSubjectsToHierarchy(hierarchyId: string, subjectIds: string[]) {
    return this.request(`/schools/${this.schoolId}/teacher-hierarchies/${hierarchyId}/assign-subjects`, {
      method: 'POST',
      body: JSON.stringify({ subjectIds }),
    });
  }

  // Notifications APIs
  async getNotifications(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/schools/${this.schoolId}/notifications${query}`);
  }

  async createNotification(data: any) {
    return this.request(`/schools/${this.schoolId}/notifications`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request(`/schools/${this.schoolId}/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request(`/schools/${this.schoolId}/notifications/mark-all-read`, {
      method: 'PATCH',
    });
  }

  async getNotificationStats() {
    return this.request(`/schools/${this.schoolId}/notifications/stats`);
  }

  async createBulkNotification(data: any) {
    return this.request(`/schools/${this.schoolId}/notifications/bulk`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Promotions APIs
  async processPromotions(data: any) {
    return this.request(`/schools/${this.schoolId}/promotions/process`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPromotions(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/schools/${this.schoolId}/promotions${query}`);
  }

  // Announcements APIs
  async getAnnouncements(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/schools/${this.schoolId}/announcements${query}`);
  }

  async getAnnouncement(id: string) {
    return this.request(`/schools/${this.schoolId}/announcements/${id}`);
  }

  async createAnnouncement(data: any) {
    return this.request(`/schools/${this.schoolId}/announcements`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAnnouncement(id: string, data: any) {
    return this.request(`/schools/${this.schoolId}/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAnnouncement(id: string) {
    return this.request(`/schools/${this.schoolId}/announcements/${id}`, {
      method: 'DELETE',
    });
  }

  async getAnnouncementStats(id: string) {
    return this.request(`/schools/${this.schoolId}/announcements/${id}/stats`);
  }

  // Holidays APIs
  async getHolidays(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/schools/${this.schoolId}/holidays${query}`);
  }

  async createHoliday(data: any) {
    return this.request(`/schools/${this.schoolId}/holidays`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateHoliday(id: string, data: any) {
    return this.request(`/schools/${this.schoolId}/holidays/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteHoliday(id: string) {
    return this.request(`/schools/${this.schoolId}/holidays/${id}`, {
      method: 'DELETE',
    });
  }

  // Calendar Events APIs
  async getCalendarEvents(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/schools/${this.schoolId}/calendar/events${query}`);
  }

  async createCalendarEvent(data: any) {
    return this.request(`/schools/${this.schoolId}/calendar/events`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCalendarEvent(id: string, data: any) {
    return this.request(`/schools/${this.schoolId}/calendar/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCalendarEvent(id: string) {
    return this.request(`/schools/${this.schoolId}/calendar/events/${id}`, {
      method: 'DELETE',
    });
  }

  async updateEventAttendance(id: string, status: string) {
    return this.request(`/schools/${this.schoolId}/calendar/events/${id}/attendance`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Admin APIs
  async getSchoolDashboard() {
    return this.request(`/admin/schools/${this.schoolId}/dashboard`);
  }

  async getSchoolSettings() {
    return this.request(`/admin/schools/${this.schoolId}/settings`);
  }

  async updateSchoolSettings(data: any) {
    return this.request(`/admin/schools/${this.schoolId}/settings`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getSchoolAdmins() {
    return this.request(`/admin/schools/${this.schoolId}/admins`);
  }

  async createSchoolAdmin(data: any) {
    return this.request(`/admin/schools/${this.schoolId}/admins`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAllSchoolAdmins(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/admin/school-admins${query}`);
  }

  async getSchoolAdmin(id: string) {
    return this.request(`/admin/school-admins/${id}`);
  }

  async updateSchoolAdmin(id: string, data: any) {
    return this.request(`/admin/school-admins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateSchoolAdminStatus(id: string, isActive: boolean) {
    return this.request(`/admin/school-admins/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }

  // Superadmin APIs
  async getSuperadminDashboard() {
    return this.request('/superadmin/dashboard');
  }

  async getSuperadminAnalytics() {
    return this.request('/superadmin/analytics');
  }

  async getAllTenants(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/superadmin/tenants${query}`);
  }

  async getTenant(id: string) {
    return this.request(`/superadmin/tenants/${id}`);
  }

  async createTenant(data: any) {
    return this.request('/superadmin/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTenant(id: string, data: any) {
    return this.request(`/superadmin/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTenant(id: string) {
    return this.request(`/superadmin/tenants/${id}`, {
      method: 'DELETE',
    });
  }

  async updateTenantStatus(id: string, status: string, reason?: string) {
    return this.request(`/superadmin/tenants/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
  }

  async getAllUsers(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/superadmin/users${query}`);
  }

  // System APIs
  async getSystemHealth() {
    return this.request('/health');
  }

  async initSuperAdmin(data: any) {
    return this.request('/init-super-admin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSystemStats() {
    return this.request('/system/stats');
  }

  // Utility method to set school ID
  setSchoolId(schoolId: string) {
    this.schoolId = schoolId;
    localStorage.setItem('schoolId', schoolId);
  }
}

export const api = new SchoolManagementAPI();
export default api;
