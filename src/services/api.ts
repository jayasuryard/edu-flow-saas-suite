
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
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
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

  async getStudentResults(studentId: string, params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/schools/${this.schoolId}/students/${studentId}/results${query}`);
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

  // Notifications APIs
  async getNotifications(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/schools/${this.schoolId}/notifications${query}`);
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

  // Utility method to set school ID
  setSchoolId(schoolId: string) {
    this.schoolId = schoolId;
    localStorage.setItem('schoolId', schoolId);
  }
}

export const api = new SchoolManagementAPI();
export default api;
