import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarService } from '../services/calendar.service';
import { ChangeDetectorRef } from '@angular/core';

interface Activity {
  id: number;
  activity_type: 'call' | 'meeting' | 'demo';
  company: string;
  time: string;
  date: Date;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar implements OnInit {
  currentDate: Date = new Date();
  selectedDate: Date | null = null;
  showModal: boolean = false;
  selectedActivities: Activity[] = [];
  allActivities: Activity[] = [];
  isLoading: boolean = false;

  toggleButtons: Record<'call' | 'meeting' | 'demo', boolean> = {
    call: true,
    meeting: true,
    demo: true
  };

  colorMap: Record<'call' | 'meeting' | 'demo', string> = {
    call: '#4CAF50',
    meeting: '#2196F3',
    demo: '#FF9800'
  };


  constructor(
  private calendarService: CalendarService,
  private cd: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
  this.isLoading = true;

  this.calendarService.getActivities().subscribe({
    next: (data) => {
      this.allActivities = [...data];
      this.isLoading = false;

      this.cd.detectChanges(); // 🔥 IMPORTANT FIX
    },
    error: (err) => {
      console.error('Error loading activities', err);
      this.isLoading = false;
    }
  });
}

  getActivitiesForDate(date: Date): Activity[] {
    return this.allActivities.filter(activity => {
      const activityDate = activity.date instanceof Date
        ? activity.date
        : new Date(activity.date);

      const sameDay =
        activityDate.getFullYear() === date.getFullYear() &&
        activityDate.getMonth() === date.getMonth() &&
        activityDate.getDate() === date.getDate();

      const toggleOn = this.toggleButtons[activity.activity_type] ?? false;

      return sameDay && toggleOn;
    });
  }

  toggleFilter(type: 'call' | 'meeting' | 'demo'): void {
    if (this.showModal && this.selectedDate) {
      this.selectedActivities = this.getActivitiesForDate(this.selectedDate);
      if (this.selectedActivities.length === 0) {
        this.closeModal();
      }
    }
  }

  getDisplayText(date: Date): string {
    const activities = this.getActivitiesForDate(date);
    if (activities.length === 0) return '';
    if (activities.length === 1) {
      return activities[0].activity_type.charAt(0).toUpperCase() + activities[0].activity_type.slice(1);
    }
    return `${activities.length} activities`;
  }

  getActivityColor(type: 'call' | 'meeting' | 'demo'): string {
    return this.colorMap[type] || '#607D8B';
  }

  onDateClick(date: Date): void {
    const activities = this.getActivitiesForDate(date);
    if (activities.length === 0) return;
    this.selectedDate = date;
    this.selectedActivities = activities;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedDate = null;
    this.selectedActivities = [];
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate.getMonth();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  getTypeLabel(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  get calendarDays(): Date[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: Date[] = [];
    const current = new Date(startDate);

    for (let i = 0; i < 35; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }
}