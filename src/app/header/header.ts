import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  showProfileModal = false;
  showPasswordModal = false;
  passwordForm: FormGroup;
  userEmail = 'user@example.com'; // Static dummy email
  
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(private router: Router, private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    
    if (!newPassword || !confirmPassword) {
      return null;
    }
    
    return newPassword.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  masters() {
    this.router.navigate(['/leadassignee']);
  }

  toggleProfileModal() {
    this.showProfileModal = !this.showProfileModal;
  }

  closeProfileModal() {
    this.showProfileModal = false;
  }

  changeProfile() {
    this.closeProfileModal();
    this.router.navigate(['/profile/change-name']);
  }

  changeProfileImage() {
    this.closeProfileModal();
    this.router.navigate(['/profile/change-image']);
  }

  changePassword() {
    this.closeProfileModal();
    this.showPasswordModal = true;
    this.passwordForm.reset();
  }

  closePasswordModal() {
    this.showPasswordModal = false;
    this.passwordForm.reset();
  }

  toggleCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmitPassword() {
    if (this.passwordForm.valid) {
      const formData = this.passwordForm.value;
      console.log('Password change data:', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      // Here you would typically call your API service to change the password
      // this.authService.changePassword(formData).subscribe(...)
      
      alert('Password changed successfully!');
      this.closePasswordModal();
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.passwordForm.controls).forEach(key => {
        this.passwordForm.get(key)?.markAsTouched();
      });
    }
  }

  logout() {
    this.closeProfileModal();
    localStorage.removeItem('token');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}