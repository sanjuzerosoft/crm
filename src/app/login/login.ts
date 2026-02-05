import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';

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
  showPassword: boolean = false;

  // Error Messages for Login
  emailError: string = '';
  passwordError: string = '';
  generalError: string = '';

  // Forgot Password Modal Properties
  showForgotPasswordModal: boolean = false;
  resetEmail: string = '';
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  otpSent: boolean = false;
  isSendingOTP: boolean = false;
  isResettingPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Error Messages for Reset Password
  resetEmailError: string = '';
  otpError: string = '';
  newPasswordError: string = '';
  confirmPasswordError: string = '';

  constructor(
    private router: Router,
    private authService: Auth
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
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
    
    if (this.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters';
      return false;
    }
    
    return true;
  }

  validateLoginForm(): boolean {
    const isEmailValid = this.validateEmail();
    const isPasswordValid = this.validatePassword();
    
    return isEmailValid && isPasswordValid;
  }

  login() {
    // Clear previous errors
    this.generalError = '';

    // Validate form
    if (!this.validateLoginForm()) {
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

        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.isLoading = false;
        
        // Handle different error scenarios
        if (error.status === 401) {
          this.generalError = 'Invalid email or password';
        } else if (error.error && error.error.message) {
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
        } else {
          this.generalError = 'Login failed. Please try again.';
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  forgotPassword() {
    this.showForgotPasswordModal = true;
    this.resetForgotPasswordForm();
  }

  closeForgotPasswordModal() {
    this.showForgotPasswordModal = false;
    this.resetForgotPasswordForm();
  }

  resetForgotPasswordForm() {
    this.resetEmail = '';
    this.otp = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.otpSent = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
    this.clearResetErrors();
  }

  clearResetErrors() {
    this.resetEmailError = '';
    this.otpError = '';
    this.newPasswordError = '';
    this.confirmPasswordError = '';
  }

  validateResetEmail(): boolean {
    this.resetEmailError = '';
    
    if (!this.resetEmail.trim()) {
      this.resetEmailError = 'Email is required';
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.resetEmail)) {
      this.resetEmailError = 'Please enter a valid email address';
      return false;
    }
    
    return true;
  }

  sendOTP() {
    // Validate email
    if (!this.validateResetEmail()) {
      return;
    }

    this.isSendingOTP = true;
    
    // Show OTP fields immediately
    this.otpSent = true;
    this.isSendingOTP = false;
    
    // Optional: Call API to send OTP
    // this.authService.sendPasswordResetOTP(this.resetEmail).subscribe({
    //   next: (response) => {
    //     console.log('OTP sent successfully:', response);
    //     this.otpSent = true;
    //   },
    //   error: (error) => {
    //     console.error('Send OTP error:', error);
    //     this.resetEmailError = error.error?.message || 'Failed to send OTP';
    //     this.otpSent = false;
    //   },
    //   complete: () => {
    //     this.isSendingOTP = false;
    //   }
    // });
  }

  validateOTP(): boolean {
    this.otpError = '';
    
    if (!this.otp) {
      this.otpError = 'OTP is required';
      return false;
    }
    
    if (this.otp.length !== 6) {
      this.otpError = 'OTP must be 6 digits';
      return false;
    }
    
    if (!/^\d+$/.test(this.otp)) {
      this.otpError = 'OTP must contain only numbers';
      return false;
    }
    
    return true;
  }

  validateNewPassword(): boolean {
    this.newPasswordError = '';
    
    if (!this.newPassword) {
      this.newPasswordError = 'New password is required';
      return false;
    }
    
    if (this.newPassword.length < 8) {
      this.newPasswordError = 'Password must be at least 8 characters';
      return false;
    }
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(this.newPassword)) {
      this.newPasswordError = 'Password must contain at least one uppercase letter';
      return false;
    }
    
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(this.newPassword)) {
      this.newPasswordError = 'Password must contain at least one lowercase letter';
      return false;
    }
    
    // Check for at least one number
    if (!/[0-9]/.test(this.newPassword)) {
      this.newPasswordError = 'Password must contain at least one number';
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
    
    if (this.newPassword !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match';
      return false;
    }
    
    return true;
  }

  resetPassword() {
    this.clearResetErrors();

    // Validate all fields
    const isOTPValid = this.validateOTP();
    const isNewPasswordValid = this.validateNewPassword();
    const isConfirmPasswordValid = this.validateConfirmPassword();

    if (!isOTPValid || !isNewPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    this.isResettingPassword = true;

    // Call your API to reset password
    this.authService.resetPassword(this.resetEmail, this.otp, this.newPassword, this.confirmPassword).subscribe({
      next: (response) => {
        console.log('Password reset successful:', response);
        alert('Password has been reset successfully');
        this.closeForgotPasswordModal();
      },
      error: (error) => {
        console.error('Reset password error:', error);
        if (error.error && error.error.message) {
          this.otpError = error.error.message;
        } else if (error.error && error.error.errors) {
          const errors = error.error.errors;
          if (errors.otp) this.otpError = errors.otp[0];
          if (errors.password) this.newPasswordError = errors.password[0];
          if (errors.email) this.resetEmailError = errors.email[0];
        } else {
          this.otpError = 'Failed to reset password. Please try again.';
        }
      },
      complete: () => {
        this.isResettingPassword = false;
      }
    });
  }

  createAccount() {
    this.router.navigate(['/register']);
  }
}