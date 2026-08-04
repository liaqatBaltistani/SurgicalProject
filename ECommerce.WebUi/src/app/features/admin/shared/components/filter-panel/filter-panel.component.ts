import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterGroup {
  label: string;
  type: 'select' | 'multiselect' | 'date-range' | 'number-range' | 'text';
  field: string;
  options?: FilterOption[];
  value?: any;
  min?: number;
  max?: number;
}

@Component({
  selector: 'admin-filter-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent {
  @Input() filters: FilterGroup[] = [];
  @Input() isOpen: boolean = false;
  @Input() activeFiltersCount: number = 0;

  @Output() filterChange = new EventEmitter<Record<string, any>>();
  @Output() reset = new EventEmitter<void>();
  @Output() toggle = new EventEmitter<void>();

  onFilterChange(): void {
    const filterValues: Record<string, any> = {};
    this.filters.forEach(filter => {
      if (filter.value !== undefined && filter.value !== '') {
        filterValues[filter.field] = filter.value;
      }
    });
    this.filterChange.emit(filterValues);
  }

  onReset(): void {
    this.filters.forEach(filter => {
      filter.value = undefined;
    });
    this.reset.emit();
  }

  onToggle(): void {
    this.toggle.emit();
  }

  onMultiSelectChange(filter: FilterGroup, optionValue: string): void {
    if (!Array.isArray(filter.value)) {
      filter.value = [];
    }
    const index = filter.value.indexOf(optionValue);
    if (index > -1) {
      filter.value.splice(index, 1);
    } else {
      filter.value.push(optionValue);
    }
    this.onFilterChange();
  }

  isMultiSelectSelected(filter: FilterGroup, optionValue: string): boolean {
    return Array.isArray(filter.value) && filter.value.includes(optionValue);
  }
}
