import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Auth } from '../services/auth';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-report',
  imports: [CommonModule, FormsModule],
  templateUrl: './report.html',
  styleUrl: './report.css',
})
export class Report implements OnInit {
  searchSubject: Subject<string> = new Subject<string>();
  isLoading = false;
  report: any[] = [];
  searchText: string = '';
  showDeletePopup = false;
  selectedCustomerId: number | null = null;
  projects: any[] = [];
  today = new Date().toISOString().split('T')[0];

  reports = {
    from_date: this.today,
    to_date: this.today,
    type: '',
    activity_status: '',
    project_id: '',
    lead_id: '',
    customer_id: '',
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: Auth,
  ) {}

  getReport() {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const paramsObj: any = {
      from_date: this.reports.from_date ? this.reports.from_date : '',
      to_date: this.reports.to_date ? this.reports.to_date : '',
      type: this.reports.type ? this.reports.type : '',
      active_status: this.reports.activity_status ? this.reports.activity_status : '',
      project_id: this.reports.project_id ? this.reports.project_id : '',

      // lead_id: this.reports.lead_id ? this.reports.lead_id : null,
      // customer_id: this.reports.customer_id ? this.reports.customer_id : null,
    };
    console.log(paramsObj);
    console.log(this.reports);
    const params = new HttpParams({
      fromObject: paramsObj,
    });

    this.http
      .get<any>(`${this.authService.apiUrl}/activity-report`, {
        headers,
        params,
      })
      .subscribe({
        next: (response) => {
          this.report = response.data;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  loadProjects() {
    const token = this.authService.getToken(); 
    // const headers = new HttpHeaders({});
    const headers = new HttpHeaders({Authorization: `Bearer ${token}`,});
    this.http.get<any[]>(`${this.authService.apiUrl}/projects`, { headers }).subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: (err) => {
        console.error('Error loading projects:', err);
      },
    });
  }
  ngOnInit() {
    this.getReport();
    this.loadProjects();
  }
  onFilterChange() {
    this.getReport();
  }

  get totalreports(): number {
    return this.report.length;
  }
}
