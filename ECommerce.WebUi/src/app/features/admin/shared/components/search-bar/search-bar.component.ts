import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'admin-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Input() placeholder: string = 'Search...';
  @Input() value: string = '';
  @Input() loading: boolean = false;
  @Input() debounceMs: number = 300;

  @Output() searchChange = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(this.debounceMs),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchChange.emit(searchTerm);
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.searchSubject.next(this.value);
  }

  onClear(): void {
    this.value = '';
    this.searchSubject.next('');
    this.clear.emit();
  }

  hasValue(): boolean {
    return this.value.length > 0;
  }
}
