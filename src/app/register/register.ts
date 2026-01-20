import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../services/auth'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  agreeTerms: boolean = false;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: Auth
  ) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  register() {
    // Validation
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!this.agreeTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    // Call API
    this.isLoading = true;
    
    this.authService.register(this.fullName, this.email, this.password).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        alert('Registration successful!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.isLoading = false;
        
        // Handle different error scenarios
        if (error.error && error.error.message) {
          alert(error.error.message);
        } else if (error.error && error.error.errors) {
          // Laravel validation errors
          const errors = Object.values(error.error.errors).flat();
          alert(errors.join('\n'));
        } else {
          alert('Registration failed. Please try again.');
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}