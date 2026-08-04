import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface BaseEntity {
  id: string;
  createdDate: string;
  updatedDate?: string;
}

@Injectable()
export abstract class BaseCrudService<T extends BaseEntity> {
  abstract getById(id: string): Observable<T>;
  abstract getAll(): Observable<T[]>;
  abstract create(entity: Partial<T>): Observable<T>;
  abstract update(id: string, entity: Partial<T>): Observable<T>;
  abstract delete(id: string): Observable<void>;

  protected handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    throw error;
  }
}
