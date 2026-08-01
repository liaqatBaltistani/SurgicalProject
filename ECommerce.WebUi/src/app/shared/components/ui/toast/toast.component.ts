import { Component, input, output, model, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('250ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent {
  open = model(false);
  type = input<ToastType>('info');
  title = input('');
  message = input('');
  duration = input(5000);
  position = input<ToastPosition>('top-right');
  showClose = input(true);
  
  closed = output<void>();

  private timer: any;

  constructor() {
    effect(() => {
      if (this.open()) {
        this.startTimer();
      } else {
        this.clearTimer();
      }
    });
  }

  close(): void {
    this.open.set(false);
    this.closed.emit();
  }

  private startTimer(): void {
    this.clearTimer();
    if (this.duration() > 0) {
      this.timer = setTimeout(() => {
        this.close();
      }, this.duration());
    }
  }

  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
