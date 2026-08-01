import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { SearchBarComponent } from '../../shared/components/ui/search-bar/search-bar.component';
import { BreadcrumbComponent } from '../../shared/components/ui/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, SearchBarComponent, BreadcrumbComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ContactComponent {
  name = '';
  email = '';
  subject = '';
  message = '';

  constructor(private router: Router) {}

  submitForm(): void {
    // Placeholder for form submission logic
    console.log('Contact form submitted:', { name: this.name, email: this.email, subject: this.subject, message: this.message });
    alert('Thank you for your message. We will get back to you soon.');
    this.resetForm();
  }

  resetForm(): void {
    this.name = '';
    this.email = '';
    this.subject = '';
    this.message = '';
  }

  navigateToAbout(): void {
    this.router.navigate(['/about']);
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }
}
