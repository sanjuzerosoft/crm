import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
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

  selectedParty: 'lead' | 'customer' = 'lead';

  activity = {
    type: '',
    project_id: '',
    activity_date: '',
    activity_type: '',
    scheduled_date: '',
    scheduled_time: '',
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
    this.activityId = Number(this.route.snapshot.paramMap.get('id')) || null;

    if (!this.activityId) {
      this.activity.activity_date = new Date().toISOString().split('T')[0];
    }

    this.loadCustomers();
    this.loadLeads();
    this.loadProjects();

    if (this.activityId) {
      this.loadActivityForEdit(this.activityId);
    }
  }

  onPartyChange(value: 'lead' | 'customer') {
    this.selectedParty = value;
    if (value === 'lead') {
      this.activity.customer_id = '';
    } else {
      this.activity.lead_id = '';
    }
  }

  loadCustomers() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    this.http.get<any[]>(`${this.authService.apiUrl}/customers`, { headers })
      .subscribe(data => this.customers = data);
  }

  loadLeads() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    this.http.get<any[]>(`${this.authService.apiUrl}/leads`, { headers })
      .subscribe(data => this.leads = data);
  }

  loadProjects() {
  this.http.get<any[]>(`${this.authService.apiUrl}/projects`)
    .subscribe(data => {
      this.projects = data;
      this.cdr.detectChanges(); 
    });
}

  loadActivityForEdit(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    this.http.get<any>(`${this.authService.apiUrl}/activities/${id}`, { headers })
      .subscribe(data => {
        this.activity = {
          type: data.type || '',
          project_id: data.project_id || '',
          activity_date: data.activity_date || '',
          activity_type: data.activity_type || '',
          scheduled_date: data.scheduled_date || '',
          scheduled_time: data.scheduled_time || '',
          lead_id: data.lead_id || '',
          customer_id: data.customer_id || '',
          description: data.description || '',
        };
        this.selectedParty = data.lead_id ? 'lead' : 'customer';
        this.cdr.detectChanges();
      });
  }

  async saveActivity() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    await firstValueFrom(
      this.http.post(`${this.authService.apiUrl}/activities`, this.activity, { headers })
    );
    this.router.navigate(['/activity']);
  }

  async updateActivity(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    await firstValueFrom(
      this.http.put(`${this.authService.apiUrl}/activities/${id}`, this.activity, { headers })
    );
    this.router.navigate(['/activity']);
  }

  onActivityTypeChange() {
    // Clear scheduled fields when activity type is cleared
    if (!this.activity.activity_type) {
      this.activity.scheduled_date = '';
      this.activity.scheduled_time = '';
    }
  }

  clearForm() {
    this.activity = {
      type: '',
      project_id: '',
      activity_date: '',
      activity_type: '',
      scheduled_date: '',
      scheduled_time: '',
      lead_id: '',
      customer_id: '',
      description: '',
    };
    this.selectedParty = 'lead';
  }

  goBack() {
    this.router.navigate(['/activity']);
  }
}