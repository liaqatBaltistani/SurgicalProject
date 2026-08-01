import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  placeholder = input('Search...');
  value = model('');
  debounce = input(300);
  size = input<'sm' | 'md' | 'lg'>('md');
  showClear = input(true);
  
  searched = output<string>();
  cleared = output<void>();

  private debounceTimer: any;

  onValueChange(newValue: string): void {
    this.value.set(newValue);
    
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    this.debounceTimer = setTimeout(() => {
      this.searched.emit(newValue);
    }, this.debounce());
  }

  onClear(): void {
    this.value.set('');
    this.cleared.emit();
    this.searched.emit('');
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.searched.emit(this.value());
    }
  }
}
