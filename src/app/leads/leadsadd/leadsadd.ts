import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.leadId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.leadId) {
      this.loadLeadForEdit(this.leadId);
    }
  }

  loadLeadForEdit(id: number) {
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3ZlcmlmeS1vdHAiLCJpYXQiOjE3NjgzMDI4NTQsImV4cCI6MTc2ODMwNjQ1NCwibmJmIjoxNzY4MzAyODU0LCJqdGkiOiI4d1pSbkVuWDh3RTkxcktBIiwic3ViIjoiOSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.rqfyjI2Dy45vhpipUrY-GqbOX2QTZF4jGwZ76khp2O4';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<any>(`http://127.0.0.1:8000/api/leads/${id}`, { headers })
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
    const apiUrl = 'http://127.0.0.1:8000/api/leads';
    const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3ZlcmlmeS1vdHAiLCJpYXQiOjE3NjgzMDI4NTQsImV4cCI6MTc2ODMwNjQ1NCwibmJmIjoxNzY4MzAyODU0LCJqdGkiOiI4d1pSbkVuWDh3RTkxcktBIiwic3ViIjoiOSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.rqfyjI2Dy45vhpipUrY-GqbOX2QTZF4jGwZ76khp2O4';

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
    console.log('Lead saved successfully:', this.lead);
    try {
      const response = await firstValueFrom(this.http.post(apiUrl, this.lead, { headers }));
      console.log('Lead saved successfully:', response);
      this.router.navigate(['/leads']);
    } catch (error) {
      console.error('Error saving lead:', error);
      // Optionally show user-friendly error message
      alert('Failed to save lead. Please try again.');
    }
  }
  async updateLead(leadId: number) {
    const apiUrl = `http://127.0.0.1:8000/api/leads/${leadId}`;
    const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL3ZlcmlmeS1vdHAiLCJpYXQiOjE3NjgzMDI4NTQsImV4cCI6MTc2ODMwNjQ1NCwibmJmIjoxNzY4MzAyODU0LCJqdGkiOiI4d1pSbkVuWDh3RTkxcktBIiwic3ViIjoiOSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.rqfyjI2Dy45vhpipUrY-GqbOX2QTZF4jGwZ76khp2O4';

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
    console.log('Lead saved successfully:', this.lead);
    try {
      const response = await firstValueFrom(this.http.put(apiUrl, this.lead, { headers }));
      console.log('Lead saved successfully:', response);
      this.router.navigate(['/leads']);
    } catch (error) {
      console.error('Error saving lead:', error);
      // Optionally show user-friendly error message
      alert('Failed to save lead. Please try again.');
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
