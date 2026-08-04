import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive';
  createdDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserStore {
  private usersSignal = signal<User[]>([]);
  private selectedUserSignal = signal<User | null>(null);
  private loadingSignal = signal<boolean>(false);
  private totalItemsSignal = signal<number>(0);

  readonly users = this.usersSignal.asReadonly();
  readonly selectedUser = this.selectedUserSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly totalItems = this.totalItemsSignal.asReadonly();

  readonly activeUsers = computed(() => {
    return this.usersSignal().filter(u => u.status === 'active');
  });

  readonly adminUsers = computed(() => {
    return this.usersSignal().filter(u => u.role === 'admin');
  });

  loadUsers(page: number = 1, pageSize: number = 10): Observable<User[]> {
    this.loadingSignal.set(true);
    // Simulate API call
    const data: User[] = [
      { id: '1', email: 'admin@example.com', firstName: 'Admin', lastName: 'User', role: 'admin', status: 'active', createdDate: '2024-01-01' },
      { id: '2', email: 'manager@example.com', firstName: 'Manager', lastName: 'User', role: 'manager', status: 'active', createdDate: '2024-01-15' }
    ];
    this.usersSignal.set(data);
    this.totalItemsSignal.set(data.length);
    this.loadingSignal.set(false);
    return of(data);
  }

  selectUser(user: User): void {
    this.selectedUserSignal.set(user);
  }

  clearSelection(): void {
    this.selectedUserSignal.set(null);
  }

  addUser(user: User): void {
    this.usersSignal.update(users => [...users, user]);
    this.totalItemsSignal.update(count => count + 1);
  }

  updateUser(id: string, updates: Partial<User>): void {
    this.usersSignal.update(users =>
      users.map(u => u.id === id ? { ...u, ...updates } : u)
    );
  }

  deleteUser(id: string): void {
    this.usersSignal.update(users => users.filter(u => u.id !== id));
    this.totalItemsSignal.update(count => count - 1);
  }
}
