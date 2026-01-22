import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../../services/auth';


@Component({
  selector: 'app-leadsadd',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './leadsadd.html',
  styleUrl: './leadsadd.css',
})
export class Leadsadd implements OnInit {

  leadId: number | null = null;  

  lead = {
    first_name: '',
    last_name: '',
    lead_assignee: '',
    lead_status: '',
    mobile: '',
    email: '',
    company_name: '',
    industry_type: '',
    lead_source: '',
    website: '',
    door_no: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zip_code: '',
    description: '',
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  private authService: Auth
  ) {}  
  ngOnInit(): void {
    this.leadId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.leadId) {
      this.loadLeadForEdit(this.leadId);
    }
  }

  loadLeadForEdit(id: number) {
    const token = this.authService.getToken();    
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<any>(`${this.authService.apiUrl}/leads/${id}`, { headers })
      .subscribe({
        next: (data) => {
          this.lead = data;
          console.log('Edit Lead Data:', this.lead);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching lead:', err);
        },
      });
  }

  async saveLead() {
    const token = this.authService.getToken();

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
    console.log('Lead saved successfully:', this.lead);
    try {
      const response = await firstValueFrom(this.http.post(`${this.authService.apiUrl}/leads`, this.lead, { headers }));
      console.log('Lead saved successfully:', response);
      this.router.navigate(['/leads']);
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  }
  async updateLead(leadId: number) {
    const token =this.authService.getToken();

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
    console.log('Lead saved successfully:', this.lead);
    try {
      const response = await firstValueFrom(this.http.put(`${this.authService.apiUrl}/leads/${leadId}`, this.lead, { headers }));
      console.log('Lead saved successfully:', response);
      this.router.navigate(['/leads']);
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  }
  

  clearForm() {
    this.lead = {
      first_name: '',
      last_name: '',
      lead_assignee: '',
      lead_status: '',
      mobile: '',
      email: '',
      company_name: '',
      industry_type: '',
      lead_source: '',
      website: '',
      door_no: '',
      street: '',
      city: '',
      state: '',
      country: '',
      zip_code: '',
      description: '',
    };
  }

  goBack() {
    this.router.navigate(['/leads']);
  }
}
