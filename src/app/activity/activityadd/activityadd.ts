import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-activityadd',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './activityadd.html',
  styleUrl: './activityadd.css',
})
export class Activityadd implements OnInit {
  activityId: number | null = null;
  customers: any[] = [];
  leads: any[] = [];
  projects: any[] = [];

  activity = {
    type: '',
    project_id: '',
    activity_date: '',
    status: '',
    lead_id: '',
    customer_id: '',
    description: '',
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private authService: Auth,
  ) {}
  ngOnInit(): void {
    this.activityId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.activityId) {
      const today = new Date().toISOString().split('T')[0];
      this.activity.activity_date = today;
    }

    this.loadCustomers();
    this.loadLeads();
    this.loadProjects();
    if (this.activityId) {
      this.loadActivityForEdit(this.activityId);
    }
  }

  loadCustomers() {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<any[]>(`${this.authService.apiUrl}/customers`, { headers }).subscribe({
      next: (data) => {
        this.customers = data;
        console.log('Customers_:', this.customers);
      },
      error: (err) => {
        console.error('Error loading customers:', err);
      },
    });
  }
  loadLeads() {
    const tocken = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${tocken}`,
    });
    this.http.get<any[]>(`${this.authService.apiUrl}/leads`, { headers }).subscribe({
      next: (data) => {
        this.leads = data;
      },
      error: (err) => {
        console.error('Error loading leads:', err);
      },
    });
  }
  loadProjects() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({});
    // const headers = new HttpHeaders({Authorization: `Bearer ${token}`,});
    this.http.get<any[]>(`${this.authService.apiUrl}/projects`, { headers }).subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: (err) => {
        console.error('Error loading projects:', err);
      },
    });
  }

  loadActivityForEdit(id: number) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<any>(`${this.authService.apiUrl}/activities/${id}`, { headers }).subscribe({
      next: (data) => {
        this.activity = data;
        console.log('Edit Activity Data:', this.activity);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching activity:', err);
      },
    });
  }

  async saveActivity() {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    console.log('Activity saved successfully:', this.activity);
    try {
      const response = await firstValueFrom(
        this.http.post(`${this.authService.apiUrl}/activities`, this.activity, { headers }),
      );
      console.log('Activity saved successfully:', response);
      this.router.navigate(['/activity']);
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  }
  async updateActivity(activityId: number) {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    console.log('Activity updated successfully:', this.activity);
    try {
      const response = await firstValueFrom(
        this.http.put(`${this.authService.apiUrl}/activities/${activityId}`, this.activity, {
          headers,
        }),
      );
      console.log('Activity updated successfully:', response);
      this.router.navigate(['/activity']);
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  }

  clearForm() {
    this.activity = {
      type: '',
      project_id: '',
      activity_date: '',
      status: '',
      lead_id: '',
      customer_id: '',
      description: '',
    };
  }

  goBack() {
    this.router.navigate(['/activity']);
  }
}
