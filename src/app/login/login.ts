import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../services/auth'; // Adjust path as needed

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email: string = '';
  password: string = '';
  rememberDevice: boolean = false;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: Auth
  ) {}

  login() {
    // Validation
    if (!this.email || !this.password) {
      alert('Please enter email and password');
      return;
    }

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      alert('Please enter a valid email address');
      return;
    }

    this.isLoading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        
        // Save token if your Laravel API returns one
        if (response.token) {
          this.authService.saveToken(response.token);
        }

        // Save user data if needed
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }

        alert('Login successful!');
        this.router.navigate(['/leads']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.isLoading = false;
        
        // Handle different error scenarios
        if (error.status === 401) {
          alert('Invalid email or password');
        } else if (error.error && error.error.message) {
          alert(error.error.message);
        } else if (error.error && error.error.errors) {
          // Laravel validation errors
          const errors = Object.values(error.error.errors).flat();
          alert(errors.join('\n'));
        } else {
          alert('Login failed. Please try again.');
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  forgotPassword() {
    // Implement forgot password functionality
    alert('Forgot password functionality to be implemented');
  }

  createAccount() {
    this.router.navigate(['/register']);
  }
}