import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { ActionMenuComponent } from '../action-menu/action-menu.component';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { PaginationComponent } from '../pagination/pagination.component';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'image' | 'badge' | 'action';
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableAction {
  label: string;
  icon: string;
  action: string;
  color?: 'primary' | 'accent' | 'warn';
}

@Component({
  selector: 'admin-data-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatIconModule, MatButtonModule, StatusBadgeComponent, ActionMenuComponent, SkeletonLoaderComponent, EmptyStateComponent, PaginationComponent],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent<T> {
  @Input() columns: TableColumn[] = [];
  @Input() data: T[] = [];
  @Input() loading: boolean = false;
  @Input() selectable: boolean = false;
  @Input() showActions: boolean = false;
  @Input() actions: TableAction[] = [];
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;

  @Output() pageChange = new EventEmitter<{ page: number; size: number }>();
  @Output() sortChange = new EventEmitter<{ active: string; direction: string }>();
  @Output() rowClick = new EventEmitter<T>();
  @Output() selectionChange = new EventEmitter<T[]>();
  @Output() actionClick = new EventEmitter<{ action: string; row: T }>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<T>();
  selectedRows: Set<T> = new Set();
  displayedColumns: string[] = [];

  ngOnInit(): void {
    this.updateDisplayedColumns();
  }

  ngOnChanges(): void {
    this.dataSource.data = this.data;
    this.updateDisplayedColumns();
  }

  private updateDisplayedColumns(): void {
    this.displayedColumns = this.columns.map(col => col.key);
    if (this.selectable) {
      this.displayedColumns.unshift('select');
    }
    if (this.showActions) {
      this.displayedColumns.push('actions');
    }
  }

  onRowClick(row: T): void {
    if (!this.selectable) {
      this.rowClick.emit(row);
    }
  }

  onSelectAll(event: any): void {
    if (event.checked) {
      this.selectedRows = new Set(this.data);
    } else {
      this.selectedRows.clear();
    }
    this.selectionChange.emit(Array.from(this.selectedRows));
  }

  onRowSelect(row: T, event: any): void {
    if (event.checked) {
      this.selectedRows.add(row);
    } else {
      this.selectedRows.delete(row);
    }
    this.selectionChange.emit(Array.from(this.selectedRows));
  }

  onActionClick(action: string, row: T): void {
    this.actionClick.emit({ action, row });
  }

  isAllSelected(): boolean {
    return this.selectedRows.size > 0 && this.selectedRows.size === this.data.length;
  }

  isSomeSelected(): boolean {
    return this.selectedRows.size > 0 && this.selectedRows.size < this.data.length;
  }

  isRowSelected(row: T): boolean {
    return this.selectedRows.has(row);
  }

  onPageChanged(event: any): void {
    this.pageChange.emit({ page: event.pageIndex + 1, size: event.pageSize });
  }

  getCellValue(row: T, column: TableColumn): any {
    const keys = column.key.split('.');
    let value: any = row;
    for (const key of keys) {
      value = value?.[key];
    }
    // Handle null/undefined values
    if (value === null || value === undefined) {
      return '-';
    }
    return value;
  }

  isColumnSortable(column: TableColumn): boolean {
    return column.sortable !== false;
  }
}
