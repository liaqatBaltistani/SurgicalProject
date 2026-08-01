import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { BreadcrumbComponent } from '../../shared/components/ui/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, ButtonComponent, BreadcrumbComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AboutComponent {
  constructor(private router: Router) {}

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  navigateToContact(): void {
    this.router.navigate(['/contact']);
  }
}
