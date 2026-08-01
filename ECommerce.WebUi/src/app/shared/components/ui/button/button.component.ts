import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  disabled = input(false);
  loading = input(false);
  fullWidth = input(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  
  clicked = output<void>();

  isDisabled = computed(() => this.disabled() || this.loading());

  getButtonClasses(): string {
    const classes: string[] = [
      this.variant(),
      this.size()
    ];
    
    if (this.fullWidth()) {
      classes.push('full-width');
    }
    
    if (this.isDisabled()) {
      classes.push('disabled');
    }
    
    return classes.join(' ');
  }

  handleClick(event: Event): void {
    if (!this.isDisabled()) {
      event.preventDefault();
      this.clicked.emit();
    }
  }
}
