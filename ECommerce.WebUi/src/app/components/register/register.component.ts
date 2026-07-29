import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  userData: RegisterRequest = {
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  };
  confirmPassword = '';
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.userData.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.userData).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.authService.saveAuthData(response);
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = response.message || 'Registration failed';
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'An error occurred during registration';
        this.loading = false;
      }
    });
  }
}
