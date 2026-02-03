import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  showProfileModal = false;

  constructor(private router: Router) {}

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
    // Navigate to change profile name page or open inline modal
    this.router.navigate(['/profile/change-name']);
    // OR implement inline name change logic here
  }

  changeProfileImage() {
    this.closeProfileModal();
    // Navigate to change profile image page or open file picker
    this.router.navigate(['/profile/change-image']);
    // OR implement inline image upload logic here
  }

  changePassword() {
    this.closeProfileModal();
    // Navigate to change password page or open change password modal
    this.router.navigate(['/change-password']);
    // OR implement inline password change logic here
  }

  logout() {
    this.closeProfileModal();
    localStorage.removeItem('token');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}