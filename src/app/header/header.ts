import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { SidebarService } from '../services/sidebar.service';
import { from, Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

// ─── Raw API Response Shape ────────────────────────────────────────────────────
interface ActivityApiResponse {
  id: number;
  activity_date: string;
  type: string;
  description: string;
  activity_type: 'demo' | 'call' | 'meeting';
  scheduled_date: string;   // "2026-02-26"
  scheduled_time: string;   // "11:00:00"
  lead_id: number | null;
  customer_id: number | null;
  project_id: number | null;
  lead: {
    company_name: string;
    first_name: string;
    last_name: string;
  } | null;
  customer: {
    company_name: string;
    first_name: string;
    last_name: string;
  } | null;
  project: {
    name: string;
  } | null;
}

// ─── Internal Notification Shape ──────────────────────────────────────────────
export interface Notification {
  id: number;
  companyName: string;
  description: string;
  type: 'demo' | 'call' | 'meeting';
  scheduledDate: Date;
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
  userEmail = 'user@example.com';
  userName: string | null = '';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  isCollapsed = false;
  private subscription: Subscription = new Subscription();
  private notificationTimer: any;

  // ─── Clear 1 hour AFTER scheduled time ───────────────────────────────────
  private readonly CLEAR_AFTER_MS = 1 * 60 * 60 * 1000;

  private allNotifications: Notification[] = [];
  notifications: Notification[] = [];

  get recentNotifications(): Notification[] {
    return this.notifications.slice(0, 3);
  }

  // ─── Static description per activity_type ────────────────────────────────
  private static readonly DESCRIPTION_MAP: Record<string, string> = {
    demo: 'A product demo has been scheduled for you.',
    call: 'A follow-up call has been scheduled.',
    meeting: 'A meeting has been scheduled with the team.',
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: Auth,
    private http: HttpClient,
    private sidebarService: SidebarService,
    private cdr: ChangeDetectorRef
  ) {
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
    this.subscription = this.sidebarService.isCollapsed$.subscribe(v => this.isCollapsed = v);

    this.fetchNotifications();

    // Re-filter every minute so expired ones auto-disappear
    this.notificationTimer = setInterval(() => this.filterNotifications(), 60 * 1000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.notificationTimer) clearInterval(this.notificationTimer);
  }

  // ─── Fetch from API ───────────────────────────────────────────────────────
  private fetchNotifications(): void {
    this.http.get<ActivityApiResponse[]>(`${this.authService.apiUrl}/activities`).subscribe({
      next: (data) => {
        this.allNotifications = data.map(item => this.mapToNotification(item));
        this.filterNotifications();

        this.cdr.detectChanges(); // ✅ FORCE UI REFRESH
      },
      error: (err) => console.error('Failed to load notifications:', err)
    });
  }

  // ─── Map API response → Notification ─────────────────────────────────────
  private mapToNotification(item: ActivityApiResponse): Notification {
    const companyName =
      item.lead?.company_name ||
      item.customer?.company_name ||
      item.project?.name ||
      'Unknown Company';

    const description =
      `A ${item.activity_type} has been scheduled. Kindly remember to attend.`;

    // Parse scheduled_date + scheduled_time as LOCAL time (not UTC)
    // "2026-02-25" + "12:06:00" → local Date object
    const scheduledDate = new Date(`${item.scheduled_date}T${item.scheduled_time}`);

    return { id: item.id, companyName, description, type: item.activity_type, scheduledDate };
  }

  // ─── Filter logic ─────────────────────────────────────────────────────────
  // Show from:  midnight of the PREVIOUS calendar day (day before scheduled date)
  // Clear at:   1 hour AFTER the scheduled time on the scheduled date
  private filterNotifications(): void {
    const now = Date.now();

    this.notifications = this.allNotifications.filter(n => {
      const scheduled = n.scheduledDate;

      // showFrom = midnight of the day before scheduled date
      const showFrom = new Date(scheduled);
      showFrom.setDate(showFrom.getDate() - 1); // go back 1 day
      showFrom.setHours(0, 0, 0, 0);            // midnight 00:00:00

      // clearAt = scheduled time + 1 hour
      const clearAt = new Date(scheduled.getTime() + this.CLEAR_AFTER_MS);

      return now >= showFrom.getTime() && now < clearAt.getTime();
    });
  }

  // ─── Relative time label ──────────────────────────────────────────────────
  getTimeLabel(notification: Notification): string {
    const diffMs = notification.scheduledDate.getTime() - Date.now();

    if (diffMs <= 0) return 'Started / Completed';

    const mins = Math.floor(diffMs / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hrs > 0) return `${hrs} hr${hrs > 1 ? 's' : ''} left`;
    return `${mins} min${mins > 1 ? 's' : ''} left`;
  }

  // ─── Password validator ───────────────────────────────────────────────────
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const np = control.get('newPassword');
    const cp = control.get('confirmPassword');
    if (!np || !cp) return null;
    return np.value === cp.value ? null : { passwordMismatch: true };
  }

  masters() { this.router.navigate(['/leadassignee']); }

  toggleProfileModal() { this.showProfileModal = !this.showProfileModal; }
  closeProfileModal() { this.showProfileModal = false; }
  toggleNotificationModal() { this.showNotificationModal = !this.showNotificationModal; }
  closeNotificationModal() { this.showNotificationModal = false; }

  openAllNotificationsModal() {
    this.showNotificationModal = false;
    this.showAllNotificationsModal = true;
  }
  closeAllNotificationsModal() { this.showAllNotificationsModal = false; }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'demo': return '📊';
      case 'call': return '📞';
      case 'meeting': return '📅';
      default: return '🔔';
    }
  }

  getNotificationTypeClass(type: string): string {
    return `notification-type-${type}`;
  }

  changeProfile() { this.closeProfileModal(); this.router.navigate(['/profile/change-name']); }
  changeProfileImage() { this.closeProfileModal(); this.router.navigate(['/profile/change-image']); }

  changePassword() {
    this.closeProfileModal();
    this.showPasswordModal = true;
    this.passwordForm.reset();
  }

  closePasswordModal() {
    this.showPasswordModal = false;
    this.passwordForm.reset();
  }

  toggleCurrentPassword() { this.showCurrentPassword = !this.showCurrentPassword; }
  toggleNewPassword() { this.showNewPassword = !this.showNewPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }

  onSubmitPassword() {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;
      console.log('Password change:', { currentPassword, newPassword });
      alert('Password changed successfully!');
      this.closePasswordModal();
    } else {
      Object.keys(this.passwordForm.controls).forEach(key =>
        this.passwordForm.get(key)?.markAsTouched()
      );
    }
  }

  toggleSidebar() { this.sidebarService.toggleSidebar(); }

  logout() {
    this.closeProfileModal();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}