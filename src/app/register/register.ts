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
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Error messages
  fullNameError: string = '';
  emailError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';
  termsError: string = '';
  generalError: string = '';

  constructor(
    private router: Router,
    private authService: Auth
  ) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  validateFullName(): boolean {
    this.fullNameError = '';
    
    if (!this.fullName.trim()) {
      this.fullNameError = 'Full name is required';
      return false;
    }
    
    if (this.fullName.trim().length < 2) {
      this.fullNameError = 'Full name must be at least 2 characters';
      return false;
    }
    
    return true;
  }

  validateEmail(): boolean {
    this.emailError = '';
    
    if (!this.email.trim()) {
      this.emailError = 'Email is required';
      return false;
    }
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      this.emailError = 'Please enter a valid email address';
      return false;
    }
    
    return true;
  }

  validatePassword(): boolean {
    this.passwordError = '';
    
    if (!this.password) {
      this.passwordError = 'Password is required';
      return false;
    }
    
    if (this.password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters';
      return false;
    }
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(this.password)) {
      this.passwordError = 'Password must contain at least one uppercase letter';
      return false;
    }
    
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(this.password)) {
      this.passwordError = 'Password must contain at least one lowercase letter';
      return false;
    }
    
    // Check for at least one number
    if (!/[0-9]/.test(this.password)) {
      this.passwordError = 'Password must contain at least one number';
      return false;
    }
    
    return true;
  }

  validateConfirmPassword(): boolean {
    this.confirmPasswordError = '';
    
    if (!this.confirmPassword) {
      this.confirmPasswordError = 'Please confirm your password';
      return false;
    }
    
    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match';
      return false;
    }
    
    return true;
  }

  validateTerms(): boolean {
    this.termsError = '';
    
    if (!this.agreeTerms) {
      this.termsError = 'You must agree to the Terms & Conditions';
      return false;
    }
    
    return true;
  }

  validateForm(): boolean {
    const isFullNameValid = this.validateFullName();
    const isEmailValid = this.validateEmail();
    const isPasswordValid = this.validatePassword();
    const isConfirmPasswordValid = this.validateConfirmPassword();
    const isTermsValid = this.validateTerms();
    
    return isFullNameValid && isEmailValid && isPasswordValid && 
           isConfirmPasswordValid && isTermsValid;
  }

  register() {
    // Clear previous errors
    this.generalError = '';
    
    // Validate all fields
    if (!this.validateForm()) {
      return;
    }

    // Call API
    this.isLoading = true;
    
    this.authService.register(this.fullName, this.email, this.password).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.isLoading = false;
        
        // Handle different error scenarios
        if (error.error && error.error.message) {
          this.generalError = error.error.message;
        } else if (error.error && error.error.errors) {
          // Laravel validation errors
          const errors = error.error.errors;
          
          if (errors.email) {
            this.emailError = errors.email[0];
          }
          if (errors.password) {
            this.passwordError = errors.password[0];
          }
          if (errors.name || errors.fullName) {
            this.fullNameError = errors.name?.[0] || errors.fullName?.[0];
          }
        } else {
          this.generalError = 'Registration failed. Please try again.';
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}