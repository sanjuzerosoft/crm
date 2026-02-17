import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Activity {
  id: number;
  type: 'call' | 'meeting' | 'demo';
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
export class Calendar {
  currentDate: Date = new Date();
  selectedDate: Date | null = null;
  showModal: boolean = false;
  selectedActivities: Activity[] = [];

  toggleButtons = {
    call: true,
    meeting: true,
    demo: true
  };

  colorMap = {
    call: '#4CAF50',
    meeting: '#2196F3',
    demo: '#FF9800'
  };

  // Sample data
  activities: Activity[] = [
    { id: 1, type: 'call', company: 'ABC Pvt Ltd', time: '10:00 AM', date: new Date(2026, 1, 5) },
    { id: 2, type: 'meeting', company: 'XYZ Corp', time: '02:00 PM', date: new Date(2026, 1, 5) },
    { id: 3, type: 'demo', company: 'Tech Solutions', time: '11:00 AM', date: new Date(2026, 1, 5) },
    { id: 4, type: 'call', company: 'Global Inc', time: '09:30 AM', date: new Date(2026, 1, 10) },
    { id: 5, type: 'meeting', company: 'Innovate Ltd', time: '03:00 PM', date: new Date(2026, 1, 12) },
    { id: 6, type: 'demo', company: 'StartUp Hub', time: '01:00 PM', date: new Date(2026, 1, 15) },
    { id: 7, type: 'call', company: 'Enterprise Co', time: '10:00 PM', date: new Date(2026, 1, 15) },
    { id: 8, type: 'meeting', company: 'Business Pro', time: '04:30 PM', date: new Date(2026, 1, 18) },
    { id: 9, type: 'demo', company: 'Digital Agency', time: '11:30 AM', date: new Date(2026, 1, 20) },
    { id: 10, type: 'call', company: 'Marketing Plus', time: '02:45 PM', date: new Date(2026, 1, 22) },
  ];

  get calendarDays(): Date[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
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

  toggleFilter(type: 'call' | 'meeting' | 'demo'): void {
    // No need to manually toggle, ngModel handles it
    // Just trigger change detection if needed
  }

  getActivitiesForDate(date: Date): Activity[] {
    return this.activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return this.toggleButtons[activity.type] &&
             activityDate.getDate() === date.getDate() &&
             activityDate.getMonth() === date.getMonth() &&
             activityDate.getFullYear() === date.getFullYear();
    });
  }

  getDisplayText(date: Date): string {
    const activities = this.getActivitiesForDate(date);
    if (activities.length === 0) return '';
    if (activities.length === 1) {
      return `${activities[0].type.charAt(0).toUpperCase() + activities[0].type.slice(1)}`;
    }
    return `${activities.length} activities`;
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
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  getTypeLabel(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
}