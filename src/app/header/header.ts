import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { SidebarService } from '../services/sidebar.service';
import { Subscription } from 'rxjs';

interface Notification {
  id: number;
  companyName: string;
  message: string;
  time: string;
  type: 'demo' | 'call' | 'meeting';
}

@Component({
  selector: 'app-header',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  showProfileModal = false;
  showPasswordModal = false;
  showNotificationModal = false;
  showAllNotificationsModal = false;
  passwordForm: FormGroup;
  userEmail = 'user@example.com'; // Static dummy email
  userName: string | null = '';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  isCollapsed = false;
  private subscription: Subscription = new Subscription();

  // Static notifications - 8 total
  notifications: Notification[] = [
    {
      id: 1,
      companyName: 'Tech Solutions Inc',
      message: 'Product demo scheduled for new CRM features',
      time: '10 mins ago',
      type: 'demo'
    },
    {
      id: 2,
      companyName: 'Global Enterprises',
      message: 'Follow-up call regarding Q1 proposal',
      time: '1 hour ago',
      type: 'call'
    },
    {
      id: 3,
      companyName: 'Innovate Corp',
      message: 'Team meeting to discuss project requirements',
      time: '2 hours ago',
      type: 'meeting'
    },
    {
      id: 4,
      companyName: 'Digital Marketing Ltd',
      message: 'Demo presentation for analytics dashboard',
      time: '3 hours ago',
      type: 'demo'
    },
    {
      id: 5,
      companyName: 'Startup Hub',
      message: 'Client call scheduled to discuss partnership opportunities',
      time: '5 hours ago',
      type: 'call'
    },
    {
      id: 6,
      companyName: 'Enterprise Solutions',
      message: 'Quarterly review meeting with stakeholders',
      time: '6 hours ago',
      type: 'meeting'
    },
    {
      id: 7,
      companyName: 'Cloud Systems Inc',
      message: 'Product demo for cloud migration services',
      time: '1 day ago',
      type: 'demo'
    },
    {
      id: 8,
      companyName: 'Finance Corp',
      message: 'Follow-up meeting on budget approval',
      time: '1 day ago',
      type: 'meeting'
    }
  ];

  // Get only first 3 notifications for dropdown preview
  get recentNotifications(): Notification[] {
    return this.notifications.slice(0, 3);
  }

  constructor(private router: Router, private fb: FormBuilder, private authService: Auth, private sidebarService: SidebarService) {
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

  ngOnInit() {
    this.userName = this.authService.getUserName();
    console.log("User Name:", this.userName);
    this.subscription = this.sidebarService.isCollapsed$.subscribe(isCollapsed => {
      this.isCollapsed = isCollapsed;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

  toggleNotificationModal() {
    this.showNotificationModal = !this.showNotificationModal;
  }

  closeNotificationModal() {
    this.showNotificationModal = false;
  }

  openAllNotificationsModal() {
    this.showNotificationModal = false;
    this.showAllNotificationsModal = true;
  }

  closeAllNotificationsModal() {
    this.showAllNotificationsModal = false;
  }

  getNotificationIcon(type: string): string {
    switch(type) {
      case 'demo': return '📊';
      case 'call': return '📞';
      case 'meeting': return '📅';
      default: return '🔔';
    }
  }

  getNotificationTypeClass(type: string): string {
    return `notification-type-${type}`;
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

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  logout() {
    this.closeProfileModal();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}