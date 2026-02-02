import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Auth } from '../../services/auth';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-activitylist',
  imports: [CommonModule, FormsModule],
  templateUrl: './activitylist.html',
  styleUrl: './activitylist.css',
})
export class Activitylist implements OnInit {
  searchSubject: Subject<string> = new Subject<string>();
  isLoading = false;
  activities: any[] = [];
  allActivities: any[] = [];
  searchText: string = '';
  showDeletePopup = false;
  selectedActivityId: number | null = null;

  openDeletePopup(id: number) {
    this.selectedActivityId = id;
    this.showDeletePopup = true;
  }

  closeDeletePopup() {
    this.showDeletePopup = false;
    this.selectedActivityId = null;
  }

  confirmDelete() {
    if (this.selectedActivityId !== null) {
      this.deleteActivities(this.selectedActivityId);
    }
    this.closeDeletePopup();
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: Auth,
  ) {}

  getActivities() {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .get<any[]>(`${this.authService.apiUrl}/activities`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching activities:', error);
          return throwError(() => error);
        }),
      )
      .subscribe({
        next: (data) => {
          this.activities = data;
          this.allActivities = data;
          console.log('activities:', this.activities);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching activities:', error);
        },
      });
  }

  ngOnInit() {
    this.getActivities();
    this.searchText = '';

    this.searchSubject
      .pipe(
        debounceTime(300), // wait 300ms after typing stops
        distinctUntilChanged(), // only if value changed
      )
      .subscribe((searchText) => {
        if (searchText.trim() === '') {
          this.activities = [...this.allActivities];
        } else {
          this.searchactivities(searchText);
        }
        this.cdr.detectChanges();
      });
  }

  //new

  onSearch() {
    this.searchSubject.next(this.searchText);
  }

  searchactivities(searchText: string) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.isLoading = true;

    this.http
      .get<any[]>(`${this.authService.apiUrl}/activities?search=${searchText}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Search failed:', error);
          this.isLoading = false;
          return throwError(() => error);
        }),
      )
      .subscribe((data) => {
        this.activities = data;
        console.log('activities search:', this.activities);
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  get totalactivities(): number {
    return this.activities.length;
  }

  Addactivities() {
    this.router.navigate(['/activity/add']);
  }

  editActivities(id: number) {
    console.log('Edit activity:', id);
    this.router.navigate(['/activity/view', id]);
  }

  viewActivities(id: number) {
    console.log('View activity:', id);
    this.searchText = '';
    this.activities = this.allActivities;
    this.router.navigate(['/activity/view', id]);
  }

  deleteActivities(id: number) {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http
      .delete(`${this.authService.apiUrl}/activities/${id}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Delete failed:', error);
          return throwError(() => error);
        }),
      )
      .subscribe(() => {
        this.getActivities();
        this.activities = this.activities.filter((l) => l.id !== id);
        this.allActivities = this.allActivities.filter((l) => l.id !== id);
      });
  }
}
