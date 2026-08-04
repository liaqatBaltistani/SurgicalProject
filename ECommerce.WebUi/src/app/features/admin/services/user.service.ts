import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// MOCK SERVICE - No backend API currently exists for Users
// This service provides mock data for the user module
// TODO: Replace with real API integration when backend endpoint is available

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Staff';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdDate: string;
}

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  getUsers(page: number = 1, pageSize: number = 10): Observable<UserListResponse> {
    // Mock data - replace with API call when available
    const mockData: User[] = [
      { id: '1', firstName: 'John', lastName: 'Admin', email: 'admin@example.com', role: 'Admin', status: 'active', lastLogin: '2024-01-20T10:30:00', createdDate: '2024-01-01' },
      { id: '2', firstName: 'Jane', lastName: 'Manager', email: 'manager@example.com', role: 'Manager', status: 'active', lastLogin: '2024-01-19T15:45:00', createdDate: '2024-01-05' },
      { id: '3', firstName: 'Bob', lastName: 'Staff', email: 'staff@example.com', role: 'Staff', status: 'inactive', lastLogin: '2024-01-10T09:00:00', createdDate: '2024-01-10' }
    ];
    return of({ data: mockData, total: mockData.length, page, pageSize });
  }

  getUser(id: string): Observable<User> {
    // Mock data - replace with API call when available
    const mockUser: User = {
      id,
      firstName: 'John',
      lastName: 'Admin',
      email: 'admin@example.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2024-01-20T10:30:00',
      createdDate: '2024-01-01'
    };
    return of(mockUser);
  }
}
