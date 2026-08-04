import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'admin-toolbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, SearchBarComponent],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Input() showSearch: boolean = true;
  @Input() showFilter: boolean = true;
  @Input() showExport: boolean = true;
  @Input() showRefresh: boolean = true;
  @Input() showBulkActions: boolean = false;
  @Input() selectedCount: number = 0;
  @Input() loading: boolean = false;

  @Output() search = new EventEmitter<string>();
  @Output() filterToggle = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();
  @Output() bulkAction = new EventEmitter<string>();

  onSearch(value: string): void {
    this.search.emit(value);
  }

  onFilterToggle(): void {
    this.filterToggle.emit();
  }

  onExport(): void {
    this.export.emit();
  }

  onRefresh(): void {
    this.refresh.emit();
  }

  onBulkAction(action: string): void {
    this.bulkAction.emit(action);
  }
}
