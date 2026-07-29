import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.authService.saveAuthData(response);
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = response.message || 'Login failed';
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'An error occurred during login';
        this.loading = false;
      }
    });
  }
}
