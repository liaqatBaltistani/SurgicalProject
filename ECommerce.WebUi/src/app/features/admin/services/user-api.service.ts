import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BaseApiService } from './base-api.service';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
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
export class UserApiService extends BaseApiService {
  getUsers(page: number = 1, pageSize: number = 10, role?: string): Observable<UserListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (role) {
      params = params.set('role', role);
    }
    
    return this.get<UserListResponse>('users', params);
  }

  getUser(id: string): Observable<User> {
    return this.get<User>(`users/${id}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.post<User>('users', user);
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.put<User>(`users/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.delete<void>(`users/${id}`);
  }

  updateUserRole(id: string, role: string): Observable<User> {
    return this.patch<User>(`users/${id}/role`, { role });
  }
}
